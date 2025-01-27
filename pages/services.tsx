import Layout from '../components/layout/Layout';
import FadeIn from '../components/animations/FadeIn';
import StaggerChildren, { StaggerItem } from '../components/animations/StaggerChildren';
import AnimatedButton from '../components/ui/AnimatedButton';
import servicesContent from '../content/pages/services.json';

export default function Services() {
  return (
    <Layout
      title="Services | Maria-Lena Pietri"
      description="Découvrez mes services d'assistance administrative adaptés à vos besoins professionnels"
    >
      {/* Hero Section */}
      <section className="section bg-gradient-to-b from-white to-gray-50/50">
        <div className="container">
          <FadeIn>
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="h1 text-gradient mb-6">
                {servicesContent.hero.title}
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mb-8">
                {servicesContent.hero.description}
              </p>
              <AnimatedButton href={servicesContent.hero.cta.link} variant="primary">
                {servicesContent.hero.cta.text}
              </AnimatedButton>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section bg-white">
        <div className="container">
          <StaggerChildren>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {servicesContent.services.map((service, index) => (
                <StaggerItem key={service.id}>
                  <div className={`card h-full ${service.highlight ? 'border-2 border-primary shadow-strong' : ''}`}>
                    {/* Service Header */}
                    <div className="flex items-start gap-6 mb-6">
                      <div className="text-4xl">{service.icon}</div>
                      <div>
                        <h3 className="h3 mb-2">{service.title}</h3>
                        <p className="text-primary font-medium">{service.subtitle}</p>
                      </div>
                    </div>

                    {/* Service Description */}
                    <p className="text-gray-600 mb-8">
                      {service.description}
                    </p>

                    {/* Service Items */}
                    <div className="space-y-6 mb-8">
                      {service.items.map((item, idx) => (
                        <div key={idx} className="flex gap-4">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-primary">✓</span>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 mb-1">
                              {item.title}
                            </h4>
                            <p className="text-gray-600 text-sm">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Service CTA */}
                    <div className="mt-auto">
                      <AnimatedButton
                        href={service.cta.link}
                        variant={service.highlight ? "primary" : "outline"}
                        className="w-full"
                      >
                        {service.cta.text}
                      </AnimatedButton>
                    </div>
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
              {servicesContent.callToAction.title}
            </h2>
            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
              {servicesContent.callToAction.description}
            </p>
            <AnimatedButton href={servicesContent.callToAction.buttonLink} variant="white">
              {servicesContent.callToAction.buttonText}
            </AnimatedButton>
          </div>
        </div>
      </section>
    </Layout>
  );
}
