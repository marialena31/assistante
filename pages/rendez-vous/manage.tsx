import { GetServerSideProps } from 'next';
import { createServerClient } from '@supabase/ssr';
import type { Database } from '../../types/supabase';
import Layout from '../../components/layout/Layout';
import { useToast } from '../../components/ui/Toast';
import type { Appointment } from '../../types/appointments';

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
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
      },
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

  const { data: appointments } = await supabase
    .from('appointments')
    .select('*')
    .eq('email', user.email || '')
    .order('appointment_date', { ascending: true }) as { data: Database['api']['Tables']['appointments']['Row'][] | null };

  return {
    props: {
      appointments: appointments || [],
      initialSession: user,
    },
  };
};

interface ManageAppointmentsPageProps {
  appointments: Appointment[];
  initialSession: any;
}

export default function ManageAppointmentsPage({ appointments, initialSession }: ManageAppointmentsPageProps) {
  const { showToast } = useToast();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Mes rendez-vous</h1>
        
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {appointments.map((appointment) => (
              <li key={appointment.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <p className="text-sm font-medium text-primary truncate">
                        {new Date(appointment.appointment_date).toLocaleDateString('fr-FR', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: 'numeric',
                          minute: 'numeric'
                        })}
                      </p>
                      <p className="mt-2 flex items-center text-sm text-gray-500">
                        {appointment.appointment_type === 'video' && 'Visioconférence'}
                        {appointment.appointment_type === 'phone' && 'Téléphone'}
                        {appointment.appointment_type === 'in_person' && 'En personne'}
                        <span className="mx-2">•</span>
                        {appointment.duration_minutes} minutes
                      </p>
                    </div>
                    <div className="ml-2 flex-shrink-0 flex">
                      <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' : ''}
                        ${appointment.status === 'cancelled' ? 'bg-red-100 text-red-800' : ''}
                        ${appointment.status === 'modified' ? 'bg-yellow-100 text-yellow-800' : ''}`}
                      >
                        {appointment.status === 'confirmed' && 'Confirmé'}
                        {appointment.status === 'cancelled' && 'Annulé'}
                        {appointment.status === 'modified' && 'Modifié'}
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
            {appointments.length === 0 && (
              <li>
                <div className="px-4 py-4 sm:px-6 text-center text-gray-500">
                  Vous n'avez pas encore de rendez-vous
                </div>
              </li>
            )}
          </ul>
        </div>
      </div>
    </Layout>
  );
}
