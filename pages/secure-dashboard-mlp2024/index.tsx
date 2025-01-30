import { useState, useEffect } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import TinyMCEEditor from '../../components/admin/TinyMCEEditor';
import { useToast } from '../../components/ui/Toast';
import DynamicForm from '../../components/admin/DynamicForm';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useSupabaseQuery, mutateData } from '../../hooks/useSupabaseQuery';
import { createClient } from '../../utils/supabase/client';
import { useAuthRedirect } from '../../hooks/useAuthRedirect';

interface Content {
  id: number;
  title: string;
  slug: string;
  content: string;
  type: 'page' | 'component';
  created_at: string;
  updated_at: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [editingContent, setEditingContent] = useState<Content | null>(null);
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const supabase = createClient();

  // Use the custom auth hook
  useAuthRedirect();

  const toastAdapter = (message: string, type: 'success' | 'error') => {
    showToast(type === 'success' ? 'Succès' : 'Erreur', message, type);
  };

  const { data: contents = [], loading: contentsLoading, error: contentsError, mutate: mutateContents } = useSupabaseQuery<Content[]>({
    table: 'contents',
    orderBy: { column: 'updated_at', ascending: false }
  });

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setIsAuthenticated(!!user?.email?.endsWith('@marialena-pietri.fr'));
      } catch (error) {
        console.error('Session check error:', error);
        setIsAuthenticated(false);
      }
    };

    checkSession();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      mutateContents();
    }
  }, [isAuthenticated, mutateContents]);

  const handleSave = async (contentData: string) => {
    try {
      const parsedContent = JSON.parse(contentData) as Content;
      const isNewContent = !parsedContent.id;

      const success = await mutateData({
        table: 'contents',
        action: isNewContent ? 'INSERT' : 'UPDATE',
        data: {
          title: parsedContent.title,
          slug: parsedContent.slug,
          content: parsedContent.content,
          type: parsedContent.type,
          updated_at: new Date().toISOString()
        },
        filter: isNewContent ? undefined : { id: parsedContent.id }
      }, toastAdapter, mutateContents);

      if (success) {
        setEditingContent(null);
      }
    } catch (error) {
      console.error('Error saving content:', error);
      toastAdapter('Une erreur est survenue lors de la sauvegarde. Vérifiez que le contenu est un JSON valide.', 'error');
    }
  };

  const handleDelete = async (contentId: number | undefined) => {
    if (!contentId) {
      toastAdapter('ID de contenu invalide', 'error');
      return;
    }

    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce contenu ?')) {
      return;
    }

    const success = await mutateData({
      table: 'contents',
      action: 'DELETE',
      filter: { id: contentId }
    }, toastAdapter, mutateContents);

    if (success) {
      toastAdapter('Contenu supprimé avec succès', 'success');
    }
  };

  if (contentsLoading) {
    return (
      <AdminLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  if (contentsError) {
    return (
      <AdminLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-lg font-medium">{contentsError.message}</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Gestion du Contenu</h2>
            <div className="space-y-4">
              <button
                onClick={() => setEditingContent({
                  id: 0,
                  title: '',
                  content: '',
                  type: 'page',
                  slug: '',
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString(),
                })}
                className="block w-full px-4 py-2 text-center bg-primary text-white hover:bg-primary/90 rounded-lg transition-all"
              >
                Nouveau Contenu
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
                      toastAdapter(result.message || 'Articles importés avec succès !', 'success');
                    } catch (error: unknown) {
                      console.error('Error importing articles:', error);
                      let errorMessage = 'Erreur lors de l\'importation';
                      if (error instanceof Error) {
                        errorMessage = error.message;
                      }
                      toastAdapter(errorMessage, 'error');
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

        {editingContent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">
                  {editingContent.id ? 'Modifier' : 'Créer'} un contenu
                </h2>
                <button
                  onClick={() => setEditingContent(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <DynamicForm
                content={JSON.stringify(editingContent)}
                onSave={handleSave}
                loading={contentsLoading}
              />
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
