import { motion } from 'framer-motion';

interface Language {
  name: string;
  level: string;
  percentage: number;
}

const languages: Language[] = [
  {
    name: 'Français',
    level: 'Natif',
    percentage: 100,
  },
  {
    name: 'Anglais',
    level: 'B2',
    percentage: 80,
  },
  {
    name: 'Espagnol',
    level: 'B1',
    percentage: 60,
  },
];

export default function LanguageSkills() {
  return (
    <div className="space-y-4">
      {languages.map((language, index) => (
        <div key={index} className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-700">{language.name}</span>
            <span className="text-sm text-gray-500">{language.level}</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${language.percentage}%` }}
              transition={{ duration: 1, delay: index * 0.2 }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
