import { GetStaticPaths, GetStaticProps } from 'next';
import { createClient } from '@supabase/supabase-js';
import Layout from '../../components/layout/Layout';
import Image from 'next/legacy/image';
import { formatDate } from '../../utils/date';
import type { BlogPost } from '../../types/blog';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

interface BlogPostPageProps {
  post: BlogPost;
}

const BlogPostPage = ({ post }: BlogPostPageProps) => {
  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <Layout title={post.title} description={post.excerpt || undefined}>
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Link
            href="/blog"
            className="inline-flex items-center text-primary hover:text-primary-dark transition-colors mb-4"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Retour aux articles
          </Link>
        </div>
        <header className="mb-8">
          {post.categories && post.categories.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {post.categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/blog?category=${category.slug}`}
                  className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          )}
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
          <div className="flex items-center text-gray-600 mb-4">
            <time dateTime={post.created_at}>{formatDate(post.created_at)}</time>
            {post.author && (
              <>
                <span className="mx-2">•</span>
                <span>{post.author}</span>
              </>
            )}
          </div>
          {post.featured_image && (
            <div className="relative w-full h-96 mb-8">
              <Image
                src={post.featured_image.startsWith('http') ? post.featured_image : `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/blog-images/${post.featured_image}`}
                alt={post.title}
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
                priority
              />
            </div>
          )}
        </header>
        <div 
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>
    </Layout>
  );
};

export default BlogPostPage;

export const getStaticPaths = async () => {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: posts } = await supabase
    .schema('api')
    .from('blog_posts')
    .select('slug')
    .eq('status', 'published');

  return {
    paths: posts?.map((post) => ({
      params: { slug: post.slug }
    })) || [],
    fallback: true
  };
};

export const getStaticProps: GetStaticProps<BlogPostPageProps> = async ({ params }) => {
  const slug = params?.slug;
  if (typeof slug !== 'string') {
    return { notFound: true };
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  try {
    const { data: post, error } = await supabase
      .schema('api')
      .from('blog_posts')
      .select(`
        id,
        title,
        slug,
        content,
        excerpt,
        featured_image,
        author,
        created_at,
        updated_at,
        status,
        seo,
        blog_posts_categories!inner (
          blog_categories (
            id,
            name,
            slug,
            description
          )
        )
      `)
      .eq('slug', slug)
      .eq('status', 'published')
      .single();

    if (error || !post) {
      console.error('Error fetching post:', error);
      return { notFound: true };
    }

    return {
      props: {
        post: {
          ...post,
          categories: post.blog_posts_categories
            ? post.blog_posts_categories.map((cat: any) => cat.blog_categories)
            : []
        }
      },
      revalidate: 60
    };
  } catch (error) {
    console.error('Error in getStaticProps:', error);
    return { notFound: true };
  }
};
