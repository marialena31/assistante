import React, { useState } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Appointment } from '../../../types/appointments';
import { useToast } from '../../ui/Toast';
import { useSupabaseQuery, mutateData } from '../../../hooks/useSupabaseQuery';

export default function AppointmentList() {
  const [filter, setFilter] = useState<'confirmed' | 'cancelled' | 'modified' | 'all'>('all');
  const { showToast } = useToast();

  const { data: appointments, loading, error, mutate } = useSupabaseQuery<Appointment[]>({
    table: 'appointments',
    orderBy: { column: 'appointment_date', ascending: true },
    filter: filter !== 'all' ? { status: filter } : undefined
  });

  const handleStatusChange = async (id: string, newStatus: Appointment['status']) => {
    const toastCallback = (message: string, type: 'success' | 'error') => {
      showToast('Notification', message, type);
    };

    const success = await mutateData({
      table: 'appointments',
      action: 'UPDATE',
      data: { status: newStatus },
      filter: { id }
    }, toastCallback, mutate);

    if (success) {
      toastCallback('Statut mis à jour avec succès', 'success');
    }
  };

  const handleDelete = async (id: string) => {
    const toastCallback = (message: string, type: 'success' | 'error') => {
      showToast('Notification', message, type);
    };

    const success = await mutateData({
      table: 'appointments',
      action: 'DELETE',
      filter: { id }
    }, toastCallback, mutate);

    if (success) {
      toastCallback('Rendez-vous supprimé avec succès', 'success');
    }
  };

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Une erreur est survenue</div>;
  if (!appointments || appointments.length === 0) return <div>Aucun rendez-vous</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Rendez-vous</h2>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as typeof filter)}
          className="rounded-md border-gray-300"
        >
          <option value="all">Tous</option>
          <option value="confirmed">Confirmés</option>
          <option value="cancelled">Annulés</option>
          <option value="modified">Modifiés</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Client
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Entreprise
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {appointments.map((appointment: Appointment) => (
              <tr key={appointment.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {format(new Date(appointment.appointment_date), 'PPP à HH:mm', { locale: fr })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {appointment.first_name} {appointment.last_name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {appointment.company_name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={appointment.status}
                    onChange={(e) => handleStatusChange(appointment.id, e.target.value as Appointment['status'])}
                    className="rounded-md border-gray-300"
                  >
                    <option value="confirmed">Confirmé</option>
                    <option value="cancelled">Annulé</option>
                    <option value="modified">Modifié</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleDelete(appointment.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
