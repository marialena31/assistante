import { GetServerSideProps } from 'next';
import { createServerClient } from '@supabase/ssr';
import type { CookieOptions } from '@supabase/ssr';
import AppointmentForm from '../../components/appointments/AppointmentForm';
import { Database } from '../../types/database';
import Head from 'next/head';

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies[name];
        },
        set(name: string, value: string, options: CookieOptions) {
          res.setHeader('Set-Cookie', `${name}=${value}; Path=${options.path || '/'}${options.maxAge ? `; Max-Age=${options.maxAge}` : ''}${options.domain ? `; Domain=${options.domain}` : ''}${options.sameSite ? `; SameSite=${options.sameSite}` : ''}${options.secure ? '; Secure' : ''}`);
        },
        remove(name: string, options: CookieOptions) {
          res.setHeader('Set-Cookie', `${name}=; Path=${options.path || '/'}; Max-Age=0`);
        },
      },
    }
  );

  try {
    const { data: settings, error } = await supabase
      .from('appointment_settings')
      .select('*')
      .single();

    if (error) {
      console.error('Error fetching appointment settings:', error);
      return {
        props: {
          settings: null,
        },
      };
    }

    return {
      props: {
        settings,
      },
    };
  } catch (error) {
    console.error('Error in getServerSideProps:', error);
    return {
      props: {
        settings: null,
      },
    };
  }
};

interface Props {
  settings: {
    available_days: string[];
    available_hours: string[];
    max_appointments_per_day: number;
  } | null;
}

export default function RendezVous({ settings }: Props) {
  if (!settings) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Impossible de charger les paramètres de rendez-vous.</p>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Prendre rendez-vous | Maria-Lena Pietri</title>
        <meta name="description" content="Prenez rendez-vous avec Maria-Lena Pietri" />
      </Head>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-extrabold text-gray-900 text-center mb-8">
              Prendre rendez-vous
            </h1>
            <AppointmentForm settings={settings} />
          </div>
        </div>
      </div>
    </>
  );
}
