import Image from 'next/image';
import { motion } from 'framer-motion';
import Layout from '../components/layout/Layout';
import FadeIn from '../components/animations/FadeIn';
import StaggerChildren, { StaggerItem } from '../components/animations/StaggerChildren';
import Counter from '../components/animations/Counter';
import AnimatedButton from '../components/ui/AnimatedButton';

const services = [
  {
    icon: '📋',
    title: 'Gestion Administrative',
    description: 'Gestion du courrier, des emails, classement et archivage des documents.',
  },
  {
    icon: '💼',
    title: 'Support Organisationnel',
    description: 'Organisation de réunions, gestion d\'agenda, planification d\'événements.',
  },
  {
    icon: '📊',
    title: 'Assistance Comptable',
    description: 'Suivi des factures, notes de frais, et préparation des documents comptables.',
  },
];

const stats = [
  { number: 95, suffix: '%', label: 'Satisfaction Client' },
  { number: 30, suffix: '+', label: 'Clients accompagnés' },
  { number: 20, suffix: '+', label: 'Années d\'Expérience' },
  { number: 24, suffix: 'h', label: 'Délai de Réponse' },
];

export default function Home() {
  return (
    <Layout
      title="Accueil | Maria-Lena Pietri"
      description="Assistante administrative freelance, je vous accompagne dans la gestion et l'organisation de vos tâches administratives"
    >
      {/* Hero Section */}
      <section className="section relative bg-gradient-to-b from-white to-gray-50/50">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <FadeIn direction="right">
              <div className="space-y-6">
                <h1 className="h1 text-gradient">
                  Votre assistante freelance polyvalente.
                </h1>
                <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
                  Forte d'une expérience diversifiée dans l'assistanat, la gestion de projets et le commerce, je mets mon expertise à votre service pour vous faire gagner du temps et de l'efficacité.
                </p>
                <div className="flex flex-wrap gap-4 pt-4">
                  <AnimatedButton href="/services" variant="primary">
                    Découvrez mes services
                  </AnimatedButton>
                  <AnimatedButton href="/contact" variant="outline">
                    Contactez-moi dès aujourd’hui pour un devis gratuit.
                  </AnimatedButton>
                </div>
              </div>
            </FadeIn>

            <FadeIn direction="left">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-primary/10 to-accent/10 shadow-strong">
                <Image
                  src="/images/hero.jpg"
                  alt="Photo Professionnelle"
                  width={1024}
                  height={768}
                  className="object-cover hover:scale-105 transition-transform duration-300"
                  priority
                />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="section bg-gray-50">
        <div className="container">
          <FadeIn>
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="h2 mb-6">
                Mes Services
              </h2>
              <p className="text-lg text-gray-600">
                Des solutions adaptées à vos besoins pour optimiser votre gestion administrative
              </p>
            </div>
          </FadeIn>

          <StaggerChildren>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <StaggerItem key={index}>
                  <div className="card card-hover h-full">
                    <div className="text-4xl mb-6">{service.icon}</div>
                    <h3 className="h3 mb-4">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 mb-6">{service.description}</p>
                    <motion.a
                      href="/services"
                      className="text-primary hover:text-primary-dark font-medium inline-flex items-center group"
                      whileHover={{ x: 5 }}
                    >
                      En savoir plus
                      <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
                    </motion.a>
                  </div>
                </StaggerItem>
              ))}
            </div>
          </StaggerChildren>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-sm bg-primary text-white">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
            {stats.map((stat, index) => (
              <FadeIn key={index} delay={index * 0.1}>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold mb-2">
                    <Counter end={stat.number} suffix={stat.suffix} duration={2} />
                  </div>
                  <div className="text-white/90 text-sm md:text-base">{stat.label}</div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="section-sm bg-accent text-white">
        <div className="container">
          <FadeIn>
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="h2 mb-6">
                Prête à vous accompagner dans vos projets
              </h2>
              <p className="text-lg md:text-xl mb-8 text-white/90">
                Contactez-moi pour discuter de vos besoins en assistance administrative
              </p>
              <motion.a
                href="/contact"
                className="inline-block bg-white text-accent hover:bg-gray-100 px-8 py-4 rounded-xl font-medium text-lg transition-all shadow-soft hover:shadow-strong"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Me contacter
              </motion.a>
            </div>
          </FadeIn>
        </div>
      </section>
    </Layout>
  );
}
