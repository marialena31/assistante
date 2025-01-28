import React, { useState, useEffect } from 'react';
import { GetStaticProps } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { createClient } from '@supabase/supabase-js';
import Layout from '../../components/layout/Layout';
import Image from 'next/legacy/image';
import type { Database } from '../../types/database';

// Create a single supabase client for interacting with your database
const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    db: {
      schema: 'api'
    }
  }
);

type BlogPost = Database['api']['Tables']['blog_posts']['Row'] & {
  categories?: Database['api']['Tables']['blog_categories']['Row'][]
};
type BlogCategory = Database['api']['Tables']['blog_categories']['Row'];

interface Props {
  posts: BlogPost[];
  categories: BlogCategory[];
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function Blog({ posts, categories }: Props) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [postsState, setPostsState] = useState(posts);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Update postsState when props change
  useEffect(() => {
    setPostsState(posts);
  }, [posts]);

  const filteredPosts = selectedCategory === 'all'
    ? postsState
    : postsState.filter(post => 
        post.categories?.some(cat => cat.slug === selectedCategory)
      );

  // Handle category change
  const handleCategoryChange = (categorySlug: string) => {
    setSelectedCategory(categorySlug);
    router.push(
      {
        pathname: router.pathname,
        query: { ...router.query, category: categorySlug }
      },
      undefined,
      { shallow: true }
    );
  };

  return (
    <Layout 
      title="Blog - Maria-Lena Pietri"
      description="Articles et actualités sur l'assistance administrative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Blog</h1>
        
        {/* Category filter */}
        <div className="mb-12">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Filtrer par catégorie</h2>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Tous les articles
              <span className="ml-2 text-xs">({postsState.length})</span>
            </button>
            {categories.map((category) => {
              const postsInCategory = postsState.filter(post => 
                post.categories?.some(cat => cat.slug === category.slug)
              ).length;
              
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.slug)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === category.slug
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.name}
                  <span className="ml-2 text-xs">({postsInCategory})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Posts grid */}
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mx-auto"></div>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-8 text-gray-600">
            Aucun article trouvé dans cette catégorie.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post, index) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group block"
              >
                <article className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 group-hover:transform group-hover:-translate-y-1">
                  {post.featured_image && (
                    <div className="relative w-full h-64">
                      <Image
                        src={post.featured_image.startsWith('http') ? post.featured_image : `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/blog-images/${post.featured_image}`}
                        alt={post.title}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-lg"
                        priority={index === 0}
                      />
                    </div>
                  )}
                  <div className="p-6">
                    {post.categories && post.categories.length > 0 && (
                      <div className="mb-4 flex flex-wrap gap-2">
                        {post.categories.map((category) => (
                          <span
                            key={category.id}
                            className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-primary/10 text-primary"
                          >
                            {category.name}
                          </span>
                        ))}
                      </div>
                    )}
                    <h2 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </h2>
                    {post.excerpt && (
                      <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                    )}
                    <div className="flex items-center text-sm text-gray-500">
                      <time dateTime={post.created_at}>
                        {formatDate(post.created_at)}
                      </time>
                      {post.author && (
                        <>
                          <span className="mx-2">•</span>
                          <span>{post.author}</span>
                        </>
                      )}
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  try {
    // Fetch posts with their categories
    const { data: posts, error: postsError } = await supabase
      .from('blog_posts')
      .select(`
        *,
        categories:blog_posts_categories(
          blog_categories(*)
        )
      `)
      .eq('status', 'published')
      .order('created_at', { ascending: false });

    if (postsError) throw postsError;

    // Transform posts to include properly structured categories
    const transformedPosts = posts?.map(post => ({
      ...post,
      categories: post.categories
        ?.map((cat: any) => cat.blog_categories)
        .filter(Boolean)
    })) || [];

    // Fetch categories
    const { data: categories, error: categoriesError } = await supabase
      .from('blog_categories')
      .select('*')
      .order('name');

    if (categoriesError) throw categoriesError;

    return {
      props: {
        posts: transformedPosts,
        categories: categories || []
      },
      revalidate: 60 // Revalidate every minute
    };
  } catch (error) {
    console.error('Error fetching blog data:', error);
    return {
      props: {
        posts: [],
        categories: []
      }
    };
  }
};