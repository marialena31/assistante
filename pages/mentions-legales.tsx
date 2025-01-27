import Layout from '../components/layout/Layout';
import FadeIn from '../components/animations/FadeIn';
import mentionsLegalesContent from '../content/pages/mentions-legales.json';

export default function MentionsLegales() {
  return (
    <Layout
      title="Mentions Légales | Maria-Lena Pietri"
      description="Mentions légales et informations juridiques concernant le site web de Maria-Lena Pietri, assistante administrative freelance."
    >
      <div className="bg-gradient-to-b from-white to-gray-50/50">
        <div className="container py-16 lg:py-24">
          <FadeIn>
            <h1 className="h1 text-gradient mb-12">{mentionsLegalesContent.title}</h1>

            <div className="prose prose-lg max-w-none">
              {mentionsLegalesContent.sections.map((section, index) => (
                <section key={index} className="mb-12">
                  <h2 className="text-2xl font-bold text-dark mb-6">{section.title}</h2>
                  {section.content && <p>{section.content}</p>}
                  
                  {section.items && (
                    <ul className="list-none space-y-2">
                      {section.items.map((item, idx) => (
                        <li key={idx}>
                          <strong>{item.label}:</strong>{' '}
                          {item.isLink ? (
                            <a href={`https://${item.value}`} className="text-primary hover:text-primary-dark">
                              {item.value}
                            </a>
                          ) : (
                            item.value
                          )}
                        </li>
                      ))}
                    </ul>
                  )}

                  {section.paragraphs && section.paragraphs.map((paragraph, pIdx) => (
                    <p key={pIdx}>{paragraph}</p>
                  ))}

                  {section.subsections && section.subsections.map((subsection, subIdx) => (
                    <div key={subIdx}>
                      <h3 className="text-xl font-bold text-dark mt-6 mb-4">{subsection.title}</h3>
                      {subsection.content && <p>{subsection.content}</p>}
                      {subsection.contact && <p>{subsection.contact}</p>}
                    </div>
                  ))}
                </section>
              ))}
              <p className="mt-6 text-sm text-gray-600">Ces mentions légales ont été mises à jour le {mentionsLegalesContent.lastUpdate}.</p>
            </div>
          </FadeIn>
        </div>
      </div>
    </Layout>
  );
}
