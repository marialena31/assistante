import { useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useToast } from '../ui/Toast';
import type { AppointmentPurpose, AppointmentDuration, AvailabilitySlot } from '../../types/appointments';

interface AppointmentFormProps {
  purposes: AppointmentPurpose[];
  durations: AppointmentDuration[];
  slots: AvailabilitySlot[];
}

export default function AppointmentForm({ purposes, durations, slots }: AppointmentFormProps) {
  const { showSuccessToast, showErrorToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    company_name: '',
    email: '',
    phone: '',
    address: '',
    purpose_id: '',
    message: '',
    appointment_type: 'video',
    appointment_date: '',
    duration_minutes: durations[0]?.duration_minutes || 30,
    reminders_enabled: true
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          auth: {
            flowType: 'pkce',
            detectSessionInUrl: true,
            persistSession: true,
            autoRefreshToken: true,
          },
        }
      );

      const { error } = await supabase
        .schema('api')
        .from('appointments')
        .insert([{
          ...formData,
          status: 'confirmed'
        }]);

      if (error) throw error;

      showSuccessToast('Rendez-vous créé avec succès');
      setFormData({
        first_name: '',
        last_name: '',
        company_name: '',
        email: '',
        phone: '',
        address: '',
        purpose_id: '',
        message: '',
        appointment_type: 'video',
        appointment_date: '',
        duration_minutes: durations[0]?.duration_minutes || 30,
        reminders_enabled: true
      });
    } catch (error: any) {
      console.error('Error creating appointment:', error);
      showErrorToast(error.message || 'Erreur lors de la création du rendez-vous');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
            Prénom
          </label>
          <input
            type="text"
            id="first_name"
            required
            value={formData.first_name}
            onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
            Nom
          </label>
          <input
            type="text"
            id="last_name"
            required
            value={formData.last_name}
            onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="company_name" className="block text-sm font-medium text-gray-700">
            Entreprise
          </label>
          <input
            type="text"
            id="company_name"
            required
            value={formData.company_name}
            onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Téléphone
          </label>
          <input
            type="tel"
            id="phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="purpose" className="block text-sm font-medium text-gray-700">
            Motif du rendez-vous
          </label>
          <select
            id="purpose"
            required
            value={formData.purpose_id}
            onChange={(e) => setFormData({ ...formData, purpose_id: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          >
            <option value="">Sélectionnez un motif</option>
            {purposes.map((purpose) => (
              <option key={purpose.id} value={purpose.id}>
                {purpose.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="appointment_type" className="block text-sm font-medium text-gray-700">
            Type de rendez-vous
          </label>
          <select
            id="appointment_type"
            required
            value={formData.appointment_type}
            onChange={(e) => setFormData({ ...formData, appointment_type: e.target.value as 'phone' | 'video' | 'in_person' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          >
            <option value="video">Visioconférence</option>
            <option value="phone">Téléphone</option>
            <option value="in_person">En personne</option>
          </select>
        </div>

        <div>
          <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
            Durée
          </label>
          <select
            id="duration"
            required
            value={formData.duration_minutes}
            onChange={(e) => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          >
            {durations.map((duration) => (
              <option key={duration.id} value={duration.duration_minutes}>
                {duration.duration_minutes} minutes
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700">
          Message (optionnel)
        </label>
        <textarea
          id="message"
          rows={4}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="reminders"
          checked={formData.reminders_enabled}
          onChange={(e) => setFormData({ ...formData, reminders_enabled: e.target.checked })}
          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
        />
        <label htmlFor="reminders" className="ml-2 block text-sm text-gray-700">
          Je souhaite recevoir des rappels pour mon rendez-vous
        </label>
      </div>

      <div>
        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          {loading ? 'Création en cours...' : 'Prendre rendez-vous'}
        </button>
      </div>
    </form>
  );
}
