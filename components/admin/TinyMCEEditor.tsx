import { useEffect, useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { createClient } from '../../utils/supabase/client';
import { useToast } from '../ui/Toast';

interface TinyMCEEditorProps {
  value: string;
  onChange: (content: string) => void;
}

export default function TinyMCEEditor({ value, onChange }: TinyMCEEditorProps) {
  const editorRef = useRef<any>(null);
  const supabase = createClient();
  const { showToast } = useToast();

  const handleImageUpload = async (blobInfo: any): Promise<string> => {
    try {
      const file = blobInfo.blob();
      const fileExt = file.name?.split('.').pop() || 'jpg';
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `blog/${fileName}`;

      const { data, error } = await supabase.storage
        .from('public')
        .upload(filePath, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('public')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error: any) {
      showToast('Erreur', error.message || 'Erreur lors du téléchargement de l\'image', 'error');
      throw error;
    }
  };

  const apiKey = process.env.NEXT_PUBLIC_TINYMCE_API_KEY;
  
  if (!apiKey) {
    console.error('TinyMCE API key is missing. Please add NEXT_PUBLIC_TINYMCE_API_KEY to your environment variables.');
    return (
      <div className="p-4 border border-red-500 rounded bg-red-50 text-red-700">
        <p>Error: TinyMCE API key is missing. Please check your environment variables.</p>
      </div>
    );
  }

  return (
    <Editor
      apiKey={apiKey}
      onInit={(evt, editor) => {
        editorRef.current = editor;
      }}
      value={value}
      onEditorChange={onChange}
      init={{
        height: 500,
        menubar: true,
        plugins: [
          'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
          'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
          'insertdatetime', 'media', 'table', 'help', 'wordcount'
        ],
        toolbar: 'undo redo | blocks | ' +
          'bold italic forecolor | alignleft aligncenter ' +
          'alignright alignjustify | bullist numlist outdent indent | ' +
          'removeformat | help',
        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
        images_upload_handler: handleImageUpload,
        language: 'fr_FR',
        branding: false,
        promotion: false,
        entity_encoding: 'raw',
        convert_urls: true,
        relative_urls: false,
        remove_script_host: true
      }}
    />
  );
}
