import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { createClient } from '@supabase/supabase-js';
import Layout from '../../components/layout/Layout';
import AdminLayout from '../../components/admin/AdminLayout';
import ContentEditor from '../../components/admin/ContentEditor';
import { useAuth } from '../../hooks/useAuth';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export default function AdminDashboard() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [activeSection, setActiveSection] = useState('pages');

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/admin/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <Layout title="Chargement... | Administration">
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <Layout title="Administration | Maria-Lena Pietri">
      <AdminLayout>
        <div className="container py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="h1">Tableau de bord</h1>
            <div className="flex items-center gap-4">
              <span className="text-gray-600">
                Connecté en tant que {user.email}
              </span>
              <button
                onClick={() => supabase.auth.signOut()}
                className="btn-secondary"
              >
                Déconnexion
              </button>
            </div>
          </div>

          {/* Navigation */}
          <div className="mb-8">
            <nav className="flex gap-4">
              <button
                onClick={() => setActiveSection('pages')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  activeSection === 'pages'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                Pages
              </button>
              <button
                onClick={() => setActiveSection('media')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  activeSection === 'media'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                Médias
              </button>
              <button
                onClick={() => setActiveSection('settings')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  activeSection === 'settings'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                Paramètres
              </button>
            </nav>
          </div>

          {/* Content Section */}
          <div className="bg-white rounded-lg shadow-soft p-6">
            {activeSection === 'pages' && (
              <ContentEditor />
            )}
            {activeSection === 'media' && (
              <div>
                <h2 className="h2 mb-4">Gestionnaire de médias</h2>
                {/* Media manager component will be added here */}
              </div>
            )}
            {activeSection === 'settings' && (
              <div>
                <h2 className="h2 mb-4">Paramètres</h2>
                {/* Settings component will be added here */}
              </div>
            )}
          </div>
        </div>
      </AdminLayout>
    </Layout>
  );
}
