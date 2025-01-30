import { NextApiRequest, NextApiResponse } from 'next';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

interface Article {
  title: string;
  slug?: string;
  content: string;
  excerpt?: string;
  featured_image?: string;
  status?: 'draft' | 'published';
  created_at?: string;
  categories?: string[];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée. Utilisez POST.' });
  }

  try {
    // Initialize Supabase client with cookies from the request
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!, // Use service key for admin operations
      {
        cookies: {
          get(name: string) {
            return req.cookies[name];
          },
          set(name: string, value: string, options: any) {
            res.setHeader('Set-Cookie', `${name}=${value}; Path=/; HttpOnly; SameSite=Lax`);
          },
          remove(name: string, options: any) {
            res.setHeader('Set-Cookie', `${name}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`);
          },
        },
      }
    );

    // Get the current session
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      console.error('Auth error:', authError);
      return res.status(401).json({ error: 'Non authentifié' });
    }

    if (!user || !user.email?.endsWith('@marialena-pietri.fr')) {
      console.error('Unauthorized email:', user?.email);
      return res.status(403).json({ error: 'Accès non autorisé' });
    }

    // Validate request body
    const articles: Article[] = req.body;
    if (!Array.isArray(articles)) {
      return res.status(400).json({ error: 'Format invalide. Le fichier doit contenir un tableau d\'articles.' });
    }

    if (articles.length === 0) {
      return res.status(400).json({ error: 'Le fichier ne contient aucun article.' });
    }

    // Validate each article
    for (let i = 0; i < articles.length; i++) {
      const article = articles[i];
      if (!article.title?.trim()) {
        return res.status(400).json({ error: `Article ${i + 1}: le titre est requis.` });
      }
      if (!article.content?.trim()) {
        return res.status(400).json({ error: `Article ${i + 1}: le contenu est requis.` });
      }
      if (article.status && !['draft', 'published'].includes(article.status)) {
        return res.status(400).json({ error: `Article ${i + 1}: le statut doit être 'draft' ou 'published'.` });
      }
      if (article.created_at && isNaN(Date.parse(article.created_at))) {
        return res.status(400).json({ error: `Article ${i + 1}: la date de création n'est pas valide.` });
      }
    }

    // Process each article
    const results = await Promise.all(articles.map(async (article, index) => {
      try {
        // Create the post
        const { data: post, error: postError } = await supabase
          .schema('api')
          .from('blog_posts')
          .insert([{
            title: article.title.trim(),
            slug: article.slug?.trim() || article.title.toLowerCase().trim()
              .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/^-+|-+$/g, ''),
            content: article.content.trim(),
            excerpt: article.excerpt?.trim(),
            featured_image: article.featured_image?.trim(),
            status: article.status || 'draft',
            created_at: article.created_at || new Date().toISOString(),
            updated_at: new Date().toISOString()
          }])
          .select()
          .single();

        if (postError) throw postError;

        // Create category relationships
        if (article.categories && article.categories.length > 0) {
          const categoryLinks = article.categories.map(categoryName => ({
            post_id: post.id,
            category_name: categoryName.trim()
          }));

          const { error: categoriesError } = await supabase
            .schema('api')
            .from('blog_posts_categories')
            .insert(categoryLinks);

          if (categoriesError) throw categoriesError;
        }

        return { success: true, title: article.title };
      } catch (error: any) {
        return { 
          success: false, 
          title: article.title, 
          error: error.message
        };
      }
    }));

    const successCount = results.filter(r => r.success).length;
    const failureCount = results.filter(r => !r.success).length;

    return res.status(200).json({
      message: `Import terminé. ${successCount} article${successCount > 1 ? 's' : ''} importé${successCount > 1 ? 's' : ''} avec succès${failureCount ? `, ${failureCount} échec${failureCount > 1 ? 's' : ''}` : '.'}`,
      results
    });

  } catch (error: any) {
    console.error('Import error:', error);
    return res.status(500).json({ 
      error: 'Erreur lors de l\'import des articles.',
      details: error.message
    });
  }
}
