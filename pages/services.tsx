import Layout from '../components/layout/Layout';
import FadeIn from '../components/animations/FadeIn';
import StaggerChildren, { StaggerItem } from '../components/animations/StaggerChildren';
import { motion } from 'framer-motion';
import Counter from '../components/animations/Counter';
import servicesContent from '../content/pages/services.json';

export default function Services() {
  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="bg-primary text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn>
              <h1 className="text-4xl font-bold mb-6">{servicesContent.title}</h1>
              <p className="text-xl text-white/90">
                {servicesContent.subtitle}
              </p>
            </FadeIn>
          </div>
        </div>

        {/* Statistics Section */}
        <div className="bg-white py-12 border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {servicesContent.stats.map((stat, index) => (
                <FadeIn key={index} delay={index * 0.1}>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">
                      <Counter
                        from={0}
                        to={stat.number}
                        duration={2}
                      />
                      {stat.suffix}
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
              {servicesContent.services.map((service, index) => (
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
