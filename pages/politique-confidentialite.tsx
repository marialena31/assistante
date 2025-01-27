import Layout from '../components/layout/Layout';
import FadeIn from '../components/animations/FadeIn';
import politiqueContent from '../content/pages/politique-confidentialite.json';

type ItemType = string | { label: string; value: string; } | { title: string; description: string; };

interface Section {
  title: string;
  content?: string;
  items?: ItemType[];
  subsections?: {
    title: string;
    items?: string[];
  }[];
  note?: string;
  contact?: string | {
    email: string;
    phone: string;
  };
}

export default function PolitiqueConfidentialite() {
  return (
    <Layout
      title="Politique de Confidentialité | Maria-Lena Pietri"
      description="Politique de confidentialité et informations sur la protection des données personnelles du site web de Maria-Lena Pietri."
    >
      <div className="bg-gradient-to-b from-white to-gray-50/50">
        <div className="container py-16 lg:py-24">
          <FadeIn>
            <h1 className="h1 text-gradient mb-12">{politiqueContent.title}</h1>
            <p className="text-sm text-gray-600 mb-8">Dernière mise à jour : {politiqueContent.lastUpdate}</p>

            <div className="prose prose-lg max-w-none">
              <p className="lead mb-12">
                {politiqueContent.introduction}
              </p>

              {politiqueContent.sections.map((section: Section, index) => (
                <section key={index} className="mb-12">
                  <h2 className="text-2xl font-bold text-dark mb-6">{section.title}</h2>
                  {section.content && <p>{section.content}</p>}

                  {section.items && section.items.length > 0 && (
                    <ul className={section.content ? "list-disc pl-6" : "list-none space-y-2"}>
                      {section.items.map((item, idx) => (
                        <li key={idx}>
                          {typeof item === 'string' ? (
                            item
                          ) : 'label' in item ? (
                            <>
                              <strong>{item.label}:</strong> {item.value}
                            </>
                          ) : (
                            <>
                              <strong>{item.title}:</strong> {item.description}
                            </>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}

                  {section.subsections && section.subsections.map((subsection, subIdx) => (
                    <div key={subIdx}>
                      <h3 className="text-xl font-bold text-dark mt-6 mb-4">{subsection.title}</h3>
                      {subsection.items && (
                        <ul className="list-disc pl-6 mb-6">
                          {subsection.items.map((item, itemIdx) => (
                            <li key={itemIdx}>{item}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}

                  {section.note && (
                    <p className="mt-4">{section.note}</p>
                  )}

                  {section.contact && (
                    <div className="mt-4">
                      {typeof section.contact === 'string' ? (
                        <p>{section.contact}</p>
                      ) : (
                        <ul className="list-none space-y-2 mt-4">
                          <li><strong>Email :</strong> {section.contact.email}</li>
                          <li><strong>Téléphone :</strong> {section.contact.phone}</li>
                        </ul>
                      )}
                    </div>
                  )}
                </section>
              ))}
            </div>
          </FadeIn>
        </div>
      </div>
    </Layout>
  );
}
