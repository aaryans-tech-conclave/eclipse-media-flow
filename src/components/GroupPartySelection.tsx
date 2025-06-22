import React, { useState } from 'react';
import { X, Play, Heart } from 'lucide-react';

interface Movie {
  id: number;
  title: string;
  image: string;
  genre: string;
  year: string;
  rating: string;
  duration?: string;
}

interface GroupPartySelectionProps {
  isOpen: boolean;
  onClose: () => void;
  onMovieSelect: (movie: Movie) => void;
}

const GroupPartySelection: React.FC<GroupPartySelectionProps> = ({ isOpen, onClose, onMovieSelect }) => {
  const [hoveredMovie, setHoveredMovie] = useState<number | null>(null);

  const allMovies = [
    {
      id: 1,
      title: "Stranger Things 4",
      image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=225&fit=crop",
      genre: "Sci-Fi",
      year: "2022",
      rating: "8.7",
      duration: "1h 15min"
    },
    {
      id: 2,
      title: "The Batman",
      image: "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=400&h=225&fit=crop",
      genre: "Action",
      year: "2022",
      rating: "7.8",
      duration: "2h 56min"
    },
    {
      id: 3,
      title: "Dune",
      image: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=400&h=225&fit=crop",
      genre: "Sci-Fi",
      year: "2021",
      rating: "8.0",
      duration: "2h 35min"
    },
    {
      id: 4,
      title: "Spider-Man: No Way Home",
      image: "https://images.unsplash.com/photo-1500673922987-e212871fec22?w=400&h=225&fit=crop",
      genre: "Action",
      year: "2021",
      rating: "8.4",
      duration: "2h 28min"
    },
    {
      id: 5,
      title: "The Matrix Resurrections",
      image: "https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?w=400&h=225&fit=crop",
      genre: "Sci-Fi",
      year: "2021",
      rating: "5.7",
      duration: "2h 28min"
    },
    {
      id: 6,
      title: "Top Gun: Maverick",
      image: "https://images.unsplash.com/photo-1472396961693-142e6e269027?w=400&h=225&fit=crop",
      genre: "Action",
      year: "2022",
      rating: "8.3",
      duration: "2h 11min"
    },
    {
      id: 7,
      title: "Wednesday",
      image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=225&fit=crop",
      genre: "Horror",
      year: "2022",
      rating: "8.1",
      duration: "45min"
    },
    {
      id: 8,
      title: "House of the Dragon",
      image: "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=400&h=225&fit=crop",
      genre: "Fantasy",
      year: "2022",
      rating: "8.5",
      duration: "1h"
    },
    {
      id: 9,
      title: "The Lord of the Rings: The Rings of Power",
      image: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=400&h=225&fit=crop",
      genre: "Fantasy",
      year: "2022",
      rating: "6.9",
      duration: "1h 15min"
    },
    {
      id: 10,
      title: "Andor",
      image: "https://images.unsplash.com/photo-1500673922987-e212871fec22?w=400&h=225&fit=crop",
      genre: "Sci-Fi",
      year: "2022",
      rating: "8.4",
      duration: "45min"
    },
    {
      id: 11,
      title: "The Bear",
      image: "https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?w=400&h=225&fit=crop",
      genre: "Comedy",
      year: "2022",
      rating: "8.7",
      duration: "30min"
    },
    {
      id: 12,
      title: "Euphoria",
      image: "https://images.unsplash.com/photo-1472396961693-142e6e269027?w=400&h=225&fit=crop",
      genre: "Drama",
      year: "2022",
      rating: "8.4",
      duration: "55min"
    },
    {
      id: 13,
      title: "John Wick: Chapter 4",
      image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=225&fit=crop",
      genre: "Action",
      year: "2023",
      rating: "7.7",
      duration: "2h 49min"
    },
    {
      id: 14,
      title: "Fast X",
      image: "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=400&h=225&fit=crop",
      genre: "Action",
      year: "2023",
      rating: "5.8",
      duration: "2h 21min"
    },
    {
      id: 15,
      title: "Mission: Impossible – Dead Reckoning",
      image: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=400&h=225&fit=crop",
      genre: "Action",
      year: "2023",
      rating: "7.7",
      duration: "2h 43min"
    },
    {
      id: 16,
      title: "Guardians of the Galaxy Vol. 3",
      image: "https://images.unsplash.com/photo-1500673922987-e212871fec22?w=400&h=225&fit=crop",
      genre: "Action",
      year: "2023",
      rating: "7.9",
      duration: "2h 30min"
    }
  ];

  const handleMovieSelect = (movie: Movie) => {
    onMovieSelect(movie);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          onClick={onClose}
        />
      )}

      {/* Group Party Selection Window */}
      <div className={`fixed inset-4 bg-black border border-white/20 rounded-2xl transform transition-all duration-300 ease-in-out z-50 ${
        isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'
      }`}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <Play className="w-6 h-6 text-purple-400" />
            <h2 className="text-2xl font-bold text-white">Choose a Movie to Watch</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-black hover:bg-gray-900 transition-colors border border-white/20"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto max-h-[calc(100vh-200px)]">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {allMovies.map((movie) => (
              <div
                key={movie.id}
                className="cursor-pointer group"
                onMouseEnter={() => setHoveredMovie(movie.id)}
                onMouseLeave={() => setHoveredMovie(null)}
                onClick={() => handleMovieSelect(movie)}
              >
                {/* Movie Card */}
                <div className="relative rounded-lg overflow-hidden bg-gray-800 transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl group-hover:shadow-pink-500/20">
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

                      {/* Play Button */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                          <Play className="w-8 h-8 text-white fill-white" />
                        </div>
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
      </div>
    </>
  );
};

export default GroupPartySelection; 