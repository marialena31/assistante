import { GetServerSideProps } from 'next';
import { createServerClient } from '@supabase/ssr';
import type { Database } from '../../types/supabase';
import Layout from '../../components/layout/Layout';
import { useToast } from '../../components/ui/Toast';
import AppointmentForm from '../../components/appointments/AppointmentForm';
import type { AppointmentSettings, AppointmentPurpose, AppointmentDuration, AvailabilitySlot } from '../../types/appointments';

interface AppointmentPageProps {
  settings: AppointmentSettings;
  purposes: AppointmentPurpose[];
  durations: AppointmentDuration[];
  slots: AvailabilitySlot[];
}

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
      db: {
        schema: 'api'
      }
    }
  );

  const { data: settings } = await supabase
    .from('appointment_settings')
    .select('*')
    .single() as { data: Database['api']['Tables']['appointment_settings']['Row'] | null };

  const { data: purposes } = await supabase
    .from('appointment_purposes')
    .select('*')
    .eq('is_active', true) as { data: Database['api']['Tables']['appointment_purposes']['Row'][] | null };

  const { data: durations } = await supabase
    .from('appointment_durations')
    .select('*')
    .eq('is_active', true) as { data: Database['api']['Tables']['appointment_durations']['Row'][] | null };

  const { data: slots } = await supabase
    .from('availability_slots')
    .select('*')
    .eq('is_active', true) as { data: Database['api']['Tables']['availability_slots']['Row'][] | null };

  return {
    props: {
      settings: settings || null,
      purposes: purposes || [],
      durations: durations || [],
      slots: slots || [],
    },
  };
};

export default function AppointmentPage({ settings, purposes, durations, slots }: AppointmentPageProps) {
  const { showToast } = useToast();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">{settings?.title || 'Prendre un rendez-vous'}</h1>
        {settings?.description && (
          <p className="mb-6">{settings.description}</p>
        )}
        
        <AppointmentForm
          purposes={purposes}
          durations={durations}
          slots={slots}
        />
      </div>
    </Layout>
  );
}
