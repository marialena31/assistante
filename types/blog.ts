export type PostStatus = 'draft' | 'published' | 'scheduled';

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface BlogPostSEO {
  title: string | null;
  description: string | null;
  keywords: string[] | null;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  featured_image: string | null;
  author: string | null;
  created_at: string;
  updated_at: string;
  status: PostStatus;
  categories?: BlogCategory[];
  seo: BlogPostSEO | null;
}

// Type for the joined categories from database
export interface BlogPostCategoryJoin {
  blog_categories: BlogCategory;
}

// Type for blog post with joined categories from database
export interface BlogPostWithJoinedCategories extends Omit<BlogPost, 'categories'> {
  categories?: BlogPostCategoryJoin[];
}

export interface BlogPostFormData {
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  featured_image: string | null;
  author?: string | null;
  status: PostStatus;
  categories: string[];
  seo: BlogPostSEO | null;
}
