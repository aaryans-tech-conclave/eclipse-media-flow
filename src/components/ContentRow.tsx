
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Heart } from 'lucide-react';

//New
interface Movie {
  id: number;
  title: string;
  image: string;
  genre: string;
  year: string;
  rating: string;
  duration?: string;
}

interface ContentRowProps {
  title: string;
  movies: Movie[];
}

const ContentRow: React.FC<ContentRowProps> = ({ title, movies }) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [hoveredMovie, setHoveredMovie] = useState<number | null>(null);

  const scroll = (direction: 'left' | 'right') => {
    const container = document.getElementById(`row-${title}`);
    if (container) {
      const scrollAmount = 300;
      const newPosition = direction === 'left' 
        ? Math.max(0, scrollPosition - scrollAmount)
        : scrollPosition + scrollAmount;
      
      container.scrollTo({ left: newPosition, behavior: 'smooth' });
      setScrollPosition(newPosition);
    }
  };

  return (
    <div className="group relative mb-8">
      {/* Section Title */}
      <h2 className="text-2xl font-bold text-white mb-4 px-6 md:px-16">
        {title}
      </h2>

      {/* Navigation Buttons */}
      <button
        onClick={() => scroll('left')}
        className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      
      <button
        onClick={() => scroll('right')}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Movies Container */}
      <div
        id={`row-${title}`}
        className="flex space-x-4 overflow-x-auto scrollbar-hide px-6 md:px-16 pb-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {movies.map((movie) => (
          <div
            key={movie.id}
            className="flex-shrink-0 w-48 md:w-56 cursor-pointer group/card"
            onMouseEnter={() => setHoveredMovie(movie.id)}
            onMouseLeave={() => setHoveredMovie(null)}
          >
            {/* Movie Card */}
            <div className="relative rounded-lg overflow-hidden bg-gray-800 transition-all duration-300 group-hover/card:scale-105 group-hover/card:shadow-2xl group-hover/card:shadow-pink-500/20">
              {/* Movie Image */}
              <div className="aspect-[16/9] relative">
                <img
                  src={movie.image}
                  alt={movie.title}
                  className="w-full h-full object-cover"
                />
                
                {/* Hover Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent transition-opacity duration-300 ${
                  hoveredMovie === movie.id ? 'opacity-100' : 'opacity-0'
                }`}>
                  {/* Quick Actions */}
                  <div className="absolute top-3 right-3">
                    <button className="p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors">
                      <Heart className="w-4 h-4 text-white" />
                    </button>
                  </div>

                  {/* Movie Info */}
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="flex items-center space-x-2 text-xs mb-2">
                      <span className="bg-pink-500 px-2 py-1 rounded text-white font-medium">
                        {movie.genre}
                      </span>
                      <span className="text-gray-300">{movie.year}</span>
                      <span className="bg-yellow-500 text-black px-1 py-0.5 rounded text-xs font-bold">
                        ★ {movie.rating}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Movie Title */}
              <div className="p-3">
                <h3 className="text-white font-semibold text-sm mb-1 line-clamp-2">
                  {movie.title}
                </h3>
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>{movie.year}</span>
                  {movie.duration && <span>{movie.duration}</span>}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContentRow;
