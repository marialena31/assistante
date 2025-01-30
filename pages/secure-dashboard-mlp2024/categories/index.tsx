import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '../../../components/layout/AdminLayout';
import { createClient } from '../../../utils/supabase/client';
import { SECURE_ROUTES } from '../../../config/secureRoutes';
import { useToast } from '../../../components/ui/Toast';
import type { BlogCategory } from '../../../types/blog';
import { DeleteIcon } from '../../../components/admin/blog/icons';

export default function CategoriesManagement() {
  const router = useRouter();
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const { toast } = useToast();

  useEffect(() => {
    checkUser();
    fetchCategories();
  }, []);

  const checkUser = async () => {
    try {
      // Get user from auth token (always use getUser on server)
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error || !user?.email?.endsWith('@marialena-pietri.fr')) {
        router.push(SECURE_ROUTES.SIGNIN);
        return;
      }
      
      if (!user.email?.endsWith('@marialena-pietri.fr')) {
        await supabase.auth.signOut();
        toast.showErrorToast('Accès non autorisé');
        router.push(SECURE_ROUTES.SIGNIN);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      router.push(SECURE_ROUTES.SIGNIN);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .schema('api')
        .from('blog_categories')
        .select('*')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.showErrorToast('Erreur lors du chargement des catégories');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = async () => {
    const name = window.prompt('Nom de la catégorie:');
    if (!name) return;

    try {
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const { error } = await supabase
        .schema('api')
        .from('blog_categories')
        .insert([{ name, slug }]);

      if (error) throw error;
      toast.showSuccessToast('Catégorie créée avec succès');
      fetchCategories();
    } catch (error) {
      console.error('Error creating category:', error);
      toast.showErrorToast('Erreur lors de la création de la catégorie');
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) return;

    try {
      const { error } = await supabase
        .schema('api')
        .from('blog_categories')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.showSuccessToast('Catégorie supprimée avec succès');
      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.showErrorToast('Erreur lors de la suppression de la catégorie');
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Catégories | Administration">
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Catégories | Administration">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">Gestion des Catégories</h1>
            <button
              onClick={handleCreateCategory}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark"
            >
              Nouvelle Catégorie
            </button>
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nom
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Slug
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {categories.map((category) => (
                  <tr key={category.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {category.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {category.slug}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleDeleteCategory(String(category.id))}
                        className="text-red-600 hover:text-red-900"
                        title="Supprimer la catégorie"
                      >
                        <DeleteIcon className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
