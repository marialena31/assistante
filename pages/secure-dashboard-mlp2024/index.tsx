import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '../../components/admin/AdminLayout';
import { createClient } from '../../utils/supabase/client';
import { SECURE_ROUTES } from '../../config/secureRoutes';
import type { Content } from '../../types/database';
import DynamicForm from '../../components/admin/DynamicForm';
import Link from 'next/link';
import { useToast } from '../../components/ui/Toast';

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [contents, setContents] = useState<Content[]>([]);
  const [activeType, setActiveType] = useState<'page' | 'component'>('page');
  const [editingContent, setEditingContent] = useState<Content | null>(null);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();
  const { showToast } = useToast();

  useEffect(() => {
    checkUser();
  }, []);

  useEffect(() => {
    if (user) {
      loadContents();
    }
  }, [user, activeType]);

  const checkUser = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        console.error('Error checking auth status:', error);
        window.location.href = SECURE_ROUTES.LOGIN;
        return;
      }
      
      if (!user) {
        window.location.href = SECURE_ROUTES.LOGIN;
        return;
      }

      if (!user.email?.endsWith('@marialena-pietri.fr')) {
        showToast("Vous n'avez pas les droits d'accès administrateur", 'error');
        await supabase.auth.signOut();
        window.location.href = SECURE_ROUTES.LOGIN;
        return;
      }

      console.log('User authenticated:', user.email);
      setUser(user);
      await loadContents();
    } catch (error) {
      console.error('Error checking auth status:', error);
      window.location.href = SECURE_ROUTES.LOGIN;
    } finally {
      setLoading(false);
    }
  };

  const loadContents = async () => {
    try {
      console.log('Loading contents for type:', activeType);
      const { data, error } = await supabase
        .schema('api')
        .from('contents')
        .select('*')
        .eq('type', activeType)
        .order('title', { ascending: true });

      if (error) {
        console.error('Error loading contents:', error);
        throw error;
      }

      console.log('Loaded contents:', data);
      setContents(data || []);
    } catch (error) {
      console.error('Error loading contents:', error);
      setError('Erreur lors du chargement des contenus');
    }
  };

  const handleSave = async (newContent: string) => {
    try {
      // Parse the content to validate it's proper JSON
      const parsedContent = JSON.parse(newContent);

      if (editingContent?.id) {
        // Update existing content
        const { error } = await supabase
          .schema('api')
          .from('contents')
          .update({
            title: editingContent.title,
            slug: editingContent.slug,
            content: newContent,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingContent.id);

        if (error) throw error;

        // Update local state to reflect changes
        setEditingContent({
          ...editingContent,
          content: newContent,
          updated_at: new Date().toISOString()
        });
      } else {
        // Create new content
        const { error } = await supabase
          .schema('api')
          .from('contents')
          .insert([{
            title: editingContent?.title || 'Nouveau contenu',
            content: newContent,
            type: activeType,
            slug: editingContent?.slug || 'nouveau-contenu'
          }]);

        if (error) throw error;
      }

      // Reload contents to get the latest data
      await loadContents();
      // Close the editing modal
      setEditingContent(null);
      showToast('Contenu sauvegardé avec succès', 'success');
    } catch (error) {
      console.error('Error saving content:', error);
      showToast('Une erreur est survenue lors de la sauvegarde. Vérifiez que le contenu est un JSON valide.', 'error');
    }
  };

  const handleDelete = async (contentId: number | undefined) => {
    if (!contentId) {
      showToast('ID de contenu invalide', 'error');
      return;
    }

    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce contenu ?')) {
      return;
    }

    try {
      const { error } = await supabase
        .schema('api')
        .from('contents')
        .delete()
        .eq('id', contentId);

      if (error) throw error;

      showToast('Contenu supprimé avec succès', 'success');
      loadContents();
    } catch (error: any) {
      console.error('Error deleting content:', error);
      showToast(error.message || 'Erreur lors de la suppression du contenu', 'error');
    }
  };

  const handleNewContent = () => {
    const newContent: Partial<Content> = {
      title: '',
      content: '',
      type: activeType,
      slug: '',
      properties: {}
    };
    setEditingContent(newContent as Content);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-lg font-medium">{error}</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">
              Connecté en tant que {user?.email}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Gestion du Contenu</h2>
            <div className="space-y-4">
              <button
                onClick={() => setActiveType('page')}
                className={`w-full px-4 py-2 rounded-lg transition-all ${
                  activeType === 'page'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Pages
              </button>
              <button
                onClick={() => setActiveType('component')}
                className={`w-full px-4 py-2 rounded-lg transition-all ${
                  activeType === 'component'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Composants
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Gestion du Blog</h2>
            <div className="space-y-4">
              <div className="flex space-x-4">
                <Link
                  href="/secure-dashboard-mlp2024/blog/new"
                  className="block w-full px-4 py-2 text-center bg-primary text-white hover:bg-primary/90 rounded-lg transition-all"
                >
                  Nouvel Article
                </Link>
                <label
                  htmlFor="import-json"
                  className="block w-full px-4 py-2 text-center bg-green-500 text-white hover:bg-green-600 rounded-lg transition-all cursor-pointer"
                >
                  Importer JSON
                </label>
                <input
                  id="import-json"
                  type="file"
                  accept=".json"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;

                    try {
                      const text = await file.text();
                      const articles = JSON.parse(text);

                      // Send to API endpoint
                      const response = await fetch('/api/blog/import', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(articles),
                      });

                      if (!response.ok) {
                        const error = await response.json();
                        throw new Error(error.error || 'Error importing articles');
                      }

                      const result = await response.json();
                      showToast(result.message || 'Articles importés avec succès !', 'success');
                    } catch (error: unknown) {
                      console.error('Error importing articles:', error);
                      let errorMessage = 'Erreur lors de l\'importation';
                      if (error instanceof Error) {
                        errorMessage = error.message;
                      }
                      showToast(errorMessage, 'error');
                    }

                    // Reset the file input
                    e.target.value = '';
                  }}
                />
                <button
                  onClick={() => {
                    const schemaTemplate = [
                      {
                        "title": "Titre de l'article",
                        "slug": "titre-de-l-article",
                        "content": "Contenu de l'article...",
                        "excerpt": "Résumé court de l'article",
                        "featured_image": "URL de l'image mise en avant",
                        "categories": ["catégorie1", "catégorie2"],
                        "tags": ["tag1", "tag2"],
                        "status": "draft",
                        "author": "email@auteur.com",
                        "seo": {
                          "title": "Titre SEO",
                          "description": "Description pour les moteurs de recherche",
                          "keywords": ["mot-clé1", "mot-clé2"]
                        }
                      }
                    ];

                    // Create blob and download
                    const blob = new Blob([JSON.stringify(schemaTemplate, null, 2)], { type: 'application/json' });
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'article-schema-template.json';
                    document.body.appendChild(a);
                    a.click();
                    window.URL.revokeObjectURL(url);
                    document.body.removeChild(a);
                  }}
                  className="block w-full px-4 py-2 text-center bg-blue-500 text-white hover:bg-blue-600 rounded-lg transition-all"
                >
                  Télécharger Template
                </button>
              </div>
              <Link
                href="/secure-dashboard-mlp2024/blog"
                className="block w-full px-4 py-2 text-center bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg transition-all"
              >
                Articles
              </Link>
              <Link
                href="/secure-dashboard-mlp2024/blog/categories"
                className="block w-full px-4 py-2 text-center bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg transition-all"
              >
                Catégories
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="mb-6">
            <div className="flex space-x-2">
              <button
                onClick={handleNewContent}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
              >
                Ajouter un nouveau {activeType === 'page' ? 'page' : 'composant'}
              </button>
              <button
                onClick={handleNewContent}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
              >
                Ajouter un nouveau {activeType === 'page' ? 'page' : 'composant'}
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {contents.map((content) => (
              <div
                key={content.id}
                className="bg-gray-50 p-4 rounded-lg space-y-2"
              >
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <h3 className="text-lg font-medium">{content.title}</h3>
                    <p className="text-sm text-gray-500">
                      Slug: {content.slug}
                    </p>
                    <p className="text-sm text-gray-500">
                      Dernière modification: {new Date(content.updated_at).toLocaleString('fr-FR')}
                    </p>
                  </div>
                  <div className="space-x-2">
                    <button
                      onClick={() => setEditingContent(content)}
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => content.id && handleDelete(content.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {editingContent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-4xl flex flex-col h-[90vh]">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-2xl font-bold">
                {editingContent.id ? 'Modifier' : 'Ajouter'} un {activeType === 'page' ? 'une page' : 'un composant'}
              </h2>
              <button
                onClick={() => setEditingContent(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Titre
                  </label>
                  <input
                    type="text"
                    value={editingContent.title || ''}
                    onChange={(e) => setEditingContent({ ...editingContent, title: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Slug
                  </label>
                  <input
                    type="text"
                    value={editingContent.slug || ''}
                    onChange={(e) => setEditingContent({ ...editingContent, slug: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  />
                </div>
                <div>
                  <DynamicForm
                    content={editingContent.content || JSON.stringify({})}
                    onSave={(newContent) => {
                      try {
                        // Validate that the content is proper JSON
                        JSON.parse(newContent);
                        handleSave(newContent);
                      } catch (e) {
                        console.error('Invalid JSON content:', e);
                        showToast('Le contenu n\'est pas un JSON valide', 'error');
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
