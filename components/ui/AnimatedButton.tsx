import { motion } from 'framer-motion';
import Link from 'next/link';

interface AnimatedButtonProps {
  href: string;
  className?: string;
  children: React.ReactNode;
  variant?: 'primary' | 'accent' | 'outline' | 'white';
}

export default function AnimatedButton({
  href,
  className = '',
  children,
  variant = 'primary',
}: AnimatedButtonProps) {
  const buttonClass = `btn ${
    variant === 'primary' ? 'btn-primary' : 
    variant === 'accent' ? 'btn-accent' : 
    variant === 'white' ? 'btn-white' :
    'btn-outline'
  } ${className}`;

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="inline-block"
    >
      <Link href={href} className={buttonClass}>
        {children}
      </Link>
    </motion.div>
  );
}
