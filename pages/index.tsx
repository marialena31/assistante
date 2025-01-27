import Image from 'next/image';
import { motion } from 'framer-motion';
import Layout from '../components/layout/Layout';
import FadeIn from '../components/animations/FadeIn';
import StaggerChildren, { StaggerItem } from '../components/animations/StaggerChildren';
import Counter from '../components/animations/Counter';
import AnimatedButton from '../components/ui/AnimatedButton';
import indexContent from '../content/pages/index.json';

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
                  {indexContent.hero.title}
                </h1>
                <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
                  {indexContent.hero.description}
                </p>
                <div className="flex flex-wrap gap-4 pt-4">
                  <AnimatedButton href={indexContent.hero.buttons.primary.link} variant="primary">
                    {indexContent.hero.buttons.primary.text}
                  </AnimatedButton>
                  <AnimatedButton href={indexContent.hero.buttons.secondary.link} variant="outline">
                    {indexContent.hero.buttons.secondary.text}
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
                {indexContent.services.title}
              </h2>
              <p className="text-lg text-gray-600">
                {indexContent.services.subtitle}
              </p>
            </div>
          </FadeIn>

          <StaggerChildren>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {indexContent.services.items.map((service, index) => (
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
            {indexContent.stats.map((stat, index) => (
              <FadeIn key={index} delay={index * 0.1}>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold mb-2">
                    <Counter end={stat.number} duration={2} />
                    {stat.suffix}
                  </div>
                  <div className="text-white/90 text-sm md:text-base">{stat.label}</div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      {indexContent.pricing && (
        <section className="section bg-white">
          <div className="container">
            <FadeIn>
              <div className="text-center max-w-3xl mx-auto mb-16">
                <h2 className="h2 mb-6">{indexContent.pricing.title}</h2>
                <p className="text-lg text-gray-600">{indexContent.pricing.description}</p>
              </div>
            </FadeIn>

            <StaggerChildren>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {indexContent.pricing.highlights.map((plan, index) => (
                  <StaggerItem key={index}>
                    <div className="card card-hover h-full text-center p-8">
                      <h3 className="h3 mb-4">{plan.name}</h3>
                      <div className="text-3xl font-bold text-primary mb-2">{plan.price}</div>
                      <div className="text-gray-600 mb-6">{plan.unit}</div>
                      <p className="text-gray-600 mb-8">{plan.description}</p>
                      <AnimatedButton href="/tarifs" variant="outline" className="w-full">
                        {indexContent.pricing.buttonText}
                      </AnimatedButton>
                    </div>
                  </StaggerItem>
                ))}
              </div>
            </StaggerChildren>
          </div>
        </section>
      )}

      {/* Call to Action */}
      <section className="section-sm bg-accent text-white">
        <div className="container">
          <div className="text-center">
            <h2 className="h2 mb-6 text-white">
              {indexContent.callToAction.title}
            </h2>
            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
              {indexContent.callToAction.description}
            </p>
            <AnimatedButton href={indexContent.callToAction.buttonLink} variant="white">
              {indexContent.callToAction.buttonText}
            </AnimatedButton>
          </div>
        </div>
      </section>
    </Layout>
  );
}
