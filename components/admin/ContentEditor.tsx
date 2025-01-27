import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const JSONEditor = dynamic(() => import('./JSONEditor'), { ssr: false });

type PageContent = {
  id: string;
  name: string;
  content: any;
  filePath: string;
};

export default function ContentEditor() {
  const [pages, setPages] = useState<PageContent[]>([]);
  const [selectedPage, setSelectedPage] = useState<PageContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      // Fetch list of available JSON files
      const response = await fetch('/api/admin/content/list');
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.message);

      setPages(data.pages);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePageSelect = async (pageId: string) => {
    try {
      const page = pages.find(p => p.id === pageId);
      if (!page) return;

      // Fetch the content of the selected JSON file
      const response = await fetch(`/api/admin/content/read?path=${page.filePath}`);
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.message);

      setSelectedPage({ ...page, content: data.content });
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleSave = async (content: any) => {
    if (!selectedPage) return;

    setSaving(true);
    setError(null);

    try {
      // Save content back to JSON file
      const response = await fetch('/api/admin/content/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          path: selectedPage.filePath,
          content,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      // Update local state
      setSelectedPage(prev => prev ? { ...prev, content } : null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="h2">Éditeur de contenu</h2>
        <select
          value={selectedPage?.id || ''}
          onChange={(e) => handlePageSelect(e.target.value)}
          className="form-select rounded-lg border-gray-300 focus:border-primary focus:ring-primary"
        >
          <option value="">Sélectionner une page</option>
          {pages.map((page) => (
            <option key={page.id} value={page.id}>
              {page.name}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 text-red-500 p-4 rounded-lg">
          {error}
        </div>
      )}

      {selectedPage && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Fichier : {selectedPage.filePath}
              </p>
            </div>
            {saving && (
              <span className="text-sm text-primary">Enregistrement...</span>
            )}
          </div>

          <JSONEditor
            content={selectedPage.content}
            onChange={handleSave}
          />
        </div>
      )}
    </div>
  );
}
