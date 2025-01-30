export type PostStatus = 'draft' | 'published' | 'scheduled';

export interface BlogCategory {
  id: number;
  name: string;
  slug: string;
  created_at: string;
  updated_at: string;
}

export interface BlogPostCategory {
  post_id: string;  // UUID from blog_posts
  category_id: string;  // UUID from blog_categories
}

export interface BlogPostSEO {
  title: string | null;
  description: string | null;
  keywords: string[];
}

export interface BlogPost {
  id: number
  title: string
  slug: string
  content: string
  excerpt: string | null
  featured_image: string | null
  author: string | null  // UUID reference to auth.users(id)
  status: PostStatus
  created_at: string
  updated_at: string
  categories?: BlogCategory[]
  blog_posts_categories?: BlogPostCategory[]
  seo: BlogPostSEO | null
}

// Type for the joined categories from database
export interface BlogPostCategoryJoin {
  [x: string]: any;
  blog_categories: BlogCategory;
}

// Type for blog post with joined categories from database
export interface BlogPostWithJoinedCategories extends Omit<BlogPost, 'categories'> {
  categories?: BlogPostCategoryJoin[];
  readonly published: boolean;
}

export interface BlogPostFormData {
  [x: string]: any;
  title: string;
  content: string;
  excerpt: string;
  slug: string;
  status: PostStatus;
  featured_image: string;
  author: string | null;  // UUID reference to auth.users(id)
  categories: number[];  // Array of category IDs to link in junction table
  seo: BlogPostSEO;  // SEO data stored in JSONB column
}

export interface BlogPostInput {
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  featured_image: string | null;
  author: string | null;
  status: PostStatus;
  published_at: string | null;
  seo: BlogPostSEO | null;
  categories: number[];
}
