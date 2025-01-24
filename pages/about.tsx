import Image from 'next/image';
import Layout from '../components/layout/Layout';
import FadeIn from '../components/animations/FadeIn';
import { motion } from 'framer-motion';
import StaggerChildren, { StaggerItem } from '../components/animations/StaggerChildren';

const experiences = [
  {
    period: '2020 - Présent',
    title: 'Assistante Administrative Freelance',
    description: 'Gestion administrative et support aux entreprises en tant qu\'indépendante.',
  },
  {
    period: '2015 - 2020',
    title: 'Assistante de Direction',
    description: 'Coordination des activités administratives et support à la direction générale.',
  },
  {
    period: '2012 - 2015',
    title: 'Assistante Administrative',
    description: 'Gestion administrative et relation client dans une PME.',
  },
];

const skills = [
  'Pack Office (Word, Excel, PowerPoint)',
  'Outils de gestion de projet',
  'Communication professionnelle',
  'Organisation et planification',
  'Gestion documentaire',
  'Relation client',
  'Comptabilité de base',
  'Outils collaboratifs',
];

export default function About() {
  return (
    <Layout
      title="À Propos | Maria-Lena Pietri"
      description="Découvrez mon parcours et mes compétences en tant qu'assistante administrative freelance"
    >
      <div className="bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="bg-primary text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn>
              <h1 className="text-4xl font-bold mb-6">À Propos</h1>
              <p className="text-xl text-white/90">
                Découvrez mon parcours et mes compétences
              </p>
            </FadeIn>
          </div>
        </div>

        {/* Profile Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <FadeIn direction="right">
              <div className="relative aspect-square max-w-md mx-auto lg:mx-0">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                  className="relative w-full h-full rounded-lg overflow-hidden shadow-xl"
                >
                  <Image
                    src="/images/profile-photo.jpg"
                    alt="Maria-Lena Pietri"
                    fill
                    style={{ objectFit: 'cover' }}
                    className="rounded-lg"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />
                </motion.div>
              </div>
            </FadeIn>

            <FadeIn direction="left">
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-dark">Maria-Lena Pietri</h2>
                <p className="text-xl text-gray-600">
                  Assistante Administrative Freelance
                </p>
                <div className="prose prose-lg text-gray-600">
                  <p>
                    Forte de plus de 8 ans d'expérience dans l'assistance administrative,
                    je mets mes compétences au service des entrepreneurs et des PME pour
                    optimiser leur gestion administrative et leur organisation.
                  </p>
                  <p>
                    Mon approche combine rigueur, adaptabilité et proactivité pour
                    répondre au mieux aux besoins spécifiques de chaque client.
                  </p>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>

        {/* Experience Section */}
        <div className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn>
              <h2 className="text-3xl font-bold text-dark mb-12 text-center">
                Mon Parcours
              </h2>
            </FadeIn>

            <StaggerChildren>
              <div className="grid gap-8 max-w-3xl mx-auto">
                {experiences.map((exp, index) => (
                  <StaggerItem key={index}>
                    <motion.div
                      className="bg-gray-50 rounded-lg p-6 shadow-md"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                          <h3 className="text-xl font-semibold text-primary">
                            {exp.title}
                          </h3>
                          <p className="text-gray-600">{exp.description}</p>
                        </div>
                        <div className="text-accent font-medium md:text-right">
                          {exp.period}
                        </div>
                      </div>
                    </motion.div>
                  </StaggerItem>
                ))}
              </div>
            </StaggerChildren>
          </div>
        </div>

        {/* Skills Section */}
        <div className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn>
              <h2 className="text-3xl font-bold text-dark mb-12 text-center">
                Mes Compétences
              </h2>
            </FadeIn>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {skills.map((skill, index) => (
                <FadeIn key={index} delay={index * 0.1}>
                  <motion.div
                    className="bg-white p-4 rounded-lg shadow-md text-center"
                    whileHover={{ scale: 1.05, backgroundColor: '#f8fafc' }}
                    transition={{ duration: 0.3 }}
                  >
                    <span className="text-gray-700">{skill}</span>
                  </motion.div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-accent text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <FadeIn>
              <h2 className="text-3xl font-bold mb-6">
                Prête à vous accompagner dans vos projets
              </h2>
              <p className="text-xl mb-8">
                Discutons de vos besoins en assistance administrative
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
