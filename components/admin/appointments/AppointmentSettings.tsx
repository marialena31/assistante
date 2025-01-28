import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { createBrowserClient } from '@supabase/ssr';
import { AppointmentSettings } from '../../../types/appointments';
import { useToast } from '../../ui/Toast';

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const settingsSchema = z.object({
  title: z.string().min(1, 'Le titre est requis'),
  description: z.string().optional(),
  photo_url: z.string().url('URL invalide').optional().or(z.literal('')),
  google_calendar_sync_url: z.string().url('URL invalide').optional().or(z.literal('')),
  email_reminder_enabled: z.boolean(),
  sms_reminder_enabled: z.boolean(),
  email_reminder_template: z.string().optional(),
  sms_reminder_template: z.string().optional(),
});

export default function AppointmentSettingsForm() {
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AppointmentSettings>({
    resolver: zodResolver(settingsSchema),
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .schema('api')
        .from('appointment_settings')
        .select('*')
        .single();

      if (error) throw error;
      if (data) reset(data);
    } catch (error) {
      showToast('Erreur lors du chargement des paramètres', 'error');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: AppointmentSettings) => {
    try {
      const { error } = await supabase
        .schema('api')
        .from('appointment_settings')
        .update(data)
        .eq('id', data.id);

      if (error) throw error;
      showToast('Paramètres mis à jour avec succès', 'success');
    } catch (error) {
      showToast('Erreur lors de la mise à jour des paramètres', 'error');
    }
  };

  if (loading) return <div>Chargement...</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Paramètres des rendez-vous</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-1">
            Titre de la page
          </label>
          <input
            type="text"
            {...register('title')}
            className="w-full border rounded-md p-2"
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Description
          </label>
          <textarea
            {...register('description')}
            className="w-full border rounded-md p-2"
            rows={4}
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            URL de la photo
          </label>
          <input
            type="url"
            {...register('photo_url')}
            className="w-full border rounded-md p-2"
          />
          {errors.photo_url && (
            <p className="text-red-500 text-sm mt-1">{errors.photo_url.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            URL de synchronisation Google Calendar
          </label>
          <input
            type="url"
            {...register('google_calendar_sync_url')}
            className="w-full border rounded-md p-2"
          />
          {errors.google_calendar_sync_url && (
            <p className="text-red-500 text-sm mt-1">{errors.google_calendar_sync_url.message}</p>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              {...register('email_reminder_enabled')}
              className="rounded"
            />
            <label className="text-sm">
              Activer les rappels par email
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              {...register('sms_reminder_enabled')}
              className="rounded"
            />
            <label className="text-sm">
              Activer les rappels par SMS
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Template du rappel par email
          </label>
          <textarea
            {...register('email_reminder_template')}
            className="w-full border rounded-md p-2"
            rows={4}
          />
          {errors.email_reminder_template && (
            <p className="text-red-500 text-sm mt-1">{errors.email_reminder_template.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Template du rappel par SMS
          </label>
          <textarea
            {...register('sms_reminder_template')}
            className="w-full border rounded-md p-2"
            rows={4}
          />
          {errors.sms_reminder_template && (
            <p className="text-red-500 text-sm mt-1">{errors.sms_reminder_template.message}</p>
          )}
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
        >
          Enregistrer les modifications
        </button>
      </form>
    </div>
  );
}
