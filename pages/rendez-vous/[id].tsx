import { GetServerSideProps } from 'next';
import { createServerClient } from '@supabase/ssr';
import type { Database } from '../../types/supabase';
import Layout from '../../components/layout/Layout';
import { useToast } from '../../components/ui/Toast';
import type { Appointment } from '../../types/appointments';

export const getServerSideProps: GetServerSideProps = async ({ req, res, params }) => {
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies[name]
        },
        set(name: string, value: string, options: any) {
          res.setHeader('Set-Cookie', `${name}=${value}`)
        },
        remove(name: string, options: any) {
          res.setHeader('Set-Cookie', `${name}=; Max-Age=0`)
        },
      }
    }
  );
  
  // Get user from auth token (always use getUser on server)
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user?.email?.endsWith('@marialena-pietri.fr')) {
    return {
      redirect: {
        destination: '/auth-mlp2024/signin',
        permanent: false,
      },
    };
  }

  const { data: appointment } = await supabase
    .from('appointments')
    .select('*')
    .eq('id', params?.id || '')
    .single() as { data: Database['api']['Tables']['appointments']['Row'] };

  if (!appointment) {
    return {
      notFound: true,
    };
  }

  // Verify that the user owns this appointment
  if (appointment.email !== user.email) {
    return {
      redirect: {
        destination: '/rendez-vous',
        permanent: false,
      },
    };
  }

  return {
    props: {
      appointment,
      initialSession: user,
    },
  };
};

interface AppointmentPageProps {
  appointment: Appointment;
}

export default function AppointmentPage({ appointment }: AppointmentPageProps) {
  const { showToast } = useToast();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Détails du rendez-vous</h1>
        
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Informations du rendez-vous
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Détails et statut de votre rendez-vous
            </p>
          </div>
          <div className="border-t border-gray-200">
            <dl>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Date</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {new Date(appointment.appointment_date).toLocaleDateString('fr-FR', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric'
                  })}
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Type</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {appointment.appointment_type === 'video' && 'Visioconférence'}
                  {appointment.appointment_type === 'phone' && 'Téléphone'}
                  {appointment.appointment_type === 'in_person' && 'En personne'}
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Durée</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {appointment.duration_minutes} minutes
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Statut</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {appointment.status === 'confirmed' && 'Confirmé'}
                  {appointment.status === 'cancelled' && 'Annulé'}
                  {appointment.status === 'modified' && 'Modifié'}
                </dd>
              </div>
              {appointment.message && (
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Message</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {appointment.message}
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </div>
      </div>
    </Layout>
  );
}
