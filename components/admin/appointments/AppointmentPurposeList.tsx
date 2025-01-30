import React, { useState } from 'react';
import { AppointmentPurpose } from '../../../types/appointments';
import { useToast } from '../../ui/Toast';
import { useSupabaseQuery, mutateData } from '../../../hooks/useSupabaseQuery';

export default function AppointmentPurposeList() {
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const { showToast } = useToast();

  // Adapter for showToast to match mutateData's expected signature
  const toastAdapter = (message: string, type: 'success' | 'error') => {
    showToast(type === 'success' ? 'Succès' : 'Erreur', message, type);
  };

  const { data: purposes, loading, error, mutate } = useSupabaseQuery<AppointmentPurpose[]>({
    table: 'appointment_purposes',
    orderBy: { column: 'created_at', ascending: true }
  });

  const handleAdd = async () => {
    if (!newTitle.trim()) {
      toastAdapter('Le titre est requis', 'error');
      return;
    }

    const success = await mutateData({
      table: 'appointment_purposes',
      action: 'INSERT',
      data: {
        title: newTitle.trim(),
        description: newDescription.trim() || null,
        is_active: true
      }
    }, toastAdapter, mutate);

    if (success) {
      toastAdapter('Objet ajouté avec succès', 'success');
      setNewTitle('');
      setNewDescription('');
      setIsAdding(false);
    }
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    const success = await mutateData({
      table: 'appointment_purposes',
      action: 'UPDATE',
      data: { is_active: !isActive },
      filter: { id }
    }, toastAdapter, mutate);

    if (success) {
      toastAdapter('Statut mis à jour avec succès', 'success');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet objet ?')) {
      return;
    }

    const success = await mutateData({
      table: 'appointment_purposes',
      action: 'DELETE',
      filter: { id }
    }, toastAdapter, mutate);

    if (success) {
      toastAdapter('Objet supprimé avec succès', 'success');
    }
  };

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Une erreur est survenue</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Objets de rendez-vous</h3>
        <button
          onClick={() => setIsAdding(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          Ajouter
        </button>
      </div>

      {isAdding && (
        <div className="bg-white shadow sm:rounded-lg p-4 space-y-4">
          <div>
            <label htmlFor="newTitle" className="block text-sm font-medium text-gray-700">
              Titre
            </label>
            <input
              type="text"
              id="newTitle"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="newDescription" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="newDescription"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setIsAdding(false)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Annuler
            </button>
            <button
              onClick={handleAdd}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Ajouter
            </button>
          </div>
        </div>
      )}

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul role="list" className="divide-y divide-gray-200">
          {purposes?.map((purpose) => (
            <li key={purpose.id} className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 truncate">{purpose.title}</h4>
                  {purpose.description && (
                    <p className="mt-1 text-sm text-gray-500">{purpose.description}</p>
                  )}
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleToggleActive(purpose.id, purpose.is_active)}
                    className={`inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-full ${
                      purpose.is_active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {purpose.is_active ? 'Actif' : 'Inactif'}
                  </button>
                  <button
                    onClick={() => handleDelete(purpose.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
