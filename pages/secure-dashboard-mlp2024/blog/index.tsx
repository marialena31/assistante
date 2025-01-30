import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '../../../components/layout/AdminLayout';
import { createClient } from '../../../utils/supabase/client';
import { SECURE_ROUTES } from '../../../config/secureRoutes';
import { useToast } from '../../../components/ui/Toast';
import type { BlogPost, BlogPostWithJoinedCategories } from '../../../types/blog';
import { EditIcon, DeleteIcon, ImportIcon, ExportIcon, TemplateIcon, PlusIcon } from '../../../components/admin/blog/icons';

export default function BlogManagement() {
  const router = useRouter();
  const [posts, setPosts] = useState<BlogPostWithJoinedCategories[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();
  const { showToast } = useToast();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Get user from auth token (always use getUser on server)
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user?.email?.endsWith('@marialena-pietri.fr')) {
          router.push(SECURE_ROUTES.SIGNIN);
          return;
        }
        
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Auth error:', error);
        showToast('Erreur', 'Erreur d\'authentification', 'error');
      }
    };

    initializeAuth();
  }, [router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchPosts();
    }
  }, [isAuthenticated]);

  const fetchPosts = async () => {
    try {
      const { data: posts, error } = await supabase
        .schema('api')
        .from('blog_posts')
        .select(`
          *,
          categories:blog_posts_categories(
            blog_categories(*)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const transformedPosts: BlogPostWithJoinedCategories[] = posts.map(post => ({
        ...post,
        categories: post.categories
          .map((cat: { blog_categories: any; }) => cat.blog_categories)
          .filter(Boolean)
      }));

      setPosts(transformedPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
      showToast('Erreur', 'Erreur lors du chargement des articles', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = () => {
    router.push(`${SECURE_ROUTES.ADMIN_BLOG}/new`);
  };

  const handleEditPost = (id: number) => {
    router.push(`${SECURE_ROUTES.ADMIN_BLOG}/${id}`);
  };

  const handleDeletePost = async (id: number) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
      return;
    }

    try {
      const { error } = await supabase
        .schema('api')
        .from('blog_posts')
        .delete()
        .match({ id });

      if (error) throw error;

      setPosts(posts.filter(post => post.id !== id));
      showToast('Succès', 'Article supprimé avec succès', 'success');
    } catch (error) {
      console.error('Error deleting post:', error);
      showToast('Erreur', 'Erreur lors de la suppression', 'error');
    }
  };

  return (
    <AdminLayout>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-xl font-semibold text-gray-900">Articles</h1>
            <p className="mt-2 text-sm text-gray-700">
              Liste de tous les articles du blog
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <button
              onClick={handleCreatePost}
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 sm:w-auto"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Nouvel article
            </button>
          </div>
        </div>

        {loading ? (
          <div className="mt-8 flex justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="mt-8 flex flex-col">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle">
                <div className="overflow-hidden shadow-sm ring-1 ring-black ring-opacity-5">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 lg:pl-8">
                          Titre
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Catégories
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Statut
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Date
                        </th>
                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6 lg:pr-8">
                          <span className="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {posts.map((post) => (
                        <tr key={post.id}>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8">
                            {post.title}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {post.categories?.map(cat => cat.name).join(', ')}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {post.status}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {new Date(post.created_at).toLocaleDateString('fr-FR')}
                          </td>
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 lg:pr-8">
                            <div className="flex justify-end space-x-2">
                              <button
                                onClick={() => handleEditPost(post.id)}
                                className="text-primary hover:text-primary-dark"
                              >
                                <EditIcon className="h-5 w-5" />
                              </button>
                              <button
                                onClick={() => handleDeletePost(post.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                <DeleteIcon className="h-5 w-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
