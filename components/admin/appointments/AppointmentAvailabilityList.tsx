import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useToast } from '../../ui/Toast';
import type { Database } from '../../../types/supabase';

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      persistSession: false
    }
  }
);

const DAYS_OF_WEEK = [
  'Dimanche',
  'Lundi',
  'Mardi',
  'Mercredi',
  'Jeudi',
  'Vendredi',
  'Samedi'
];

export default function AppointmentAvailabilityList() {
  const [slots, setSlots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newSlot, setNewSlot] = useState({
    day_of_week: '1',
    start_time: '09:00',
    end_time: '17:00'
  });
  const { showToast } = useToast();

  useEffect(() => {
    fetchSlots();
  }, []);

  const fetchSlots = async () => {
    try {
      const { data, error } = await supabase
        .schema('api')
        .from('availability_slots')
        .select('*')
        .order('day_of_week', { ascending: true })
        .order('start_time', { ascending: true });

      if (error) throw error;
      setSlots(data || []);
    } catch (error: any) {
      console.error('Error fetching slots:', error);
      showToast('Erreur', 'Erreur lors du chargement des créneaux', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (newSlot.start_time >= newSlot.end_time) {
      showToast('Erreur', 'L\'heure de début doit être antérieure à l\'heure de fin', 'error');
      return;
    }

    try {
      const { error } = await supabase
        .schema('api')
        .from('availability_slots')
        .insert({
          day_of_week: parseInt(newSlot.day_of_week),
          start_time: newSlot.start_time,
          end_time: newSlot.end_time,
          is_active: true
        });

      if (error) throw error;

      showToast('Succès', 'Créneau ajouté avec succès', 'success');
      setNewSlot({
        day_of_week: '1',
        start_time: '09:00',
        end_time: '17:00'
      });
      setIsAdding(false);
      fetchSlots();
    } catch (error: any) {
      console.error('Error adding slot:', error);
      showToast('Erreur', 'Erreur lors de l\'ajout du créneau', 'error');
    }
  };

  const handleToggleActive = async (id: string, currentActive: boolean) => {
    try {
      const { error } = await supabase
        .schema('api')
        .from('availability_slots')
        .update({ is_active: !currentActive })
        .eq('id', id);

      if (error) throw error;

      showToast('Succès', 'Créneau mis à jour avec succès', 'success');
      fetchSlots();
    } catch (error: any) {
      console.error('Error updating slot:', error);
      showToast('Erreur', 'Erreur lors de la mise à jour du créneau', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .schema('api')
        .from('availability_slots')
        .delete()
        .eq('id', id);

      if (error) throw error;

      showToast('Succès', 'Créneau supprimé avec succès', 'success');
      fetchSlots();
    } catch (error: any) {
      console.error('Error deleting slot:', error);
      showToast('Erreur', 'Erreur lors de la suppression du créneau', 'error');
    }
  };

  if (loading) return <div>Chargement...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Plages horaires disponibles</h3>
        <button
          onClick={() => setIsAdding(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          Ajouter
        </button>
      </div>

      {isAdding && (
        <div className="bg-white shadow sm:rounded-lg p-4 space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label htmlFor="day_of_week" className="block text-sm font-medium text-gray-700">
                Jour
              </label>
              <select
                id="day_of_week"
                value={newSlot.day_of_week}
                onChange={(e) => setNewSlot({ ...newSlot, day_of_week: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              >
                {DAYS_OF_WEEK.map((day, index) => (
                  <option key={index} value={index}>
                    {day}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="start_time" className="block text-sm font-medium text-gray-700">
                Heure de début
              </label>
              <input
                type="time"
                id="start_time"
                value={newSlot.start_time}
                onChange={(e) => setNewSlot({ ...newSlot, start_time: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="end_time" className="block text-sm font-medium text-gray-700">
                Heure de fin
              </label>
              <input
                type="time"
                id="end_time"
                value={newSlot.end_time}
                onChange={(e) => setNewSlot({ ...newSlot, end_time: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              />
            </div>
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
          {slots?.map((slot) => (
            <li key={slot.id} className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900">
                    {DAYS_OF_WEEK[slot.day_of_week]} : {slot.start_time} - {slot.end_time}
                  </h4>
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleToggleActive(slot.id, slot.is_active)}
                    className={`inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-full ${
                      slot.is_active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {slot.is_active ? 'Actif' : 'Inactif'}
                  </button>
                  <button
                    onClick={() => handleDelete(slot.id)}
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
