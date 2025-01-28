import { useState } from 'react';
import { useSupabaseQuery, mutateData } from '../../hooks/useSupabaseQuery';
import { useToast } from '../ui/Toast';

interface DataItem {
  id: string;
  title: string;
  // Add other fields that your data items have
}

export default function DataList() {
  const { data, loading, error, mutate } = useSupabaseQuery<DataItem[]>({
    table: 'example_table',
    orderBy: { column: 'created_at', ascending: false }
  });

  const { showToast } = useToast();

  const handleDelete = async (id: string) => {
    try {
      const success = await mutateData({
        table: 'example_table',
        action: 'DELETE',
        filter: { id }
      });

      if (success) {
        showToast('Item supprimé avec succès', 'success');
        mutate();
      } else {
        throw new Error('Failed to delete item');
      }
    } catch (error) {
      showToast("Erreur lors de la suppression de l'item", 'error');
    }
  };

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Une erreur est survenue</div>;
  if (!data || data.length === 0) return <div>Aucune donnée</div>;

  return (
    <div>
      {data.map((item: DataItem) => (
        <div key={item.id}>
          <span>{item.title}</span>
          <button onClick={() => handleDelete(item.id)}>Supprimer</button>
        </div>
      ))}
    </div>
  );
}
