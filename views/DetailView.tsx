import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, List, Clock, User } from 'lucide-react';
import { Comic, Chapter } from '../types';
import { ImageLoader } from '../components/ImageLoader';

interface DetailViewProps {
  comic: Comic;
  onBack: () => void;
  onSelectChapter: (chapter: Chapter) => void;
}

export const DetailView: React.FC<DetailViewProps> = ({ comic, onBack, onSelectChapter }) => {
  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Hero Header with Blurred Background */}
      <div className="relative h-[40vh] md:h-[50vh] overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center blur-xl opacity-30 scale-110"
          style={{ backgroundImage: `url(${comic.coverUrl})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent" />
        
        <div className="absolute top-6 left-4 md:left-8 z-20">
          <button 
            onClick={onBack}
            className="p-2 rounded-full bg-black/30 backdrop-blur-md border border-white/10 hover:bg-white/10 text-white transition-all"
          >
            <ArrowLeft size={24} />
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-8 relative z-10 -mt-32 md:-mt-48 pb-20">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Cover Image */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-shrink-0 mx-auto md:mx-0 w-48 md:w-64 rounded-xl overflow-hidden shadow-2xl shadow-black ring-1 ring-white/10"
          >
            <ImageLoader src={comic.coverUrl} alt={comic.title} aspectRatio="aspect-[3/4]" />
          </motion.div>

          {/* Info */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex-1 space-y-4 pt-4 md:pt-12 text-center md:text-left"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight">{comic.title}</h1>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-zinc-400">
              <span className="flex items-center gap-1"><User size={14} /> {comic.author}</span>
              <span className="w-1 h-1 rounded-full bg-zinc-600" />
              <span className="flex items-center gap-1"><Clock size={14} /> {comic.status}</span>
              <span className="w-1 h-1 rounded-full bg-zinc-600" />
              <span>{comic.chapters.length} Chapters</span>
            </div>
            
            <p className="text-zinc-300 leading-relaxed max-w-2xl mx-auto md:mx-0">
              {comic.description}
            </p>

            <div className="flex flex-wrap justify-center md:justify-start gap-2 pt-2">
              {comic.tags.map(tag => (
                <span key={tag} className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-sm">
                  {tag}
                </span>
              ))}
            </div>

            <div className="pt-6">
              <button 
                onClick={() => onSelectChapter(comic.chapters[comic.chapters.length - 1])}
                className="inline-flex items-center gap-2 bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-zinc-200 transition-colors"
              >
                <Play size={20} fill="currentColor" /> Start Reading
              </button>
            </div>
          </motion.div>
        </div>

        {/* Chapter List */}
        <div className="mt-16">
          <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-4">
            <List className="text-indigo-400" size={24} />
            <h2 className="text-2xl font-bold text-white">Chapters</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {comic.chapters.map((chapter) => (
              <motion.button
                key={chapter.id}
                whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.05)' }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelectChapter(chapter)}
                className="flex items-center justify-between p-4 rounded-xl bg-zinc-900 border border-white/5 hover:border-indigo-500/30 transition-all text-left group"
              >
                <div>
                  <h3 className="text-zinc-200 font-medium group-hover:text-indigo-400 transition-colors">
                    {chapter.title}
                  </h3>
                  <span className="text-xs text-zinc-500">Folder: /{chapter.number.toString().padStart(3, '0')}</span>
                </div>
                <div className="text-xs text-zinc-600 group-hover:text-indigo-500/50">
                   {chapter.pages.length} Pages
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};