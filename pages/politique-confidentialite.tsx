import Layout from '../components/layout/Layout';
import FadeIn from '../components/animations/FadeIn';

export default function PolitiqueConfidentialite() {
  return (
    <Layout
      title="Politique de Confidentialité | Maria-Lena Pietri"
      description="Politique de confidentialité et informations sur la protection des données personnelles du site web de Maria-Lena Pietri."
    >
      <div className="bg-gradient-to-b from-white to-gray-50/50">
        <div className="container py-16 lg:py-24">
          <FadeIn>
            <h1 className="h1 text-gradient mb-12">Politique de Confidentialité</h1>
            <p className="text-sm text-gray-600 mb-8">Dernière mise à jour : 24/01/2025</p>

            <div className="prose prose-lg max-w-none">
              <p className="lead mb-12">
                Chez Maria-Lena Pietri EI, nous attachons une grande importance à la protection de vos données personnelles et à votre vie privée. La présente politique de confidentialité a pour objectif de vous informer de la manière dont nous collectons, utilisons et protégeons vos informations personnelles lorsque vous utilisez notre site web.
              </p>

              <section className="mb-12">
                <h2 className="text-2xl font-bold text-dark mb-6">1. Responsable du traitement des données</h2>
                <p>Le responsable du traitement des données collectées sur ce site est :</p>
                <ul className="list-none space-y-2">
                  <li><strong>Nom :</strong> Maria-Lena Pietri</li>
                  <li><strong>Adresse :</strong> Colomiers, France</li>
                  <li><strong>Email :</strong> contact@marialena-pietri.fr</li>
                  <li><strong>Numéro de téléphone :</strong> +33 7 61 81 11 01</li>
                  <li><strong>SIRET :</strong> 48374376100056</li>
                </ul>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-bold text-dark mb-6">2. Données collectées</h2>
                <p>Nous collectons uniquement les données nécessaires pour répondre à vos demandes et améliorer nos services. Les données collectées peuvent inclure :</p>
                
                <h3 className="text-xl font-bold text-dark mt-6 mb-4">Données fournies directement par vous :</h3>
                <ul className="list-disc pl-6 mb-6">
                  <li>Nom, prénom</li>
                  <li>Adresse email</li>
                  <li>Numéro de téléphone</li>
                  <li>Message envoyé via le formulaire de contact</li>
                </ul>

                <h3 className="text-xl font-bold text-dark mt-6 mb-4">Données collectées automatiquement :</h3>
                <ul className="list-disc pl-6">
                  <li>Adresse IP</li>
                  <li>Données de navigation (via des cookies ou technologies similaires)</li>
                </ul>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-bold text-dark mb-6">3. Utilisation des données</h2>
                <p>Vos données personnelles sont utilisées pour :</p>
                <ul className="list-disc pl-6">
                  <li>Répondre à vos demandes envoyées via le formulaire de contact.</li>
                  <li>Vous fournir des informations ou devis relatifs à nos services.</li>
                  <li>Améliorer l'expérience utilisateur sur le site.</li>
                  <li>Garantir la sécurité et le bon fonctionnement du site web.</li>
                </ul>
                <p className="mt-4">Nous ne vendons, louons ou cédons jamais vos données à des tiers sans votre consentement explicite.</p>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-bold text-dark mb-6">4. Conservation des données</h2>
                <p>Vos données personnelles sont conservées :</p>
                <ul className="list-disc pl-6">
                  <li>Aussi longtemps que nécessaire pour répondre à vos demandes.</li>
                  <li>Conformément aux obligations légales en vigueur.</li>
                </ul>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-bold text-dark mb-6">5. Partage des données</h2>
                <p>Vos données peuvent être partagées avec :</p>
                <ul className="list-disc pl-6">
                  <li>Les prestataires techniques qui assurent l'hébergement du site (Netlify).</li>
                  <li>Les autorités compétentes si cela est requis par la loi.</li>
                </ul>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-bold text-dark mb-6">6. Cookies</h2>
                <p>Le site utilise des cookies pour :</p>
                <ul className="list-disc pl-6">
                  <li>Améliorer votre expérience de navigation.</li>
                  <li>Collecter des statistiques anonymes sur l'utilisation du site.</li>
                </ul>
                <p className="mt-4">Vous pouvez configurer votre navigateur pour accepter ou refuser les cookies.</p>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-bold text-dark mb-6">7. Vos droits</h2>
                <p>Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez des droits suivants :</p>
                <ul className="list-disc pl-6">
                  <li><strong>Droit d'accès :</strong> Obtenir une copie de vos données personnelles.</li>
                  <li><strong>Droit de rectification :</strong> Demander la correction des données inexactes.</li>
                  <li><strong>Droit à l'effacement :</strong> Demander la suppression de vos données dans certaines circonstances.</li>
                  <li><strong>Droit à la portabilité :</strong> Recevoir vos données dans un format structurant et couramment utilisé.</li>
                  <li><strong>Droit d'opposition :</strong> Vous opposer au traitement de vos données pour des motifs légitimes.</li>
                </ul>
                <p className="mt-4">Pour exercer vos droits, veuillez nous contacter à contact@marialena-pietri.fr.</p>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-bold text-dark mb-6">8. Sécurité des données</h2>
                <p>Nous mettons en œuvre des mesures techniques et organisationnelles pour protéger vos données contre tout accès non autorisé, modification, divulgation ou destruction.</p>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-bold text-dark mb-6">9. Modifications de la politique de confidentialité</h2>
                <p>Cette politique de confidentialité peut être mise à jour pour refléter les changements de nos pratiques ou des obligations légales. Nous vous invitons à consulter régulièrement cette page.</p>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-bold text-dark mb-6">10. Contact</h2>
                <p>Pour toute question ou préoccupation concernant cette politique, veuillez nous contacter :</p>
                <ul className="list-none space-y-2 mt-4">
                  <li><strong>Email :</strong> contact@marialena-pietri.fr</li>
                  <li><strong>Téléphone :</strong> +33 7 61 81 11 01</li>
                </ul>
              </section>
            </div>
          </FadeIn>
        </div>
      </div>
    </Layout>
  );
}
