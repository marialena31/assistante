import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-dark text-white">
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gradient">Maria-Lena Pietri</h3>
            <p className="text-gray-300 leading-relaxed">
              Assistante administrative freelance
              <br />
              Simplifiez votre quotidien administratif
            </p>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Navigation</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white transition-all">
                  Accueil
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-gray-300 hover:text-white transition-all">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white transition-all">
                  À propos
                </Link>
              </li>
              <li>
                <Link href="/tarifs" className="text-gray-300 hover:text-white transition-all">
                  Tarifs
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white transition-all">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Contact</h3>
            <ul className="space-y-3 text-gray-300">
              <li>
                <a href="mailto:contact@marialena-pietri.fr" className="hover:text-white transition-all">
                  contact@marialena-pietri.fr
                </a>
              </li>
              <li>
                <a href="tel:+33600000000" className="hover:text-white transition-all">
                  +33 6 00 00 00 00
                </a>
              </li>
              <li>Basée à Ajaccio, Corse</li>
              <li>Disponible en télétravail</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              {new Date().getFullYear()} Maria-Lena Pietri. Tous droits réservés.
            </p>
            <div className="flex gap-6">
              <Link href="/mentions-legales" className="text-gray-400 hover:text-white transition-all">
                Mentions légales
              </Link>
              <Link href="/confidentialite" className="text-gray-400 hover:text-white transition-all">
                Politique de confidentialité
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
