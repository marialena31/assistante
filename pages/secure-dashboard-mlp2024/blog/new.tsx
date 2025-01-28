import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '../../../components/admin/AdminLayout';
import { createClient } from '../../../utils/supabase/client';
import PostEditor from '../../../components/admin/blog/PostEditor';
import { SECURE_ROUTES } from '../../../config/secureRoutes';
import { useToast } from '../../../components/ui/Toast';
import type { BlogPost, BlogPostFormData } from '../../../types/blog';

export default function NewBlogPost() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const supabase = createClient();
  const { showToast } = useToast();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        router.push(SECURE_ROUTES.LOGIN);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      router.push(SECURE_ROUTES.LOGIN);
    }
  };

  const handleSave = async (formData: BlogPostFormData) => {
    setLoading(true);
    try {
      // First, insert the blog post
      const { data: post, error: postError } = await supabase
        .schema('api')
        .from('blog_posts')
        .insert([{
          title: formData.title,
          slug: formData.slug,
          content: formData.content,
          excerpt: formData.excerpt,
          featured_image: formData.featured_image,
          status: formData.status,
          seo: formData.seo,
          author: formData.author
        }])
        .select()
        .single();

      if (postError) throw postError;
      if (!post) throw new Error('Failed to create post');

      // Then, if there are categories, insert the category relationships
      if (formData.categories.length > 0) {
        const categoryLinks = formData.categories.map(categoryId => ({
          blog_post_id: post.id,
          blog_category_id: categoryId
        }));

        const { error: categoriesError } = await supabase
          .schema('api')
          .from('blog_posts_categories')
          .insert(categoryLinks);

        if (categoriesError) throw categoriesError;
      }

      showToast('Article créé avec succès', 'success');
      router.push(SECURE_ROUTES.BLOG.LIST);
    } catch (error: any) {
      console.error('Error saving post:', error);
      showToast(error.message || 'Erreur lors de la création de l\'article', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push(SECURE_ROUTES.BLOG.LIST);
  };

  const emptyPost: Partial<BlogPost> = {
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    featured_image: '',
    status: 'draft',
    seo: {
      title: '',
      description: '',
      keywords: [],
    },
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PostEditor 
          post={emptyPost}
          onSubmit={handleSave} 
          onCancel={handleCancel} 
          loading={loading} 
        />
      </div>
    </AdminLayout>
  );
}
