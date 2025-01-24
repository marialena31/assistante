import Layout from '../components/layout/Layout';
import FadeIn from '../components/animations/FadeIn';

export default function MentionsLegales() {
  return (
    <Layout
      title="Mentions Légales | Maria-Lena Pietri"
      description="Mentions légales et informations juridiques concernant le site web de Maria-Lena Pietri, assistante administrative freelance."
    >
      <div className="bg-gradient-to-b from-white to-gray-50/50">
        <div className="container py-16 lg:py-24">
          <FadeIn>
            <h1 className="h1 text-gradient mb-12">Mentions Légales</h1>

            <div className="prose prose-lg max-w-none">
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-dark mb-6">1. Éditeur du site</h2>
                <p>Le présent site est édité par :</p>
                <ul className="list-none space-y-2">
                  <li><strong>Nom :</strong> Maria-Lena Pietri</li>
                  <li><strong>Statut juridique :</strong> Micro-entrepreneur</li>
                  <li><strong>SIRET :</strong> 48374376100056</li>
                  <li><strong>Numéro de TVA intracommunautaire :</strong> FR36483743761</li>
                  <li><strong>Adresse :</strong> Colomiers, France</li>
                  <li><strong>Contact :</strong> contact@marialena-pietri.fr | +33 7 61 81 11 01</li>
                </ul>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-bold text-dark mb-6">2. Responsable de la publication</h2>
                <ul className="list-none space-y-2">
                  <li><strong>Nom :</strong> Maria-Lena Pietri</li>
                  <li><strong>Email :</strong> contact@marialena-pietri.fr</li>
                </ul>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-bold text-dark mb-6">3. Hébergeur du site</h2>
                <p>Le site est hébergé par :</p>
                <ul className="list-none space-y-2">
                  <li><strong>Nom :</strong> Netlify</li>
                  <li><strong>Adresse :</strong> 2325 3rd Street, Suite 296, San Francisco, CA 94107, USA</li>
                  <li><strong>Site web :</strong> <a href="https://www.netlify.com" className="text-primary hover:text-primary-dark">www.netlify.com</a></li>
                </ul>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-bold text-dark mb-6">4. Propriété intellectuelle</h2>
                <p>L'ensemble des contenus présents sur ce site (textes, images, logos, éléments graphiques, icônes, etc.) est protégé par le droit d'auteur et le droit de la propriété intellectuelle.</p>
                <p>Toute reproduction, distribution, modification, adaptation ou publication, même partielle, de ces éléments est strictement interdite sans l'autorisation préalable écrite de Maria-Lena Pietri.</p>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-bold text-dark mb-6">5. Limitations de responsabilité</h2>
                <p>L'éditeur du site s'efforce de fournir des informations aussi précises que possible. Toutefois, il ne peut garantir l'exactitude, l'exhaustivité ou l'actualité des informations diffusées sur le site.</p>
                <p>Par conséquent, l'utilisateur reconnaît utiliser ces informations sous sa responsabilité exclusive.</p>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-bold text-dark mb-6">6. Protection des données personnelles</h2>
                <p>Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés, les informations collectées via le formulaire de contact sont strictement confidentielles et destinées à l'usage exclusif de Maria-Lena Pietri pour le traitement des demandes.</p>
                <h3 className="text-xl font-bold text-dark mt-6 mb-4">Droits des utilisateurs</h3>
                <p>Vous disposez d'un droit d'accès, de rectification, de suppression et d'opposition concernant vos données personnelles. Pour exercer ces droits, vous pouvez contacter :</p>
                <p><strong>Email :</strong> contact@marialena-pietri.fr</p>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-bold text-dark mb-6">7. Liens externes</h2>
                <p>Ce site peut contenir des liens hypertextes redirigeant vers d'autres sites web. Maria-Lena Pietri ne peut être tenue responsable du contenu de ces sites tiers ni des éventuels dommages pouvant résulter de leur consultation.</p>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-bold text-dark mb-6">8. Conditions de vente</h2>
                <p>Les services proposés sont destinés exclusivement à des professionnels. Les prestations sont facturées en hors taxes (HT).</p>
                <p>Aucun droit de rétractation n'est applicable une fois la prestation entamée. Les paiements peuvent être effectués par virement bancaire ou carte bancaire.</p>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-bold text-dark mb-6">9. Cookies</h2>
                <p>Le site utilise des cookies pour améliorer l'expérience utilisateur et analyser la fréquentation. Vous pouvez configurer vos préférences en matière de cookies depuis votre navigateur.</p>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-bold text-dark mb-6">10. Modification des mentions légales</h2>
                <p>Maria-Lena Pietri se réserve le droit de modifier les présentes mentions légales à tout moment. Il est conseillé aux utilisateurs de les consulter régulièrement.</p>
                <p className="mt-6 text-sm text-gray-600">Ces mentions légales ont été mises à jour le 24/01/2025.</p>
              </section>
            </div>
          </FadeIn>
        </div>
      </div>
    </Layout>
  );
}
