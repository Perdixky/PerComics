import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ImageLoaderProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: string; // e.g., "aspect-[2/3]"
  priority?: boolean;
}

export const ImageLoader: React.FC<ImageLoaderProps> = ({ 
  src, 
  alt, 
  className = "", 
  aspectRatio = "aspect-[2/3]",
  priority = false 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority); // If priority, load immediately
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (priority) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '50% 0px', // Start loading when image is 50% viewport height away
        threshold: 0.01
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [priority]);

  return (
    <div 
      ref={containerRef}
      className={`relative overflow-hidden bg-zinc-900 ${aspectRatio} ${className}`}
    >
      <AnimatePresence>
        {!isLoaded && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 z-10 bg-zinc-800"
          >
             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-zinc-700/30 to-transparent w-full h-full animate-shimmer" style={{ transform: 'skewX(-20deg)' }} />
             {/* Loading Indicator */}
             <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
             </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {isInView && (
        <motion.img
          src={src}
          alt={alt}
          initial={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
          animate={{ 
            opacity: isLoaded ? 1 : 0,
            scale: isLoaded ? 1 : 1.1,
            filter: isLoaded ? 'blur(0px)' : 'blur(10px)'
          }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          onLoad={() => setIsLoaded(true)}
          className={`w-full h-full object-cover block`}
        />
      )}
      
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-150%) skewX(-20deg); }
          100% { transform: translateX(150%) skewX(-20deg); }
        }
        .animate-shimmer {
          animation: shimmer 1.5s infinite;
        }
      `}</style>
    </div>
  );
};