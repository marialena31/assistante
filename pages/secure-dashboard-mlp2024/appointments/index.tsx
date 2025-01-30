import { GetServerSideProps } from 'next';
import { createServerClient } from '@supabase/ssr';
import Head from 'next/head';
import AdminLayout from '../../../components/layout/AdminLayout';
import AppointmentList from '../../../components/admin/appointments/AppointmentList';
import AppointmentSettings from '../../../components/admin/appointments/AppointmentSettings';
import AppointmentPurposeList from '../../../components/admin/appointments/AppointmentPurposeList';
import AppointmentDurationList from '../../../components/admin/appointments/AppointmentDurationList';
import AppointmentAvailabilityList from '../../../components/admin/appointments/AppointmentAvailabilityList';

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies[name];
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

  const { data: userRole } = await supabase
    .schema('api')
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .single();

  if (!userRole || userRole.role !== 'admin') {
    return {
      redirect: {
        destination: '/auth-mlp2024/signin',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

export default function AppointmentsAdminPage() {
  return (
    <AdminLayout>
      <Head>
        <title>Gestion des rendez-vous | Administration</title>
        <meta
          name="description"
          content="Interface d'administration des rendez-vous"
        />
      </Head>

      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">Gestion des rendez-vous</h1>
          
          <div className="mt-6 grid grid-cols-1 gap-8">
            {/* Settings */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-6">Paramètres généraux</h2>
              <AppointmentSettings />
            </div>

            {/* Purposes */}
            <div className="bg-white shadow rounded-lg p-6">
              <AppointmentPurposeList />
            </div>

            {/* Durations */}
            <div className="bg-white shadow rounded-lg p-6">
              <AppointmentDurationList />
            </div>

            {/* Availability */}
            <div className="bg-white shadow rounded-lg p-6">
              <AppointmentAvailabilityList />
            </div>

            {/* Appointments List */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-6">Liste des rendez-vous</h2>
              <AppointmentList />
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
