import Layout from '../components/layout/Layout';
import FadeIn from '../components/animations/FadeIn';
import { motion } from 'framer-motion';
import StaggerChildren, { StaggerItem } from '../components/animations/StaggerChildren';

const packages = [
  {
    name: 'Forfait Horaire',
    price: '45€',
    unit: 'par heure',
    description: 'Idéal pour des besoins ponctuels ou des missions courtes',
    features: [
      'Facturation à l\'heure',
      'Sans engagement',
      'Missions ponctuelles',
      'Flexibilité maximale',
    ],
  },
  {
    name: 'Forfait Demi-journée',
    price: '160€',
    unit: 'par demi-journée',
    description: 'Pour les projets nécessitant plusieurs heures de travail consécutives',
    features: [
      '4 heures consécutives',
      'Tarif avantageux',
      'Organisation optimisée',
      'Suivi de projet',
    ],
    popular: true,
  },
  {
    name: 'Forfait Journée',
    price: '300€',
    unit: 'par jour',
    description: 'Solution économique pour les projets importants',
    features: [
      '8 heures de travail',
      'Tarif préférentiel',
      'Gestion de projet complète',
      'Rapport d\'activité',
    ],
  },
];

const additionalServices = [
  {
    name: 'Pack Démarrage',
    price: '500€',
    description: 'Mise en place complète de votre organisation administrative',
    includes: [
      'Audit de l\'existant',
      'Mise en place des process',
      'Formation aux outils',
      'Suivi personnalisé',
    ],
  },
  {
    name: 'Pack Mensuel',
    price: 'Sur devis',
    description: 'Accompagnement régulier adapté à vos besoins',
    includes: [
      'Volume horaire défini',
      'Tarif préférentiel',
      'Engagement mensuel',
      'Reporting mensuel',
    ],
  },
];

export default function Tarifs() {
  return (
    <Layout
      title="Tarifs | Maria-Lena Pietri"
      description="Découvrez mes forfaits et tarifs pour l'assistance administrative"
    >
      <div className="bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="bg-primary text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn>
              <h1 className="text-4xl font-bold mb-6">Tarifs</h1>
              <p className="text-xl text-white/90">
                Des forfaits adaptés à vos besoins
              </p>
            </FadeIn>
          </div>
        </div>

        {/* Main Packages */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <FadeIn>
            <h2 className="text-3xl font-bold text-dark text-center mb-12">
              Mes Forfaits
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {packages.map((pkg, index) => (
              <FadeIn key={index} delay={index * 0.2}>
                <motion.div
                  className={`bg-white rounded-lg shadow-md overflow-hidden ${
                    pkg.popular ? 'ring-2 ring-accent' : ''
                  }`}
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.3 }}
                >
                  {pkg.popular && (
                    <div className="bg-accent text-white text-center py-2 text-sm font-medium">
                      Populaire
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-dark mb-2">
                      {pkg.name}
                    </h3>
                    <div className="flex items-baseline mb-4">
                      <span className="text-4xl font-bold text-primary">
                        {pkg.price}
                      </span>
                      <span className="text-gray-500 ml-2">{pkg.unit}</span>
                    </div>
                    <p className="text-gray-600 mb-6">{pkg.description}</p>
                    <ul className="space-y-3">
                      {pkg.features.map((feature, featureIndex) => (
                        <motion.li
                          key={featureIndex}
                          className="flex items-start"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 + featureIndex * 0.1 }}
                        >
                          <span className="text-accent mr-2">✓</span>
                          <span>{feature}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-6 bg-gray-50 mt-6">
                    <motion.a
                      href="/contact"
                      className="block w-full text-center bg-accent text-white py-3 rounded-md font-medium hover:bg-accent/90 transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Choisir ce forfait
                    </motion.a>
                  </div>
                </motion.div>
              </FadeIn>
            ))}
          </div>
        </div>

        {/* Additional Services */}
        <div className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn>
              <h2 className="text-3xl font-bold text-dark text-center mb-12">
                Services Complémentaires
              </h2>
            </FadeIn>

            <StaggerChildren>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {additionalServices.map((service, index) => (
                  <StaggerItem key={index}>
                    <motion.div
                      className="bg-gray-50 rounded-lg p-6 shadow-md"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h3 className="text-2xl font-bold text-dark mb-2">
                        {service.name}
                      </h3>
                      <div className="text-2xl font-bold text-primary mb-4">
                        {service.price}
                      </div>
                      <p className="text-gray-600 mb-6">{service.description}</p>
                      <ul className="space-y-3">
                        {service.includes.map((item, itemIndex) => (
                          <motion.li
                            key={itemIndex}
                            className="flex items-start"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: itemIndex * 0.1 }}
                          >
                            <span className="text-accent mr-2">✓</span>
                            <span>{item}</span>
                          </motion.li>
                        ))}
                      </ul>
                      <div className="mt-6">
                        <motion.a
                          href="/contact"
                          className="block w-full text-center bg-accent text-white py-3 rounded-md font-medium hover:bg-accent/90 transition-colors"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          En savoir plus
                        </motion.a>
                      </div>
                    </motion.div>
                  </StaggerItem>
                ))}
              </div>
            </StaggerChildren>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-accent text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <FadeIn>
              <h2 className="text-3xl font-bold mb-6">
                Besoin d'un devis personnalisé ?
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
                Demander un devis
              </motion.a>
            </FadeIn>
          </div>
        </div>
      </div>
    </Layout>
  );
}
