import { motion } from 'framer-motion';
import Link from 'next/link';

interface AnimatedButtonProps {
  href: string;
  className?: string;
  children: React.ReactNode;
  variant?: 'primary' | 'accent' | 'outline';
}

export default function AnimatedButton({
  href,
  className = '',
  children,
  variant = 'primary',
}: AnimatedButtonProps) {
  const baseClasses = 'inline-block px-6 py-3 rounded-md font-medium transition-colors';
  const variantClasses = {
    primary: 'bg-primary hover:bg-primary/90 text-white',
    accent: 'bg-accent hover:bg-accent/90 text-white',
    outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white',
  };

  return (
    <Link href={href} className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      <motion.span
        className="inline-block"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {children}
      </motion.span>
    </Link>
  );
}
