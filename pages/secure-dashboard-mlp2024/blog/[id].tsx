import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/legacy/image';
import AdminLayout from '../../../components/layout/AdminLayout';
import TinyMCEEditor from '../../../components/admin/TinyMCEEditor';
import FeaturedImageUpload from '../../../components/admin/blog/FeaturedImageUpload';
import { createClient } from '../../../utils/supabase/client';
import { useToast } from '../../../components/ui/Toast';
import type { BlogPost, BlogCategory, PostStatus } from '../../../types/blog';

interface ContentFields {
  [key: string]: string;
}

export default function BlogPostEdit() {
  const router = useRouter();
  const { id } = router.query;
  const [post, setPost] = useState<BlogPost | null>(null);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [featuredImage, setFeaturedImage] = useState<File | null>(null);
  const [featuredImagePreview, setFeaturedImagePreview] = useState<string>('');
  const [content, setContent] = useState<ContentFields>({});
  const supabase = createClient();
  const { showSuccessToast, showErrorToast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingField, setEditingField] = useState('');
  const [newFieldName, setNewFieldName] = useState('');
  const [fieldToRename, setFieldToRename] = useState({ old: '', new: '' });

  useEffect(() => {
    async function fetchPost() {
      try {
        const { data: post, error } = await supabase
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

        if (post) {
          setPost(post);
          setFeaturedImagePreview(post.featured_image || '');
          setContent(typeof post.content === 'object' ? post.content as ContentFields : {});
          setSelectedCategories(
            post.categories?.map((cat: any) => cat.blog_categories.id) || []
          );
        }
      } catch (error: any) {
        showErrorToast('Erreur lors du chargement de l\'article');
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchPost();
    }
  }, [id]);

  const handleAddField = async () => {
    if (!post || !newFieldName) return;

    try {
      const newContent = {
        ...content,
        [newFieldName]: ''
      };

      const { error } = await supabase
        .schema('api')
        .from('blog_posts')
        .update({ content: newContent })
        .eq('id', id);

      if (error) throw error;

      setContent(newContent);
      setNewFieldName('');
      showSuccessToast('Nouveau champ ajouté');
    } catch (error: any) {
      showErrorToast('Erreur lors de l\'ajout du champ');
    }
  };

  const handleRenameField = async () => {
    if (!post || !fieldToRename.old || !fieldToRename.new) return;

    try {
      const newContent = { ...content };
      const oldValue = newContent[fieldToRename.old];
      delete newContent[fieldToRename.old];
      newContent[fieldToRename.new] = oldValue;

      const { error } = await supabase
        .schema('api')
        .from('blog_posts')
        .update({ content: newContent })
        .eq('id', id);

      if (error) throw error;

      setContent(newContent);
      setFieldToRename({ old: '', new: '' });
      showSuccessToast('Champ renommé avec succès');
    } catch (error: any) {
      showErrorToast('Erreur lors du renommage du champ');
    }
  };

  const handleDeleteField = async (fieldName: string) => {
    if (!post || !fieldName) return;

    try {
      const newContent = { ...content };
      delete newContent[fieldName];

      const { error } = await supabase
        .schema('api')
        .from('blog_posts')
        .update({ content: newContent })
        .eq('id', id);

      if (error) throw error;

      setContent(newContent);
      showSuccessToast('Champ supprimé avec succès');
    } catch (error: any) {
      showErrorToast('Erreur lors de la suppression du champ');
    }
  };

  const handleUpdateField = async (fieldName: string, value: string) => {
    if (!post || !fieldName) return;

    try {
      const newContent = {
        ...content,
        [fieldName]: value
      };

      const { error } = await supabase
        .schema('api')
        .from('blog_posts')
        .update({ content: newContent })
        .eq('id', id);

      if (error) throw error;

      setContent(newContent);
      showSuccessToast('Contenu mis à jour');
    } catch (error: any) {
      showErrorToast('Erreur lors de la mise à jour du contenu');
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Chargement...">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  if (!post) {
    return (
      <AdminLayout title="Article non trouvé">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Article non trouvé</h1>
          <p className="mt-2 text-gray-600">L'article que vous recherchez n'existe pas.</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={`Édition - ${post.title}`}>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex flex-col space-y-8">
            {/* Content Fields */}
            <div className="bg-white shadow sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Contenu dynamique
                </h3>
                <div className="mt-5 space-y-6">
                  {Object.entries(content).map(([key, value]) => (
                    <div key={key} className="relative">
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-medium text-gray-700">
                          {key}
                        </label>
                        <div className="flex space-x-2">
                          <button
                            type="button"
                            onClick={() => {
                              setFieldToRename({ old: key, new: '' });
                              setIsModalOpen(true);
                            }}
                            className="text-primary hover:text-primary-dark"
                          >
                            Renommer
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteField(key)}
                            className="text-red-600 hover:text-red-700"
                          >
                            Supprimer
                          </button>
                        </div>
                      </div>
                      <TinyMCEEditor
                        value={value}
                        onChange={(newContent) => handleUpdateField(key, newContent)}
                      />
                    </div>
                  ))}
                </div>

                {/* Add Field Button */}
                <div className="mt-6">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  >
                    Ajouter un champ
                  </button>
                </div>

                {/* Add Field Modal */}
                {isModalOpen && (
                  <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-sm w-full">
                      <h3 className="text-lg font-medium mb-4">
                        {fieldToRename.old ? 'Renommer le champ' : 'Ajouter un nouveau champ'}
                      </h3>
                      <input
                        type="text"
                        value={fieldToRename.old ? fieldToRename.new : newFieldName}
                        onChange={(e) => {
                          if (fieldToRename.old) {
                            setFieldToRename({ ...fieldToRename, new: e.target.value });
                          } else {
                            setNewFieldName(e.target.value);
                          }
                        }}
                        placeholder={fieldToRename.old ? 'Nouveau nom' : 'Nom du champ'}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                      />
                      <div className="mt-4 flex justify-end space-x-3">
                        <button
                          type="button"
                          onClick={() => {
                            setIsModalOpen(false);
                            setNewFieldName('');
                            setFieldToRename({ old: '', new: '' });
                          }}
                          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                        >
                          Annuler
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (fieldToRename.old) {
                              handleRenameField();
                            } else {
                              handleAddField();
                            }
                            setIsModalOpen(false);
                          }}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                        >
                          {fieldToRename.old ? 'Renommer' : 'Ajouter'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
