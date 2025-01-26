import Layout from '../components/layout/Layout';
import FadeIn from '../components/animations/FadeIn';
import StaggerChildren, { StaggerItem } from '../components/animations/StaggerChildren';
import { motion } from 'framer-motion';
import Counter from '../components/animations/Counter';


const stats = [
  { number: 20, suffix: '+', label: "Années d'expérience" },
  { number: 30, suffix: '+', label: 'Clients satisfaits' },
  { number: 50, suffix: '+', label: 'Projets réalisés' },
  { number: 100, suffix: '%', label: 'Engagement' },
];

const services = [
  {
    category: 'A. Gestion Administrative et Organisation',
    items: [
      'Organisation des dossiers et suivi des plannings.',
      'Contrôle documentaire, archivage, et rédaction de courriers.',
      'Assistance à la préparation de dossiers (marchés publics, audits).'
    ]
  },
  {
    category: 'B. Assistance RH',
    items: [
      'Gestion des arrivées/départs : matériel et logiciel.',
      'Rédaction d’annonces et tri des candidatures.',
      'Coordination des formations et suivi administratif des équipes.'
    ]
  },
  {
    category: 'C. Contrôle de Gestion et finance',
    items: [
      'Préparation des dossiers pour le cabinet comptable, suivi des factures/paiements.',
      'Gestion de trésorerie et analyse des coûts.',
      'Création de tableaux de bord et reporting à la direction.'
    ]
  },
  {
    category: 'D. Assistance Commerciale et Marketing',
    items: [
      'Élaboration de devis, gestion des commandes, et facturation.',
      'Création et gestion de catalogues papier et e-commerce.',
      'Organisation de campagnes marketing et gestion des réseaux sociaux.'
    ]
  },
  {
    category: 'E. Assistance Juridique',
    items: [
      'Préparation des documents juridiques et suivi des procédures judiciaires.',
      'Coordination avec les avocats, notaires et huissiers.',
      'Veille réglementaire et conformité RGPD.'
    ]
  },
  {
    category: 'F. Gestion de Projets et Cybersécurité',
    items: [
      'Utilisation des méthodologies Agile pour le suivi des projets.',
      'Surveillance des pratiques de sécurité et analyse des risques (formation cybersécurité).',
      'Gestion et maintenance de sites web (WordPress, Magento).'
    ]
  }
];

export default function Services() {
  return (
    <Layout
      title="Services | Maria-Lena Pietri"
      description="Découvrez mes services d'assistance administrative et de gestion pour optimiser votre organisation"
    >
      <div className="bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="bg-primary text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn>
              <h1 className="text-4xl font-bold mb-6">Mes Services</h1>
              <p className="text-xl text-white/90">
                Des solutions adaptées à vos besoins pour optimiser votre gestion administrative
              </p>
            </FadeIn>
          </div>
        </div>

        {/* Statistics Section */}
        <div className="bg-white py-12 border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <FadeIn key={index} delay={index * 0.1}>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">
                      <Counter
                        end={stat.number}
                        suffix={stat.suffix}
                        duration={2}
                      />
                    </div>
                    <div className="text-gray-600">{stat.label}</div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>

        {/* Services List */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <StaggerChildren>
            <div className="grid gap-8">
              {services.map((service, index) => (
                <StaggerItem
                  key={index}
                  variants={{
                    hidden: { opacity: 0, x: -20 },
                    visible: { opacity: 1, x: 0 }
                  }}
                >
                  <motion.div
                    className="bg-white rounded-lg shadow-md overflow-hidden"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="p-6">
                      <h2 className="text-2xl font-semibold text-dark mb-6">
                        {service.category}
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {service.items.map((item, itemIndex) => (
                          <motion.div
                            key={itemIndex}
                            className="flex items-start"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: itemIndex * 0.1 }}
                          >
                            <span className="text-accent mr-2">✓</span>
                            <span>{item}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </StaggerItem>
              ))}
            </div>
          </StaggerChildren>
        </div>

        {/* Call to Action */}
        <div className="bg-accent text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <FadeIn>
              <h2 className="text-3xl font-bold mb-6">
                Besoin d'un service sur mesure ?
              </h2>
              <p className="text-xl mb-8">
                Contactez-moi pour discuter de vos besoins spécifiques
              </p>
              <motion.a
                href="/contact"
                className="inline-block bg-white text-accent hover:bg-gray-100 px-8 py-4 rounded-md font-medium transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Me contacter
              </motion.a>
            </FadeIn>
          </div>
        </div>
      </div>
    </Layout>
  );
}
