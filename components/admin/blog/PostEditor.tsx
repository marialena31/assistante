import { useId, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { useToast } from '../../ui/Toast';
import type { BlogPost, BlogPostFormData } from '../../../types/blog';

interface PostEditorProps {
  post?: Partial<BlogPost>;
  onSubmit: (data: BlogPostFormData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export default function PostEditor({ post, onSubmit, onCancel, loading = false }: PostEditorProps) {
  const [title, setTitle] = useState(post?.title || '');
  const [content, setContent] = useState(post?.content || '');
  const [excerpt, setExcerpt] = useState(post?.excerpt || '');
  const [slug, setSlug] = useState(post?.slug || '');
  const [status, setStatus] = useState<'draft' | 'published' | 'scheduled'>(post?.status || 'draft');
  const [featuredImage, setFeaturedImage] = useState(post?.featured_image || '');
  const [author, setAuthor] = useState(post?.author || '');
  const [categories, setCategories] = useState<string[]>(
    post?.categories?.map(cat => cat.id) || []
  );
  const [seoTitle, setSeoTitle] = useState(post?.seo?.title || '');
  const [seoDescription, setSeoDescription] = useState(post?.seo?.description || '');
  const [seoKeywords, setSeoKeywords] = useState<string>(
    post?.seo?.keywords ? post.seo.keywords.join(', ') : ''
  );
  const { showToast } = useToast();
  const editorId = useId();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData: BlogPostFormData = {
      title,
      content,
      excerpt,
      slug,
      status,
      featured_image: featuredImage,
      author,
      categories,
      seo: {
        title: seoTitle,
        description: seoDescription,
        keywords: seoKeywords.split(',').map((k) => k.trim())
      }
    };

    try {
      await onSubmit(formData);
      showToast('Article sauvegardé avec succès', 'success');
    } catch (error) {
      console.error('Error saving post:', error);
      showToast('Erreur lors de la sauvegarde de l\'article', 'error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">
          {post?.id ? 'Modifier l\'article' : 'Nouvel article'}
        </h1>
        <div className="space-x-4">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-primary border border-transparent rounded-md shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            {loading ? 'Sauvegarde...' : 'Sauvegarder'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Titre
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            required
          />
        </div>

        <div>
          <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
            Slug
          </label>
          <input
            type="text"
            id="slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            required
          />
        </div>

        <div>
          <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700">
            Extrait
          </label>
          <textarea
            id="excerpt"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">
            Contenu
          </label>
          <Editor
            id={editorId}
            value={content}
            onEditorChange={(newContent) => setContent(newContent)}
            init={{
              height: 500,
              menubar: true,
              plugins: [
                'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
              ],
              toolbar: 'undo redo | blocks | ' +
                'bold italic forecolor | alignleft aligncenter ' +
                'alignright alignjustify | bullist numlist outdent indent | ' +
                'removeformat | help',
              content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
            }}
          />
        </div>

        <div>
          <label htmlFor="featured-image" className="block text-sm font-medium text-gray-700">
            Image à la une
          </label>
          <input
            type="text"
            id="featured-image"
            value={featuredImage}
            onChange={(e) => setFeaturedImage(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="author" className="block text-sm font-medium text-gray-700">
            Auteur
          </label>
          <input
            type="text"
            id="author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
            Statut
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value as 'draft' | 'published' | 'scheduled')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          >
            <option value="draft">Brouillon</option>
            <option value="published">Publié</option>
            <option value="scheduled">Programmé</option>
          </select>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">SEO</h3>
          
          <div>
            <label htmlFor="seo-title" className="block text-sm font-medium text-gray-700">
              Titre SEO
            </label>
            <input
              type="text"
              id="seo-title"
              value={seoTitle}
              onChange={(e) => setSeoTitle(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="seo-description" className="block text-sm font-medium text-gray-700">
              Description SEO
            </label>
            <textarea
              id="seo-description"
              value={seoDescription}
              onChange={(e) => setSeoDescription(e.target.value)}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="seo-keywords" className="block text-sm font-medium text-gray-700">
              Mots-clés SEO (séparés par des virgules)
            </label>
            <input
              type="text"
              id="seo-keywords"
              value={seoKeywords}
              onChange={(e) => setSeoKeywords(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            />
          </div>
        </div>
      </div>
    </form>
  );
}
