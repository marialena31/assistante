import React, { useState } from 'react';
import { AppointmentDuration } from '../../../types/appointments';
import { useToast } from '../../ui/Toast';
import { useSupabaseQuery, mutateData } from '../../../hooks/useSupabaseQuery';

export default function AppointmentDurationList() {
  const [isAdding, setIsAdding] = useState(false);
  const [newDuration, setNewDuration] = useState('');
  const { showToast } = useToast();

  // Wrapper function to adapt showToast to mutateData's expected signature
  const handleToast = (message: string, type: 'success' | 'error') => {
    showToast(type === 'success' ? 'Succès' : 'Erreur', message, type);
  };

  const { data: durations, loading, error, mutate } = useSupabaseQuery<AppointmentDuration[]>({
    table: 'appointment_durations',
    orderBy: { column: 'duration_minutes', ascending: true }
  });

  const handleAdd = async () => {
    const duration = parseInt(newDuration);
    if (isNaN(duration) || duration <= 0) {
      handleToast('La durée doit être un nombre positif', 'error');
      return;
    }

    const success = await mutateData({
      table: 'appointment_durations',
      action: 'INSERT',
      data: {
        duration_minutes: duration,
        is_active: true
      }
    }, handleToast, mutate);

    if (success) {
      setNewDuration('');
      setIsAdding(false);
    }
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    const success = await mutateData({
      table: 'appointment_durations',
      action: 'UPDATE',
      data: { is_active: !isActive },
      filter: { id }
    }, handleToast, mutate);

    if (success) {
      handleToast('Statut mis à jour avec succès', 'success');
    }
  };

  const handleDelete = async (id: string) => {
    const success = await mutateData({
      table: 'appointment_durations',
      action: 'DELETE',
      filter: { id }
    }, handleToast, mutate);

    if (success) {
      handleToast('Durée supprimée avec succès', 'success');
    }
  };

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Une erreur est survenue</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Durées de rendez-vous</h3>
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
            <label htmlFor="newDuration" className="block text-sm font-medium text-gray-700">
              Durée (en minutes)
            </label>
            <input
              type="number"
              id="newDuration"
              value={newDuration}
              onChange={(e) => setNewDuration(e.target.value)}
              min="1"
              step="15"
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
          {durations?.map((duration) => (
            <li key={duration.id} className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900">
                    {duration.duration_minutes} minutes
                  </h4>
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleToggleActive(duration.id, duration.is_active)}
                    className={`inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-full ${
                      duration.is_active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {duration.is_active ? 'Actif' : 'Inactif'}
                  </button>
                  <button
                    onClick={() => handleDelete(duration.id)}
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
