import Image from 'next/image';
import Layout from '../components/layout/Layout';
import FadeIn from '../components/animations/FadeIn';
import { motion } from 'framer-motion';
import StaggerChildren, { StaggerItem } from '../components/animations/StaggerChildren';
import LanguageSkills from '../components/LanguageSkills';
import aboutContent from '../content/pages/about.json';

export default function About() {
  return (
    <Layout
      title="Qui suis-je ? | Maria-Lena Pietri"
      description="Découvrez mon parcours et mes compétences en tant qu'assistante administrative freelance"
    >
      <div className="bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="bg-primary text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn>
              <h1 className="text-4xl font-bold mb-6">{aboutContent.title}</h1>
              <p className="text-xl text-white/90">
                {aboutContent.headerDescription}
              </p>
              <p className="text-xl text-white/90">
                {aboutContent.headerValues}
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
                    src="/images/profile.jpg"
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
                <h2 className="text-3xl font-bold text-dark">{aboutContent.profile.name}</h2>
                <p className="text-xl text-gray-600">
                  {aboutContent.profile.title}
                </p>
                <div className="prose prose-lg text-gray-600">
                  <ul className="mb-8">
                    {aboutContent.profile.highlights.map((highlight, index) => (
                      <li key={index}>{highlight}</li>
                    ))}
                  </ul>
                  <p className="font-medium text-lg mb-4">Langues :</p>
                  <LanguageSkills />
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
              <p className="mb-8">{aboutContent.subtitle}</p>
              <StaggerChildren>
                <div className="grid gap-8 max-w-3xl mx-auto">
                  {aboutContent.experiences.map((experience, index) => (
                    <StaggerItem key={index}>
                      <motion.div
                        className="bg-gray-50 rounded-lg p-6 shadow-md"
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div>
                            <h3 className="text-xl font-semibold text-primary">
                              {experience.title}
                            </h3>
                            <span className="text-accent font-medium md:text-right">
                              {experience.year}
                            </span>
                            <ul className="list-disc list-inside space-y-1 text-gray-600 mt-2">
                              {experience.details.map((detail, dIndex) => (
                                <li key={dIndex}>{detail}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </motion.div>
                    </StaggerItem>
                  ))}
                </div>
              </StaggerChildren>
            </FadeIn>
          </div>
        </div>

        {/* Formations et Certifications Section */}
        <div className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn>
              <h2 className="text-3xl font-bold text-dark mb-12 text-center">
                Mes Formations et Certifications
              </h2>
              <p className="mb-8">
                Un parcours d'apprentissage diversifié pour développer des compétences clés et rester à la pointe des besoins professionnels.
              </p>
              <StaggerChildren>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                  {aboutContent.formations.map((formation, index) => (
                    <StaggerItem key={index}>
                      <motion.div
                        className="bg-gray-50 rounded-lg p-6 shadow-md"
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div>
                            <h3 className="text-xl font-semibold text-primary">
                              {formation.title}
                            </h3>
                            <span className="text-accent font-medium md:text-right">
                              {formation.year}
                            </span>
                            <ul>
                              {formation.details.map((detail, dIndex) => (
                                <li key={dIndex}>{detail}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </motion.div>
                    </StaggerItem>
                  ))}
                </div>
              </StaggerChildren>
            </FadeIn>
          </div>
        </div>

        {/* Skills Section */}
        <div className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn>
              <h2 className="text-3xl font-bold text-dark mb-12 text-center">
                Mes Compétences Clés
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
                {aboutContent.skills.map((skill, index) => (
                  <FadeIn key={index}>
                    <motion.div
                      className="bg-white p-6 rounded-lg shadow-md text-center h-full flex flex-col justify-center"
                      whileHover={{ scale: 1.05, backgroundColor: '#f8fafc' }}
                      transition={{ duration: 0.3 }}
                    >
                      <h3 className="font-bold text-lg mb-2">{skill.title}</h3>
                      <p className="text-sm text-gray-600">{skill.description}</p>
                    </motion.div>
                  </FadeIn>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-accent text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <FadeIn>
              <h2 className="text-3xl font-bold mb-6">
                {aboutContent.callToAction.title}
              </h2>
              <p className="text-xl mb-8">
                {aboutContent.callToAction.description}
              </p>
              <motion.a
                href="/contact"
                className="inline-block bg-white text-accent hover:bg-gray-100 px-8 py-4 rounded-md font-medium transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {aboutContent.callToAction.buttonText}
              </motion.a>
            </FadeIn>
          </div>
        </div>
      </div>
    </Layout>
  );
}
