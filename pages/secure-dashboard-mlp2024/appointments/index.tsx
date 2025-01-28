import { GetServerSideProps } from 'next';
import { createServerClient } from '@supabase/ssr';
import Head from 'next/head';
import AppointmentList from '../../../components/admin/appointments/AppointmentList';
import AppointmentSettings from '../../../components/admin/appointments/AppointmentSettings';

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

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
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
    .eq('user_id', session.user.id)
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
    <>
      <Head>
        <title>Gestion des rendez-vous | Administration</title>
        <meta
          name="description"
          content="Interface d'administration des rendez-vous"
        />
      </Head>

      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-8">Gestion des rendez-vous</h1>
          
          <div className="grid grid-cols-1 gap-8">
            {/* Appointments List */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-6">Liste des rendez-vous</h2>
              <AppointmentList />
            </div>

            {/* Settings */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-6">Paramètres</h2>
              <AppointmentSettings />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
