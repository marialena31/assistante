import Image from 'next/image';
import Layout from '../components/layout/Layout';
import FadeIn from '../components/animations/FadeIn';
import { motion } from 'framer-motion';
import StaggerChildren, { StaggerItem } from '../components/animations/StaggerChildren';
import LanguageSkills from '../components/LanguageSkills';

const experiences = [
  {
    year: "2021 - Aujourd’hui",
    title: "Freelance et Mentor Web",
    details: [
      "Gestion et maintenance de sites web (WordPress, Magento).",
      "Mentorat pour des apprenants en développement web (OpenClassrooms)."
    ]
  },
  {
    year: "2022-2023",
    title: "Commerciale en Immobilier d’Entreprise (Capifrance)",
    details: [
      "Prospection et gestion d’un portefeuille client professionnel.",
      "Négociation de contrats et accompagnement administratif."
    ]
  },
  {
    year: "2015-2019",
    title: "Gestionnaire de Sites Web (Clever Age et Missions Freelance)",
    details: [
      "Administration, optimisation et création de contenus pour des sites e-commerce.",
      "Surveillance des bonnes pratiques en cybersécurité."
    ]
  },
  {
    year: "2009-2014",
    title: "Marketing et Gestion de Produits (Chausson Matériaux)",
    details: [
      "Gestion de catalogues papier et en ligne.",
      "Coordination de projets marketing avec des prestataires externes."
    ]
  },
  {
    year: "2007-2009",
    title: "Contrôle de Gestion et Exploitation (Chausson Matériaux)",
    details: [
      "Supervision des stocks et des procédures dans 13 agences.",
      "Reporting et tableaux de suivi pour la direction."
    ]
  },
  {
    year: "2003-2005",
    title: "Assistante Contrôle de Gestion et RH (ISIS-MPP)",
    details: [
      "Suivi des coûts et des statistiques commerciales.",
      "Gestion des effectifs et coordination RH."
    ]
  }
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
      title="Qui suis-je ? | Maria-Lena Pietri"
      description="Découvrez mon parcours et mes compétences en tant qu'assistante administrative freelance"
    >
      <div className="bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="bg-primary text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn>
              <h1 className="text-4xl font-bold mb-6">Qui suis-je ?</h1>
              <p className="text-xl text-white/90">
                Professionnelle polyvalente avec une expérience riche dans l’assistanat, la gestion administrative, et la gestion de projets numériques.
              </p>
              <p className="text-xl text-white/90">
                Valeurs : rigueur, adaptabilité, sens de la confidentialité, et communication fluide.
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
                <h2 className="text-3xl font-bold text-dark">Maria-Lena Pietri</h2>
                <p className="text-xl text-gray-600">
                  Assistante Administrative Freelance
                </p>
                <div className="prose prose-lg text-gray-600">
                  <ul className="mb-8">
                    <li>Plus de 20 ans d'expérience en gestion administrative et projets divers.</li>
                    <li>Maîtrise des outils bureautiques avancés (Excel, Word, Sage, WordPress, Prestashop).</li>
                    <li>Expérience multisectorielle (BTP, immobilier, aéronautique, agroalimentaire, etc.).</li>
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
              <p className="mb-8">
                Au fil des années, j'ai construit un parcours professionnel riche et polyvalent, combinant des expériences dans des domaines variés tels que l’assistanat, le contrôle de gestion, le commerce, et la gestion de projets numériques. Chaque étape m’a permis de développer des compétences clés et d’acquérir une expertise adaptée aux besoins de mes clients, tout en cultivant mes valeurs de rigueur, d’adaptabilité et de confidentialité.
              </p>
              <StaggerChildren>
                <div className="grid gap-8 max-w-3xl mx-auto">
                  {experiences.map((experience, index) => (
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
                            <ul>
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
                  {[
                    {
                      year: "2022/2023",
                      title: "Gestionnaire de patrimoine",
                      details: ["Juriscampus, Toulouse (Bac +3/4)"]
                    },
                    {
                      year: "2003/2005",
                      title: "Master 2 - options Banques et marchés financiers",
                      details: ["ESC Toulouse"]
                    },
                    {
                      year: "Juil./Sept. 2023",
                      title: "Formation Cybersécurité",
                      details: ["Aelion"]
                    },
                    {
                      year: "2002/2003",
                      title: "Licence d'informatique",
                      details: ["Université Paul Sabatier, Toulouse"]
                    }
                  ].map((formation, index) => (
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
                {[{
                  title: "IA et Automatisation",
                  description: "Zapier, n8n, automatisation de processus"
                },
                {
                  title: "Gestion Administrative",
                  description: "Organisation, plannings, conformité"
                },
                {
                  title: "Contrôle de gestion et Finances",
                  description: "Trésorerie, analyse de coûts, reporting"
                },
                {
                  title: "Assistance Juridique",
                  description: "Contrats, RGPD, procédures judiciaires"
                },
                {
                  title: "Marketing Digital",
                  description: "WordPress, Magento, réseaux sociaux"
                },
                {
                  title: "Gestion Relationnelle",
                  description: "Clients, fournisseurs, équipes"
                },
                {
                  title: "Cybersécurité",
                  description: "Analyse de risques, actions correctives"
                },
                {
                  title: "Ressources Humaines",
                  description: "Recrutement, onboarding, suivi administratif"
                },
                {
                  title: "Commerce et Vente",
                  description: "Analyse du besoin, suivi clients, gestion des contrats"
                },
                {
                  title: "Gestion de Projets",
                  description: "Méthodologie Agile, coordination, outils"
                },
                {
                  title: "Outils bureautique",
                  description: "Excel (TCD, Macro), Notion, Canva, ERP, CRM"
                },
                {
                  title: "Langues",
                  description: "Anglais B2, Espagnol B1"
                }
                ].map((skill, index) => (
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
