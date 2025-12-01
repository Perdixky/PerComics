import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MOCK_COMICS } from './constants';
import { Comic, Chapter, ViewState } from './types';
import { LibraryView } from './views/LibraryView';
import { DetailView } from './views/DetailView';
import { ReaderView } from './views/ReaderView';
import { LoadingSpinner } from './components/LoadingSpinner';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('library');
  const [comics, setComics] = useState<Comic[]>([]);
  const [selectedComic, setSelectedComic] = useState<Comic | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load Data (Real Manifest or Mock)
  useEffect(() => {
    const loadData = async () => {
      try {
        // Try to fetch the generated manifest file
        const response = await fetch('/manifest.json');
        if (!response.ok) throw new Error('No manifest found');
        
        const data = await response.json();
        setComics(data);
        // Preload images for better UX
        const preloadImage = new Image();
        if(data.length > 0) preloadImage.src = data[0].coverUrl;
      } catch (error) {
        console.log("Running in Demo Mode (No manifest.json found)");
        // Fallback to mock data
        setComics(MOCK_COMICS);
      } finally {
        // Add a small artificial delay for the loading animation to be appreciated
        setTimeout(() => {
          setIsLoading(false);
        }, 1500);
      }
    };

    loadData();
  }, []);

  const handleSelectComic = (comic: Comic) => {
    setSelectedComic(comic);
    setView('details');
  };

  const handleBackToLibrary = () => {
    setView('library');
    setTimeout(() => setSelectedComic(null), 300); // Clear after transition
  };

  const handleSelectChapter = (chapter: Chapter) => {
    setSelectedChapter(chapter);
    setView('reader');
  };

  const handleBackToDetails = () => {
    setView('details');
  };

  const handleNavigateChapter = (direction: 'next' | 'prev') => {
    if (!selectedComic || !selectedChapter) return;

    // Find index in the comic's chapter list
    const currentIndex = selectedComic.chapters.findIndex(c => c.id === selectedChapter.id);
    
    // Calculate target index
    const targetIndex = direction === 'next' ? currentIndex - 1 : currentIndex + 1;

    // Check bounds
    if (targetIndex >= 0 && targetIndex < selectedComic.chapters.length) {
      setSelectedChapter(selectedComic.chapters[targetIndex]);
    }
  };

  // Determine if nav is possible
  const canGoNext = () => {
    if (!selectedComic || !selectedChapter) return false;
    const currentIndex = selectedComic.chapters.findIndex(c => c.id === selectedChapter.id);
    // Because chapters are usually ordered Newest -> Oldest (Reverse),
    // "Next Chapter" (e.g. Ch 2) is actually a LOWER index than "Current" (e.g. Ch 1) if sorted Descending.
    // However, if your manifest sorts them Ascending (Ch 1, Ch 2...), logic flips.
    // Assuming Standard Manga Site Logic: List is usually Descending (Latest first).
    // So Next Chapter (Logic + 1) is Index - 1.
    return currentIndex > 0; 
  };

  const canGoPrev = () => {
    if (!selectedComic || !selectedChapter) return false;
    const currentIndex = selectedComic.chapters.findIndex(c => c.id === selectedChapter.id);
    return currentIndex < selectedComic.chapters.length - 1;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="bg-black text-white min-h-screen font-sans selection:bg-indigo-500/30">
      <AnimatePresence mode="wait">
        {view === 'library' && (
          <motion.div
            key="library"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
            transition={{ duration: 0.3 }}
          >
            <LibraryView 
              comics={comics} 
              onSelectComic={handleSelectComic} 
            />
          </motion.div>
        )}

        {view === 'details' && selectedComic && (
          <motion.div
            key="details"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.4 }}
          >
            <DetailView 
              comic={selectedComic} 
              onBack={handleBackToLibrary}
              onSelectChapter={handleSelectChapter}
            />
          </motion.div>
        )}

        {view === 'reader' && selectedComic && selectedChapter && (
          <motion.div
            key="reader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ReaderView 
              comic={selectedComic}
              chapter={selectedChapter}
              onBack={handleBackToDetails}
              onNavigateChapter={handleNavigateChapter}
              onSelectChapter={handleSelectChapter}
              hasNext={canGoNext()}
              hasPrev={canGoPrev()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;