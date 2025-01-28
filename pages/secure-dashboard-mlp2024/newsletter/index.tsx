import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useToast } from '../../../components/ui/Toast';
import AdminLayout from '../../../components/admin/AdminLayout';
import type { NewsletterSubscription } from '../../../types/newsletter';

export default function NewsletterAdmin() {
  const [subscriptions, setSubscriptions] = useState<NewsletterSubscription[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      const { data, error } = await supabase
        .schema('api')
        .from('newsletter_subscriptions')
        .select('*')
        .eq('is_deleted', false)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSubscriptions(data || []);
    } catch (error: any) {
      console.error('Error fetching subscriptions:', error);
      showToast('Erreur lors du chargement des inscriptions', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .schema('api')
        .from('newsletter_subscriptions')
        .update({ is_deleted: true })
        .eq('id', id);

      if (error) throw error;
      
      showToast('Inscription supprimée avec succès', 'success');
      fetchSubscriptions();
    } catch (error: any) {
      console.error('Error deleting subscription:', error);
      showToast('Erreur lors de la suppression', 'error');
    }
  };

  const handleExport = () => {
    const csvContent = [
      ['Email', 'Date d\'inscription', 'Catégories'],
      ...subscriptions.map(sub => [
        sub.email,
        new Date(sub.created_at).toLocaleDateString(),
        sub.categories.join(', ')
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `newsletter_subscriptions_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-6">Chargement...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Gestion de la Newsletter</h1>
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
          >
            Exporter CSV
          </button>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date d'inscription
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Catégories
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {subscriptions.map((subscription) => (
                <tr key={subscription.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {subscription.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(subscription.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    {subscription.categories.join(', ') || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleDelete(subscription.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
