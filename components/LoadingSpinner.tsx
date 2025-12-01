import React from 'react';
import { motion } from 'framer-motion';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="relative w-16 h-16">
        <motion.span
          className="absolute block w-16 h-16 border-4 border-t-indigo-500 border-r-transparent border-b-indigo-500 border-l-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
        <motion.span
          className="absolute top-2 left-2 block w-12 h-12 border-4 border-t-purple-500 border-r-transparent border-b-purple-500 border-l-transparent rounded-full"
          animate={{ rotate: -360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
      </div>
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
        className="text-zinc-400 text-sm font-medium tracking-widest uppercase"
      >
        Loading Assets
      </motion.p>
    </div>
  );
};