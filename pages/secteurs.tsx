import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '../components/layout/Layout';
import FadeIn from '../components/animations/FadeIn';
import StaggerChildren, { StaggerItem } from '../components/animations/StaggerChildren';
import AnimatedButton from '../components/ui/AnimatedButton';
import secteursContent from '../content/pages/secteurs.json';

type Package = {
  name: string;
  hours: number;
  price: string;
  unit: string;
  description: string;
};

type Sector = {
  id: string;
  icon: string;
  title: string;
  description: string;
  services: string[];
  packages: Package[];
};

type SectorProps = {
  sector: Sector;
  isExpanded: boolean;
  onToggle: () => void;
};

const SectorCard = ({ sector, isExpanded, onToggle }: SectorProps) => {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-soft hover:shadow-strong transition-shadow">
      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full p-6 flex items-center justify-between hover:bg-gray-50/50 transition-colors"
      >
        <div className="flex items-center gap-6">
          <div className="text-4xl">{sector.icon}</div>
          <div className="text-left">
            <h2 className="h3 mb-2">{sector.title}</h2>
            <p className="text-gray-600 line-clamp-2">{sector.description}</p>
          </div>
        </div>
        <motion.div 
          className="text-2xl text-gray-400"
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          ↓
        </motion.div>
      </button>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-gray-100"
          >
            <div className="p-6">
              {/* Services */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">Services proposés</h3>
                <ul className="grid gap-3 md:grid-cols-2">
                  {sector.services.map((service, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="text-primary mt-1">✓</span>
                      <span className="text-gray-600">{service}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Packages */}
              <div>
                <h3 className="text-xl font-semibold mb-4">Forfaits disponibles</h3>
                <div className="grid gap-6 md:grid-cols-3">
                  {sector.packages.map((pkg, index) => (
                    <div 
                      key={index} 
                      className="bg-gray-50 rounded-lg p-6 border border-gray-100"
                    >
                      <h4 className="text-lg font-semibold mb-3">{pkg.name}</h4>
                      <div className="text-2xl font-bold text-primary mb-2">
                        {pkg.price}
                      </div>
                      <div className="text-gray-600 mb-1">{pkg.unit}</div>
                      <div className="text-sm text-gray-600 mb-2">
                        {pkg.hours} heures par mois
                      </div>
                      <p className="text-sm text-gray-600 mb-6">
                        {pkg.description}
                      </p>
                      <AnimatedButton 
                        href="/contact" 
                        variant="outline" 
                        className="w-full"
                      >
                        Demander un devis
                      </AnimatedButton>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function Secteurs() {
  const [expandedSector, setExpandedSector] = useState<string | null>(null);

  const toggleSector = (sectorId: string) => {
    setExpandedSector(expandedSector === sectorId ? null : sectorId);
  };

  return (
    <Layout
      title="Offres par Secteurs | Maria-Lena Pietri"
      description="Découvrez mes offres d'assistance administrative personnalisées par secteur d'activité : juridique, BTP, immobilier, et technologie."
    >
      {/* Hero Section */}
      <section className="section relative bg-gradient-to-b from-white to-gray-50/50">
        <div className="container">
          <FadeIn>
            <h1 className="h1 text-gradient text-center mb-8">
              {secteursContent.title}
            </h1>
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed text-center max-w-4xl mx-auto">
              {secteursContent.introduction}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Sectors Section */}
      <section className="section bg-gray-50/50">
        <div className="container">
          <StaggerChildren>
            <div className="space-y-6">
              {secteursContent.sectors.map((sector: Sector) => (
                <StaggerItem key={sector.id}>
                  <SectorCard
                    sector={sector}
                    isExpanded={expandedSector === sector.id}
                    onToggle={() => toggleSector(sector.id)}
                  />
                </StaggerItem>
              ))}
            </div>
          </StaggerChildren>
        </div>
      </section>

      {/* Call to Action */}
      <section className="section-sm bg-accent text-white">
        <div className="container">
          <div className="text-center">
            <h2 className="h2 mb-6 text-white">
              Besoin d'une offre personnalisée ?
            </h2>
            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
              Contactez-moi pour discuter de vos besoins spécifiques et obtenir une proposition sur mesure.
            </p>
            <AnimatedButton 
              href="/contact" 
              variant="outline"
              className="bg-white text-accent hover:bg-white/90"
            >
              Me contacter
            </AnimatedButton>
          </div>
        </div>
      </section>
    </Layout>
  );
}
