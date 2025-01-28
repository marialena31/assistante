import { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { createClient } from '../../utils/supabase/client';

const DynamicForm = dynamic(() => import('./DynamicForm'), { ssr: false });

type PageContent = {
  id: string;
  slug: string;
  path: string;
  content: any;
};

interface ContentEditorProps {
  section: string;
}

export default function ContentEditor({ section }: ContentEditorProps) {
  const [pages, setPages] = useState<PageContent[]>([]);
  const [selectedPage, setSelectedPage] = useState<PageContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const tinyMceApiKey = process.env.NEXT_PUBLIC_TINYMCE_API_KEY;

  // Initialize Supabase client with useMemo to ensure consistent reference
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    if (!tinyMceApiKey) {
      console.error('TinyMCE API key is missing. Please add NEXT_PUBLIC_TINYMCE_API_KEY to your environment variables.');
    }
    fetchPages();
  }, [section]);

  const fetchPages = async () => {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) throw new Error('Not authenticated');

      // Fetch list of pages from database
      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .order('title', { ascending: true });

      if (error) throw error;

      setPages(data || []);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching pages:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePageSelect = async (pageId: string) => {
    const page = pages.find(p => p.id === pageId);
    if (page) {
      setSelectedPage(page);
    }
  };

  const handleSave = async (content: any) => {
    if (!selectedPage) return;

    setSaving(true);
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('pages')
        .update({ content, updated_at: new Date().toISOString() })
        .eq('id', selectedPage.id);

      if (error) throw error;

      // Update the local state
      setPages(pages.map(p => 
        p.id === selectedPage.id 
          ? { ...p, content }
          : p
      ));
      setSelectedPage({ ...selectedPage, content });
      setError(null);
    } catch (err: any) {
      console.error('Error saving page:', err);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleAddField = () => {
    // Add field logic here
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!tinyMceApiKey) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-md">
        <h3 className="font-medium">Configuration Error</h3>
        <p>TinyMCE API key is missing. Please add NEXT_PUBLIC_TINYMCE_API_KEY to your environment variables.</p>
      </div>
    );
  }

  return (
    <div>
      {error && <div className="text-red-500">{error}</div>}
      {selectedPage ? (
        <DynamicForm 
          content={selectedPage.content} 
          onSave={handleSave} 
        />
      ) : (
        <div className="p-4 bg-gray-50 rounded-lg text-gray-500">
          Sélectionnez un fichier à éditer
        </div>
      )}
      <button
        onClick={() => handleAddField()}
        className="bg-blue-500 text-white rounded px-4 py-2"
      >
        Ajouter une nouvelle page
      </button>
    </div>
  );
}
