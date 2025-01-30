import { useEffect } from 'react';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';
import Layout from '../components/layout/Layout';
import { GetServerSideProps } from 'next';
import yaml from 'js-yaml';
import fs from 'fs';
import path from 'path';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import AdminLayout from '../components/admin/AdminLayout';

interface ApiDocsProps {
  spec: any;
}

export default function ApiDocs({ spec }: ApiDocsProps) {
  useEffect(() => {
    // Fix for Swagger UI in Next.js (prevents hydration mismatch)
    const style = document.createElement('style');
    style.innerHTML = '.swagger-ui .wrapper { padding: 0 !important; }';
    document.head.appendChild(style);
  }, []);

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">API Documentation</h1>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <SwaggerUI spec={spec} />
        </div>
      </div>
    </AdminLayout>
  );
}

export const getServerSideProps: GetServerSideProps<ApiDocsProps> = async ({ req }) => {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies[name];
        },
        set(name: string, value: string, options: any) {
          // We don't need to set cookies for reading operations
        },
        remove(name: string, options: any) {
          // We don't need to remove cookies for reading operations
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

  try {
    const swaggerFile = path.join(process.cwd(), 'docs', 'swagger.yaml');
    const fileContents = fs.readFileSync(swaggerFile, 'utf8');
    const spec = yaml.load(fileContents);

    return {
      props: {
        spec
      }
    };
  } catch (error) {
    console.error('Error loading Swagger spec:', error);
    return {
      notFound: true
    };
  }
};
