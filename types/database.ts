export interface Content {
  id?: number
  title: string
  content: string
  type: 'page' | 'component'
  slug: string
  created_at: string
  updated_at: string
  properties?: Record<string, any>
}

export interface Page {
  id: number
  title: string
  content: string
  slug: string
  created_at: string
  updated_at: string
}

export interface BlogCategory {
  id: number
  name: string
  slug: string
  created_at: string
  updated_at: string
}

export interface BlogPostCategory {
  blog_categories: BlogCategory
}

export interface BlogPost {
  id: number
  title: string
  slug: string
  content: string
  excerpt: string | null
  featured_image: string | null
  author: string | null  // UUID reference to auth.users(id)
  status: 'draft' | 'published' | 'scheduled'
  published_at: string | null
  seo_title: string | null
  seo_description: string | null
  created_at: string
  updated_at: string
  categories?: BlogCategory[]
  blog_posts_categories?: BlogPostCategory[]
}

export interface NewsletterSubscription {
  id: number
  email: string
  is_deleted: boolean
  created_at: string
  updated_at: string
}

export interface Database {
  api: {
    Tables: {
      contents: {
        Row: Content
        Insert: Omit<Content, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Content, 'id' | 'created_at' | 'updated_at'>>
      }
      pages: {
        Row: Page
        Insert: Omit<Page, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Page, 'id' | 'created_at' | 'updated_at'>>
      }
      blog_posts: {
        Row: BlogPost
        Insert: Omit<BlogPost, 'id' | 'created_at' | 'updated_at' | 'blog_posts_categories' | 'categories'>
        Update: Partial<Omit<BlogPost, 'id' | 'created_at' | 'updated_at' | 'blog_posts_categories' | 'categories'>>
      }
      blog_categories: {
        Row: BlogCategory
        Insert: Omit<BlogCategory, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<BlogCategory, 'id' | 'created_at' | 'updated_at'>>
      }
      newsletter_subscriptions: {
        Row: NewsletterSubscription
        Insert: Omit<NewsletterSubscription, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<NewsletterSubscription, 'id' | 'created_at' | 'updated_at'>>
      }
    }
  }
}
