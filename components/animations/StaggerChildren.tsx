import { motion } from 'framer-motion';
import { HTMLMotionProps } from 'framer-motion';
import { ReactNode } from 'react';

interface StaggerChildrenProps {
  children: ReactNode;
  delay?: number;
  staggerDelay?: number;
  className?: string;
}

interface StaggerItemProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  className?: string;
}

export default function StaggerChildren({
  children,
  delay = 0,
  staggerDelay = 0.1,
  className = '',
}: StaggerChildrenProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      variants={{
        visible: {
          transition: {
            delayChildren: delay,
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export const StaggerItem: React.FC<StaggerItemProps> = ({ children, className, ...props }) => {
  return (
    <motion.div className={className} {...props}>
      {children}
    </motion.div>
  );
};
