import Link from 'next/link';
import footerContent from '../../content/components/footer.json';
import NewsletterForm from '../newsletter/NewsletterForm';
import NewsletterModal from '../newsletter/NewsletterModal';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="container py-8">
        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="flex flex-col items-center text-center md:items-start md:text-left">
            <Link href="/" className="mb-6">
              <h3 className="text-xl font-bold text-gradient">{footerContent.title}</h3>
            </Link>
            <nav className="mb-6">
              <ul className="flex flex-wrap justify-center md:justify-start gap-x-8 gap-y-2">
                {footerContent.navigation.links.map((link, index) => (
                  <li key={index}>
                    <Link
                      href={link.href}
                      className="text-gray-600 hover:text-primary transition-colors"
                    >
                      {link.text}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="text-gray-600">
              <p className="mb-2">{footerContent.subtitle}</p>
              <p className="mb-6">{footerContent.description}</p>
              <a
                href={`mailto:${footerContent.contact.items[0].text}`}
                className="text-primary hover:text-primary-dark transition-colors"
              >
                {footerContent.contact.items[0].text}
              </a>
            </div>
          </div>

          {/* Newsletter Section */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h4 className="text-lg font-semibold mb-4">Restez informé</h4>
            <p className="text-gray-600 mb-6">
              Inscrivez-vous à notre newsletter pour recevoir nos dernières actualités et offres exclusives.
            </p>
            <NewsletterForm />
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-100 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            {new Date().getFullYear()} {footerContent.legal.copyright}
          </p>
          <div className="flex gap-6">
            {footerContent.legal.links.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                {link.text}
              </Link>
            ))}
          </div>
        </div>
      </div>
      <NewsletterModal />
    </footer>
  );
}
