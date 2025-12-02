import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { ArrowLeft, ChevronLeft, ChevronRight, List, Settings, X, BookOpen } from 'lucide-react';
import { Comic, Chapter } from '../types';
import { ImageLoader } from '../components/ImageLoader';

interface ReaderViewProps {
  comic: Comic;
  chapter: Chapter;
  onBack: () => void;
  onNavigateChapter: (direction: 'next' | 'prev') => void;
  onSelectChapter: (chapter: Chapter) => void;
  hasPrev: boolean;
  hasNext: boolean;
}

export const ReaderView: React.FC<ReaderViewProps> = ({ 
  comic, 
  chapter, 
  onBack, 
  onNavigateChapter,
  onSelectChapter,
  hasPrev, 
  hasNext 
}) => {
  const [showHud, setShowHud] = useState(true);
  const [showChapterList, setShowChapterList] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const scrollTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-hide HUD logic
  useEffect(() => {
    const handleScroll = () => {
      // Don't auto-hide if sidebar is open
      if (showChapterList) return;

      const currentScrollY = window.scrollY;
      
      // Show HUD if scrolling up significantly or at top
      if (currentScrollY < 50) {
        setShowHud(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down
        setShowHud(false);
      } else if (lastScrollY - currentScrollY > 50) {
        // Scrolling up
        setShowHud(true);
      }

      setLastScrollY(currentScrollY);

      // Reset timer to hide after inactivity
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
      scrollTimeout.current = setTimeout(() => {
        if (currentScrollY > 100 && !showChapterList) setShowHud(false);
      }, 3000);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    };
  }, [lastScrollY, showChapterList]);

  // Reset scroll on chapter change
  useEffect(() => {
    window.scrollTo(0, 0);
    setShowHud(true);
    setShowChapterList(false);
  }, [chapter.id]);

  return (
    <div className="min-h-screen bg-[#121212] relative">
      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-indigo-500 origin-left z-50"
        style={{ scaleX }}
      />

      {/* Header HUD */}
      <AnimatePresence>
        {showHud && (
          <motion.header
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 inset-x-0 z-40 bg-black/80 backdrop-blur-md border-b border-white/5 px-4 h-16 flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <ArrowLeft className="text-zinc-200" size={24} />
              </button>
              <div className="flex flex-col">
                <span className="text-white font-medium text-sm md:text-base line-clamp-1">{comic.title}</span>
                <span className="text-zinc-400 text-xs">{chapter.title}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setShowChapterList(true)}
                className="p-2 hover:bg-white/10 rounded-full text-zinc-400 hover:text-white transition-colors"
                title="Chapter List"
              >
                <List size={20} />
              </button>
              <button className="p-2 hover:bg-white/10 rounded-full text-zinc-400 hover:text-white transition-colors">
                <Settings size={20} />
              </button>
            </div>
          </motion.header>
        )}
      </AnimatePresence>

      {/* Main Content: The Pages */}
      <div 
        className="max-w-2xl mx-auto min-h-screen pb-32"
        onClick={() => {
           if (!showChapterList) setShowHud(!showHud);
        }}
      >
        <div className="flex flex-col">
          {chapter.pages.map((page, index) => (
            <div key={page.id} className="w-full relative">
              <ImageLoader
                src={page.url}
                alt={`Page ${page.pageNumber}`}
                aspectRatio="aspect-[2/3]" // Assuming portrait pages mostly
                priority={true} // Load all pages immediately
                className="w-full shadow-2xl bg-zinc-950"
              />
              <div className="absolute right-2 top-2 bg-black/50 backdrop-blur px-2 py-0.5 rounded text-[10px] text-zinc-400 opacity-50 hover:opacity-100 transition-opacity">
                {page.pageNumber}
              </div>
            </div>
          ))}
        </div>

        {/* Chapter Navigation Footer Area (Inline) */}
        <div className="px-4 py-12 space-y-6">
          <div className="flex justify-between items-center gap-4">
             <button
                onClick={(e) => { e.stopPropagation(); if(hasPrev) onNavigateChapter('prev'); }}
                disabled={!hasPrev}
                className={`flex-1 py-4 rounded-xl flex items-center justify-center gap-2 transition-all ${
                  hasPrev 
                    ? 'bg-zinc-800 hover:bg-zinc-700 text-white shadow-lg' 
                    : 'bg-zinc-900/50 text-zinc-600 cursor-not-allowed'
                }`}
             >
               <ChevronLeft size={20} /> Previous
             </button>
             
             <button
                onClick={(e) => { e.stopPropagation(); if(hasNext) onNavigateChapter('next'); }}
                disabled={!hasNext}
                className={`flex-1 py-4 rounded-xl flex items-center justify-center gap-2 transition-all ${
                  hasNext
                    ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-900/20' 
                    : 'bg-zinc-900/50 text-zinc-600 cursor-not-allowed'
                }`}
             >
               Next Chapter <ChevronRight size={20} />
             </button>
          </div>
          <p className="text-center text-zinc-600 text-sm">
             End of {chapter.title}
          </p>
        </div>
      </div>

      {/* Sticky Bottom Navigation (Visible when HUD is active) */}
       <AnimatePresence>
        {showHud && !showChapterList && (
          <motion.div
             initial={{ y: 100 }}
             animate={{ y: 0 }}
             exit={{ y: 100 }}
             transition={{ type: "spring", stiffness: 300, damping: 30 }}
             className="fixed bottom-0 inset-x-0 z-40 bg-black/80 backdrop-blur-md border-t border-white/5 py-4 px-6 flex justify-between items-center"
          >
             {/* Previous Chapter Button */}
             <button 
                onClick={(e) => { e.stopPropagation(); if(hasPrev) onNavigateChapter('prev'); }} 
                disabled={!hasPrev} 
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                    hasPrev ? 'hover:bg-white/10 text-white' : 'text-zinc-600 cursor-not-allowed'
                }`}
             >
                <ChevronLeft size={20} />
                <span className="hidden md:inline text-sm font-medium">Prev</span>
             </button>

             {/* Center Info */}
             <div className="flex flex-col items-center flex-1 mx-4">
                <span className="text-xs text-zinc-500 uppercase tracking-wider">Current</span>
                <span className="text-sm font-bold text-zinc-200 truncate max-w-[150px] md:max-w-xs">{chapter.title}</span>
             </div>

             {/* Next Chapter Button */}
             <button 
                onClick={(e) => { e.stopPropagation(); if(hasNext) onNavigateChapter('next'); }} 
                disabled={!hasNext} 
                className={`flex items-center gap-2 px-6 py-2 rounded-full transition-all ${
                    hasNext ? 'bg-white text-black hover:bg-zinc-200' : 'text-zinc-600 cursor-not-allowed'
                }`}
             >
                <span className="text-sm font-bold">Next</span>
                <ChevronRight size={20} />
             </button>
          </motion.div>
        )}
       </AnimatePresence>

       {/* Chapter List Sidebar */}
       <AnimatePresence>
         {showChapterList && (
           <>
             {/* Backdrop */}
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setShowChapterList(false)}
               className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
             />
             
             {/* Sidebar */}
             <motion.div
               initial={{ x: '100%' }}
               animate={{ x: 0 }}
               exit={{ x: '100%' }}
               transition={{ type: "spring", stiffness: 300, damping: 30 }}
               className="fixed inset-y-0 right-0 w-80 max-w-[80vw] bg-zinc-900/95 backdrop-blur-xl border-l border-white/10 z-50 flex flex-col shadow-2xl"
             >
               <div className="flex items-center justify-between p-4 border-b border-white/10">
                 <div className="flex items-center gap-2 text-white font-bold">
                   <BookOpen size={20} className="text-indigo-500" />
                   <span>Chapters</span>
                 </div>
                 <button 
                   onClick={() => setShowChapterList(false)}
                   className="p-2 hover:bg-white/10 rounded-full text-zinc-400 transition-colors"
                 >
                   <X size={20} />
                 </button>
               </div>

               <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
                 {comic.chapters.map((ch) => {
                   const isActive = ch.id === chapter.id;
                   return (
                     <button
                       key={ch.id}
                       onClick={() => onSelectChapter(ch)}
                       className={`w-full text-left p-3 rounded-lg transition-all border ${
                         isActive 
                           ? 'bg-indigo-500/20 border-indigo-500/50 text-white' 
                           : 'hover:bg-white/5 border-transparent text-zinc-400 hover:text-zinc-200'
                       }`}
                     >
                       <div className="flex items-center justify-between">
                         <span className={`font-medium ${isActive ? 'text-indigo-300' : ''}`}>{ch.title}</span>
                         {isActive && <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />}
                       </div>
                       <div className="text-xs opacity-60 mt-1">
                         /{ch.number.toString().padStart(3, '0')} • {ch.pages.length} pages
                       </div>
                     </button>
                   );
                 })}
               </div>
             </motion.div>
           </>
         )}
       </AnimatePresence>
    </div>
  );
};