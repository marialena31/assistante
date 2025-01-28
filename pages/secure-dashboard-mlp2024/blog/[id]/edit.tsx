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
  const { showToast } = useToast();

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
      showToast(error.message || 'Erreur lors du chargement de l\'article', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (formData: BlogPostFormData) => {
    if (!id) return;
    setLoading(true);

    try {
      // First update the blog post
      const { error: postError } = await supabase
        .schema('api')
        .from('blog_posts')
        .update({
          title: formData.title,
          slug: formData.slug,
          content: formData.content,
          excerpt: formData.excerpt,
          featured_image: formData.featured_image,
          status: formData.status,
          seo: formData.seo,
          author: formData.author
        })
        .eq('id', id);

      if (postError) throw postError;

      // Then update the categories
      // First, delete all existing category relationships
      const { error: deleteError } = await supabase
        .schema('api')
        .from('blog_posts_categories')
        .delete()
        .eq('blog_post_id', id);

      if (deleteError) throw deleteError;

      // Then insert the new category relationships
      if (formData.categories.length > 0) {
        const categoryLinks = formData.categories.map(categoryId => ({
          blog_post_id: id,
          blog_category_id: categoryId
        }));

        const { error: categoriesError } = await supabase
          .schema('api')
          .from('blog_posts_categories')
          .insert(categoryLinks);

        if (categoriesError) throw categoriesError;
      }

      showToast('Article mis à jour avec succès', 'success');
      router.push(SECURE_ROUTES.BLOG.LIST);
    } catch (error: any) {
      console.error('Error updating post:', error);
      showToast(error.message || 'Erreur lors de la mise à jour de l\'article', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push(SECURE_ROUTES.BLOG.LIST);
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
