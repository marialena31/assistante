import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '../../../../components/admin/AdminLayout';
import { createClient } from '../../../../utils/supabase/client';
import PostEditor from '../../../../components/admin/blog/PostEditor';
import { SECURE_ROUTES } from '../../../../config/secureRoutes';
import { useToast } from '../../../../components/ui/Toast';
import type { BlogPost, BlogPostFormData } from '../../../../types/blog';

export default function EditBlogPost() {
  const router = useRouter();
  const { id } = router.query;
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      fetchPost();
    }
  }, [id]);

  const fetchPost = async () => {
    try {
      const { data, error } = await supabase
        .schema('api')
        .from('blog_posts')
        .select(`
          *,
          categories:blog_posts_categories(
            blog_categories(*)
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!data) throw new Error('Article non trouvé');

      const transformedData = {
        ...data,
        categories: data.blog_posts_categories?.map((cat: any) => cat.blog_categories) || []
      };

      setPost(transformedData);
    } catch (error: any) {
      console.error('Error fetching post:', error);
      toast.showErrorToast(error.message || 'Erreur lors du chargement de l\'article', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (formData: BlogPostFormData) => {
    if (!id) return;
    setLoading(true);

    try {
      const updatedPost = {
        ...formData,
        blog_posts_categories: formData.categories.map(categoryId => ({
          post_id: id,
          category_id: categoryId
        }))
      };

      // First update the blog post
      const { error: postError } = await supabase
        .schema('api')
        .from('blog_posts')
        .update({
          title: updatedPost.title,
          slug: updatedPost.slug,
          content: updatedPost.content,
          excerpt: updatedPost.excerpt,
          featured_image: updatedPost.featured_image,
          status: updatedPost.status,
          seo: updatedPost.seo,
          author: updatedPost.author
        })
        .eq('id', id);

      if (postError) throw postError;

      // Then update the categories
      // First, delete all existing category relationships
      const { error: deleteError } = await supabase
        .schema('api')
        .from('blog_posts_categories')
        .delete()
        .eq('post_id', id);

      if (deleteError) throw deleteError;

      // Then insert the new category relationships
      if (updatedPost.blog_posts_categories.length > 0) {
        const { error: categoriesError } = await supabase
          .schema('api')
          .from('blog_posts_categories')
          .insert(updatedPost.blog_posts_categories);

        if (categoriesError) throw categoriesError;
      }

      toast.showSuccessToast('Article mis à jour avec succès');
      router.push(SECURE_ROUTES.ADMIN_BLOG);
    } catch (error: any) {
      console.error('Error updating post:', error);
      toast.showErrorToast(error.message || 'Erreur lors de la mise à jour de l\'article');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push(SECURE_ROUTES.ADMIN_BLOG);
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {post ? (
          <PostEditor
            post={post}
            onSubmit={handleSave}
            onCancel={handleCancel}
            loading={loading}
          />
        ) : (
          <div className="text-center">
            {loading ? (
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mx-auto"></div>
            ) : (
              <p className="text-gray-500">Article non trouvé</p>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
