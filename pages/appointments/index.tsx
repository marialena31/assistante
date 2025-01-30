import { useEffect, useState } from 'react';
import { createClient } from '../../utils/supabase/client';
import Layout from '../../components/layout/Layout';
import ErrorState from '../../components/appointments/ErrorState';
import type { AppointmentSettings } from '../../types/appointments';

export default function AppointmentsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [settings, setSettings] = useState<AppointmentSettings | null>(null);
  const supabase = createClient();

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
      if (!data) throw new Error('Aucun paramètre de rendez-vous trouvé');

      setSettings(data);
    } catch (error: any) {
      console.error('Error fetching appointment settings:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout title="Chargement... | Maria-Lena Pietri">
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  if (error || !settings) {
    return (
      <ErrorState
        title="Oops!"
        heading="Impossible de charger les paramètres de rendez-vous"
        description="Nous ne pouvons pas charger les paramètres de rendez-vous pour le moment. Veuillez réessayer plus tard ou nous contacter directement."
        buttonText="Retour à l'accueil"
        buttonLink="/"
      />
    );
  }

  return (
    <Layout
      title="Prendre rendez-vous | Maria-Lena Pietri"
      description={settings.description || 'Prenez rendez-vous avec Maria-Lena Pietri'}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{settings.title}</h1>
          {settings.description && (
            <p className="text-lg text-gray-600">{settings.description}</p>
          )}
        </div>

        {settings.photo_url && (
          <div className="relative h-64 md:h-96 mb-12 rounded-lg overflow-hidden">
            <img
              src={settings.photo_url}
              alt={settings.title}
              className="object-cover w-full h-full"
            />
          </div>
        )}

        {/* Add your appointment booking form or calendar component here */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Choisissez une date et un horaire</h2>
          {/* Add your calendar component here */}
          <p className="text-gray-600">
            Le calendrier de réservation sera bientôt disponible. En attendant, vous pouvez me contacter directement.
          </p>
        </div>
      </div>
    </Layout>
  );
}
