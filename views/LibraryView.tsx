import React from 'react';
import { motion } from 'framer-motion';
import { Comic } from '../types';
import { ImageLoader } from '../components/ImageLoader';
import { BookOpen, TrendingUp } from 'lucide-react';

interface LibraryViewProps {
  comics: Comic[];
  onSelectComic: (comic: Comic) => void;
}

export const LibraryView: React.FC<LibraryViewProps> = ({ comics, onSelectComic }) => {
  return (
    <div className="min-h-screen pb-20 px-4 md:px-8 pt-24 max-w-7xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4"
      >
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-500 mb-2">
            Discover
          </h1>
          <p className="text-zinc-400 text-lg">Dive into infinite worlds.</p>
        </div>
      </motion.div>

      {comics.length === 0 ? (
        <div className="text-center py-20 text-zinc-500">
          <p className="text-xl">No comics found.</p>
          <p className="text-sm mt-2 opacity-60">
            If you are the site owner, ensure <code>/comics</code> folder exists and <code>node scan_comics.js</code> was run.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
          {comics.map((comic, index) => (
            <motion.div
              key={comic.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="group cursor-pointer"
              onClick={() => onSelectComic(comic)}
            >
              <div className="rounded-xl overflow-hidden shadow-2xl shadow-black/50 mb-4 ring-1 ring-white/10 group-hover:ring-indigo-500/50 transition-all duration-300">
                <ImageLoader src={comic.coverUrl} alt={comic.title} aspectRatio="aspect-[3/4]" />
              </div>
              
              <div className="space-y-1">
                <h3 className="text-white font-bold text-lg leading-tight group-hover:text-indigo-400 transition-colors line-clamp-1">
                  {comic.title}
                </h3>
                <div className="flex items-center justify-between text-xs text-zinc-500">
                   <span>{comic.chapters.length} Chapters</span>
                   <span className="flex items-center gap-1">
                     <TrendingUp size={12} /> {comic.status}
                   </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};