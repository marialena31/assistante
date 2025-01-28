import Image from 'next/image';
import Layout from '../../components/layout/Layout';
import FadeIn from '../../components/animations/FadeIn';
import StaggerChildren, { StaggerItem } from '../../components/animations/StaggerChildren';
import AnimatedButton from '../../components/ui/AnimatedButton';
import tpeContent from '../../content/pages/secteurs/tpe.json';

export default function TPESector() {
  return (
    <Layout
      title="Services TPE, Commerçants et Artisans | Maria-Lena Pietri"
      description="Solutions administratives sur mesure pour TPE, commerçants et artisans. Simplifiez votre gestion quotidienne avec nos services adaptés."
    >
      {/* Hero Section */}
      <section className="section bg-gradient-to-b from-white to-gray-50/50">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <FadeIn direction="right">
              <div className="space-y-6">
                <h1 className="h1 text-gradient">
                  {tpeContent.hero.title}
                </h1>
                <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
                  {tpeContent.hero.description}
                </p>
              </div>
            </FadeIn>

            <FadeIn direction="left">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-primary/10 to-accent/10 shadow-strong">
                <Image
                   src={tpeContent.hero.image}
                   alt="Services pour TPE"
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

      {/* Introduction */}
      <section className="section bg-gray-50">
        <div className="container">
          <FadeIn>
            <h2 className="h2 text-center mb-12">{tpeContent.introduction.title}</h2>
          </FadeIn>

          <StaggerChildren>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {tpeContent.introduction.points.map((point, index) => (
                <StaggerItem key={index}>
                  <div className="card text-center h-full">
                    <h3 className="h3 mb-4">{point.title}</h3>
                    <p className="text-gray-600">{point.description}</p>
                  </div>
                </StaggerItem>
              ))}
            </div>
          </StaggerChildren>
        </div>
      </section>

      {/* Services */}
      <section className="section bg-white">
        <div className="container">
          <StaggerChildren>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {tpeContent.services.map((service, index) => (
                <StaggerItem key={index}>
                  <div className="card h-full">
                    <div className="flex items-start gap-6 mb-6">
                      <div className="text-4xl">{service.icon}</div>
                      <div>
                        <h3 className="h3 mb-2">{service.title}</h3>
                        <p className="text-gray-600">{service.description}</p>
                      </div>
                    </div>

                    <ul className="space-y-3">
                      {service.items.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-primary mt-1">✓</span>
                          <span className="text-gray-600">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </StaggerItem>
              ))}
            </div>
          </StaggerChildren>
        </div>
      </section>

      {/* Packages */}
      <section className="section bg-gray-50">
        <div className="container">
          <FadeIn>
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="h2 mb-6">{tpeContent.packages.title}</h2>
              <p className="text-lg text-gray-600">
                {tpeContent.packages.description}
              </p>
            </div>
          </FadeIn>

          <StaggerChildren>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {tpeContent.packages.items.map((pack, index) => (
                <StaggerItem key={index}>
                  <div className={`card h-full ${pack.highlight ? 'border-2 border-primary shadow-strong' : ''}`}>
                    <div className="text-center mb-8">
                      <h3 className="h3 mb-2">{pack.name}</h3>
                      <div className="text-3xl font-bold text-primary mb-2">
                        {pack.price}
                      </div>
                      <div className="text-gray-600 mb-4">{pack.period}</div>
                      <p className="text-gray-600">{pack.description}</p>
                    </div>

                    <ul className="space-y-4 mb-8">
                      {pack.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-primary mt-1">✓</span>
                          <span className="text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-auto">
                      <AnimatedButton
                        href="/contact"
                        variant={pack.highlight ? 'primary' : 'outline'}
                        className="w-full"
                      >
                        Choisir ce forfait
                      </AnimatedButton>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </div>
          </StaggerChildren>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section bg-white">
        <div className="container">
          <FadeIn>
            <h2 className="h2 text-center mb-12">{tpeContent.testimonials.title}</h2>
          </FadeIn>

          <StaggerChildren>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {tpeContent.testimonials.items.map((testimonial, index) => (
                <StaggerItem key={index}>
                  <div className="card">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="relative w-16 h-16 rounded-full overflow-hidden">
                        <Image
                          src={testimonial.image}
                          alt={testimonial.author}
                          width={64}
                          height={64}
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-medium">{testimonial.author}</h4>
                        <p className="text-gray-600">{testimonial.position}</p>
                      </div>
                    </div>
                    <blockquote className="text-gray-600 italic">
                      "{testimonial.quote}"
                    </blockquote>
                  </div>
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
              {tpeContent.callToAction.title}
            </h2>
            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
              {tpeContent.callToAction.description}
            </p>
            <AnimatedButton href={tpeContent.callToAction.buttonLink} variant="primary">
              {tpeContent.callToAction.buttonText}
            </AnimatedButton>
          </div>
        </div>
      </section>
    </Layout>
  );
}
