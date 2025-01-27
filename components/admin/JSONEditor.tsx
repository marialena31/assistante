import { useEffect, useRef } from 'react';
import { JSONEditor as VanillaJSONEditor } from 'vanilla-jsoneditor';

interface JSONEditorProps {
  content: any;
  onChange: (content: any) => void;
}

export default function JSONEditor({ content, onChange }: JSONEditorProps) {
  const refContainer = useRef<HTMLDivElement>(null);
  const refEditor = useRef<any>(null);

  useEffect(() => {
    if (!refContainer.current) return;

    refEditor.current = new VanillaJSONEditor({
      target: refContainer.current,
      props: {
        content: {
          json: content
        },
        onChange: (updatedContent: any) => {
          onChange(updatedContent.json || updatedContent.text);
        }
      }
    });

    return () => {
      if (refEditor.current) {
        refEditor.current.destroy();
        refEditor.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (refEditor.current) {
      refEditor.current.updateProps({
        content: {
          json: content
        }
      });
    }
  }, [content]);

  return (
    <div
      ref={refContainer}
      className="jsoneditor-react-wrapper border border-gray-200 rounded-lg"
      style={{ height: '500px' }}
    />
  );
}
