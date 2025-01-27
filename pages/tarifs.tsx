import Layout from '../components/layout/Layout';
import FadeIn from '../components/animations/FadeIn';
import { motion } from 'framer-motion';
import StaggerChildren, { StaggerItem } from '../components/animations/StaggerChildren';
import tarifsContent from '../content/pages/tarifs.json';
import Link from 'next/link';

export default function Tarifs() {
  return (
    <Layout>
      <div className="bg-gradient-to-b from-white to-gray-50 min-h-screen">
        {/* Header */}
        <div className="container py-16 text-center">
          <FadeIn>
            <h1 className="text-4xl font-bold mb-4">{tarifsContent.title}</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {tarifsContent.subtitle}
            </p>
          </FadeIn>
        </div>

        {/* Pricing Cards */}
        <div className="container pb-16">
          <StaggerChildren>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {tarifsContent.packages.map((pkg, index) => (
                <StaggerItem key={index}>
                  <motion.div
                    className={`bg-white rounded-xl shadow-lg overflow-hidden ${
                      pkg.popular ? 'ring-2 ring-accent' : ''
                    }`}
                    whileHover={{ scale: 1.03 }}
                    transition={{ duration: 0.2 }}
                  >
                    {pkg.popular && (
                      <div className="bg-accent text-white text-center py-2">
                        <span className="text-sm font-medium">Le plus populaire</span>
                      </div>
                    )}
                    <div className="p-6">
                      <h3 className="text-2xl font-bold text-dark mb-4">{pkg.name}</h3>
                      <div className="mb-4">
                        <span className="text-4xl font-bold text-primary">{pkg.price}</span>
                        <span className="text-gray-600 ml-2">{pkg.unit}</span>
                      </div>
                      <p className="text-gray-600 mb-6">{pkg.description}</p>
                      <ul className="space-y-3 mb-8">
                        {pkg.features.map((feature, fIndex) => (
                          <li key={fIndex} className="flex items-start">
                            <span className="text-accent mr-2">✓</span>
                            <span className="text-gray-600">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <Link
                        href="/contact"
                        className="block w-full text-center bg-primary text-white hover:bg-primary-dark py-3 rounded-lg transition-colors"
                      >
                        Me contacter
                      </Link>
                    </div>
                  </motion.div>
                </StaggerItem>
              ))}
            </div>
          </StaggerChildren>
        </div>

        {/* Travel Expenses Section */}
        <section className="section bg-gray-50">
          <div className="container">
            <FadeIn>
              <div className="text-center max-w-3xl mx-auto mb-16">
                <h2 className="h2 mb-6">{tarifsContent.travelExpenses.title}</h2>
                <p className="text-lg text-gray-600">
                  {tarifsContent.travelExpenses.description}
                </p>
              </div>
            </FadeIn>

            <StaggerChildren>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                {tarifsContent.travelExpenses.categories.map((category, index) => (
                  <StaggerItem key={index}>
                    <div className="card h-full">
                      <div className="flex items-start gap-4 mb-6">
                        <div className="text-4xl">{category.icon}</div>
                        <div>
                          <h3 className="h3 mb-2">{category.title}</h3>
                          <p className="text-gray-600">{category.description}</p>
                        </div>
                      </div>

                      {category.details && (
                        <ul className="space-y-3 mt-4">
                          {category.details.map((detail, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-primary mt-1">•</span>
                              <span className="text-gray-600">{detail}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </StaggerItem>
                ))}
              </div>
            </StaggerChildren>

            {/* Example Calculation Box */}
            <FadeIn>
              <div className="max-w-2xl mx-auto">
                <div className="card bg-primary/5 border-2 border-primary/20">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="text-3xl">🧮</div>
                    <h4 className="h4 text-primary">
                      {tarifsContent.travelExpenses.example.title}
                    </h4>
                  </div>
                  <p className="text-gray-700 text-lg">
                    {tarifsContent.travelExpenses.example.description}
                  </p>
                </div>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* Custom Package Section */}
        <div className="bg-accent text-white py-16">
          <div className="container text-center">
            <FadeIn>
              <h2 className="text-3xl font-bold mb-4">
                {tarifsContent.customPackage.title}
              </h2>
              <p className="text-xl mb-2">
                {tarifsContent.customPackage.description}
              </p>
              <p className="text-lg mb-8">
                {tarifsContent.customPackage.subtitle}
              </p>
              <motion.a
                href="/contact"
                className="inline-block bg-white text-accent hover:bg-gray-100 px-8 py-4 rounded-lg font-medium transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {tarifsContent.customPackage.buttonText}
              </motion.a>
            </FadeIn>
          </div>
        </div>
      </div>
    </Layout>
  );
}
