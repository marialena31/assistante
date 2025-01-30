import { useId, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { useToast } from '../../ui/Toast';
import type { BlogPost, BlogPostFormData, PostStatus, BlogPostSEO } from '../../../types/blog';
import Image from 'next/legacy/image';

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
  const [status, setStatus] = useState<PostStatus>(post?.status || 'draft');
  const [featuredImageUrl, setFeaturedImageUrl] = useState(post?.featured_image || '');
  const [author, setAuthor] = useState<string | null>(post?.author || null);
  const [seoTitle, setSeoTitle] = useState(post?.seo?.title || '');
  const [seoDescription, setSeoDescription] = useState(post?.seo?.description || '');
  const [seoKeywords, setSeoKeywords] = useState<string>(
    post?.seo?.keywords ? post.seo.keywords.join(', ') : ''
  );
  const [categories, setCategories] = useState<number[]>(post?.categories?.map(c => c.id) || []);
  const { showSuccessToast, showErrorToast } = useToast();
  const editorId = useId();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData: BlogPostFormData = {
      title,
      content,
      excerpt: excerpt || '',
      slug,
      status,
      featured_image: featuredImageUrl || '/images/default-post.jpg',
      author: author || null,
      categories,
      seo: {
        title: seoTitle || null,
        description: seoDescription || null,
        keywords: seoKeywords.split(',').map(k => k.trim()).filter(k => k)
      }
    };

    try {
      await onSubmit(formData);
      showSuccessToast('Article sauvegardé avec succès');
    } catch (error) {
      showErrorToast('Erreur lors de la sauvegarde de l\'article');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Titre
        </label>
        <input
          type="text"
          name="title"
          id="title"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
          Slug
        </label>
        <input
          type="text"
          name="slug"
          id="slug"
          required
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700">
          Extrait
        </label>
        <textarea
          name="excerpt"
          id="excerpt"
          required
          rows={3}
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor={editorId} className="block text-sm font-medium text-gray-700">
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
            content_style: 'body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; font-size: 14px; }'
          }}
        />
      </div>

      <div>
        <label htmlFor="featured-image" className="block text-sm font-medium text-gray-700">
          Image à la une
        </label>
        <input
          type="text"
          name="featured-image"
          id="featured-image"
          required
          value={featuredImageUrl}
          onChange={(e) => setFeaturedImageUrl(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
        />
        {featuredImageUrl && (
          <div className="mt-2 relative w-full aspect-video">
            <Image
              src={featuredImageUrl.startsWith('/') ? featuredImageUrl : `/${featuredImageUrl}`}
              alt="Image à la une"
              layout="fill"
              objectFit="cover"
              className="rounded-lg"
            />
          </div>
        )}
      </div>

      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700">
          Statut
        </label>
        <select
          id="status"
          name="status"
          value={status}
          onChange={(e) => setStatus(e.target.value as PostStatus)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
        >
          <option value="draft">Brouillon</option>
          <option value="published">Publié</option>
        </select>
      </div>

      <div className="space-y-6">
        <h3 className="text-lg font-medium text-gray-900">SEO</h3>
        <div>
          <label htmlFor="seo-title" className="block text-sm font-medium text-gray-700">
            Titre SEO
          </label>
          <input
            type="text"
            name="seo-title"
            id="seo-title"
            required
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
            name="seo-description"
            id="seo-description"
            required
            rows={3}
            value={seoDescription}
            onChange={(e) => setSeoDescription(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="seo-keywords" className="block text-sm font-medium text-gray-700">
            Mots-clés SEO (séparés par des virgules)
          </label>
          <input
            type="text"
            name="seo-keywords"
            id="seo-keywords"
            required
            value={seoKeywords}
            onChange={(e) => setSeoKeywords(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
        >
          {loading ? 'Sauvegarde...' : 'Sauvegarder'}
        </button>
      </div>
    </form>
  );
}
