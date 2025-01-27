import Layout from '../components/layout/Layout';
import FadeIn from '../components/animations/FadeIn';
import StaggerChildren, { StaggerItem } from '../components/animations/StaggerChildren';
import AnimatedButton from '../components/ui/AnimatedButton';
import faqContent from '../content/pages/faq.json';

export default function FAQ() {
  return (
    <Layout
      title="FAQ | Maria-Lena Pietri"
      description="Retrouvez les réponses à vos questions sur mes services d'assistance administrative"
    >
      {/* Hero Section */}
      <section className="section bg-gradient-to-b from-white to-gray-50/50">
        <div className="container">
          <FadeIn>
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="h1 text-gradient mb-6">
                {faqContent.hero.title}
              </h1>
              <p className="text-lg md:text-xl text-gray-600">
                {faqContent.hero.description}
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* FAQ Categories */}
      <section className="section bg-white">
        <div className="container">
          <StaggerChildren>
            <div className="grid grid-cols-1 gap-16">
              {faqContent.categories.map((category, index) => (
                <StaggerItem key={index}>
                  <div className="max-w-4xl mx-auto">
                    {/* Category Header */}
                    <div className="flex items-center gap-4 mb-8">
                      <div className="text-4xl">{category.icon}</div>
                      <h2 className="h2">{category.title}</h2>
                    </div>

                    {/* Questions */}
                    <div className="space-y-6">
                      {category.questions.map((item, idx) => (
                        <div key={idx} className="card">
                          <h3 className="h4 text-primary mb-4">
                            {item.question}
                          </h3>
                          <p className="text-gray-600">
                            {item.answer}
                          </p>
                        </div>
                      ))}
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
              {faqContent.callToAction.title}
            </h2>
            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
              {faqContent.callToAction.description}
            </p>
            <AnimatedButton 
              href={faqContent.callToAction.buttonLink} 
              variant="white"
            >
              {faqContent.callToAction.buttonText}
            </AnimatedButton>
          </div>
        </div>
      </section>
    </Layout>
  );
}
