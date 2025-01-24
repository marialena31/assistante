import Layout from '../components/layout/Layout';

export default function TestPage() {
  return (
    <Layout title="Test Page">
      <div className="container py-20">
        <h1 className="text-gradient text-4xl font-bold mb-8">
          Test Page
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-primary text-white p-8 rounded-lg">
            Primary Background
          </div>
          <div className="bg-accent text-white p-8 rounded-lg">
            Accent Background
          </div>
        </div>
      </div>
    </Layout>
  );
}
