import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Play, Heart } from 'lucide-react';
import { useLikedItems, LikedItem } from '../contexts/LikedItemsContext';
import { TMDBService } from '../services/tmdbService';

interface SearchResult {
  id: number;
  title: string;
  poster_path: string;
  media_type: 'movie' | 'tv';
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
}

interface SearchDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

// Fallback data in case API fails
const fallbackMovies: SearchResult[] = [
  {
    id: 1,
    title: "The Shawshank Redemption",
    poster_path: "/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
    media_type: "movie",
    release_date: "1994-09-23",
    vote_average: 9.3
  },
  {
    id: 2,
    title: "The Godfather",
    poster_path: "/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
    media_type: "movie",
    release_date: "1972-03-24",
    vote_average: 9.2
  },
  {
    id: 3,
    title: "Pulp Fiction",
    poster_path: "/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg",
    media_type: "movie",
    release_date: "1994-10-14",
    vote_average: 8.9
  },
  {
    id: 4,
    title: "Fight Club",
    poster_path: "/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
    media_type: "movie",
    release_date: "1999-10-15",
    vote_average: 8.8
  },
  {
    id: 5,
    title: "Inception",
    poster_path: "/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
    media_type: "movie",
    release_date: "2010-07-16",
    vote_average: 8.8
  }
];

const fallbackTVShows: SearchResult[] = [
  {
    id: 6,
    title: "Breaking Bad",
    poster_path: "/ggFHVNu6YYI5L9pCfOacjizRGt.jpg",
    media_type: "tv",
    first_air_date: "2008-01-20",
    vote_average: 9.5
  },
  {
    id: 7,
    title: "Game of Thrones",
    poster_path: "/u3bZgnGQ9T01sWNhyveQz0wH0Hl.jpg",
    media_type: "tv",
    first_air_date: "2011-04-17",
    vote_average: 9.3
  },
  {
    id: 8,
    title: "The Wire",
    poster_path: "/7kSuZaiEnJbVeoVbO2hhiLtJzZ.jpg",
    media_type: "tv",
    first_air_date: "2002-06-02",
    vote_average: 9.3
  },
  {
    id: 9,
    title: "Stranger Things",
    poster_path: "/49WJfeN0moxb9IPfGn8AIqMGskD.jpg",
    media_type: "tv",
    first_air_date: "2016-07-15",
    vote_average: 8.7
  },
  {
    id: 10,
    title: "The Crown",
    poster_path: "/7kSuZaiEnJbVeoVbO2hhiLtJzZ.jpg",
    media_type: "tv",
    first_air_date: "2016-11-04",
    vote_average: 8.7
  }
];

const SearchDropdown: React.FC<SearchDropdownProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [allContent, setAllContent] = useState<SearchResult[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { addToLikedItems, removeFromLikedItems, isLiked } = useLikedItems();

  // Fetch all content on component mount
  useEffect(() => {
    const fetchAllContent = async () => {
      try {
        // Try to fetch from TMDB API using the service
        const [movies, tvShows] = await Promise.all([
          TMDBService.getTrendingMovies('day'),
          TMDBService.getTrendingTVShows('day')
        ]);

        // Convert to SearchResult format
        const movieResults: SearchResult[] = movies.map(movie => ({
          id: parseInt(movie.id.replace('movie_', '')),
          title: movie.title,
          poster_path: movie.posterPath || '',
          media_type: 'movie' as const,
          release_date: movie.releaseDate,
          vote_average: movie.voteAverage
        }));

        const tvResults: SearchResult[] = tvShows.map(show => ({
          id: parseInt(show.id.replace('tv_', '')),
          title: show.title,
          poster_path: show.posterPath || '',
          media_type: 'tv' as const,
          first_air_date: show.releaseDate,
          vote_average: show.voteAverage
        }));

        setAllContent([...movieResults, ...tvResults]);
      } catch (error) {
        console.error('Error fetching content from API, using fallback data:', error);
        // Use fallback data if API fails
        setAllContent([...fallbackMovies, ...fallbackTVShows]);
      }
    };

    fetchAllContent();
  }, []);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Focus input when opened
      setTimeout(() => inputRef.current?.focus(), 100);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Handle escape key to close dropdown
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  // Local search functionality
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    
    // Simulate loading delay for better UX
    const searchTimer = setTimeout(() => {
      const searchTerm = query.toLowerCase();
      const filteredResults = allContent
        .filter(item => 
          item.title.toLowerCase().includes(searchTerm)
        )
        .slice(0, 8); // Limit to 8 results
      
      setResults(filteredResults);
      setIsLoading(false);
    }, 200);

    return () => clearTimeout(searchTimer);
  }, [query, allContent]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, -1));
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      handleResultClick(results[selectedIndex]);
    }
  };

  const handleResultClick = (result: SearchResult) => {
    // Handle result click - could navigate to movie/show page
    console.log('Selected:', result);
    onClose();
  };

  const handleHeartClick = (e: React.MouseEvent, result: SearchResult) => {
    e.stopPropagation();
    const likedItem: LikedItem = {
      id: result.id,
      title: result.title,
      image: result.poster_path ? `https://image.tmdb.org/t/p/w500${result.poster_path}` : '',
      genre: result.media_type === 'movie' ? 'Movie' : 'TV Show',
      year: (result.release_date || result.first_air_date || '').split('-')[0] || '2024',
      rating: result.vote_average.toFixed(1),
      duration: '2h 0min',
      type: result.media_type
    };

    if (isLiked(result.id)) {
      removeFromLikedItems(result.id);
    } else {
      addToLikedItems(likedItem);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20">
      <div 
        ref={searchRef}
        className="bg-black/95 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl w-[600px] mx-4 overflow-hidden"
      >
        {/* Search Header */}
        <div className="p-3 border-b border-white/10">
          <div className="flex items-center space-x-2">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search movies, TV shows..."
              className="flex-1 bg-transparent border-none outline-none text-white placeholder-gray-400 text-sm"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="p-1 rounded-full hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            )}
          </div>
        </div>

        {/* Search Results */}
        <div className="max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="p-6 text-center">
              <div className="text-gray-400 text-sm">Searching...</div>
            </div>
          ) : query.length < 2 ? (
            <div className="p-6 text-center">
              <Search className="w-8 h-8 text-gray-600 mx-auto mb-2" />
              <div className="text-gray-400 text-sm">Start typing to search</div>
              <div className="text-gray-500 text-xs mt-1">Search from {allContent.length} movies and TV shows</div>
            </div>
          ) : results.length === 0 ? (
            <div className="p-6 text-center">
              <div className="text-gray-400 text-sm">No results found for "{query}"</div>
            </div>
          ) : (
            <div className="p-2">
              {results.map((result, index) => (
                <div
                  key={`${result.media_type}-${result.id}`}
                  onClick={() => handleResultClick(result)}
                  className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
                    index === selectedIndex 
                      ? 'bg-white/20' 
                      : 'hover:bg-white/10'
                  }`}
                >
                  {/* Poster */}
                  <div className="relative flex-shrink-0">
                    <img
                      src={result.poster_path 
                        ? `https://image.tmdb.org/t/p/w92${result.poster_path}`
                        : 'https://via.placeholder.com/46x69/333/666?text=No+Image'
                      }
                      alt={result.title}
                      className="w-12 h-16 object-cover rounded"
                    />
                    <button 
                      onClick={(e) => handleHeartClick(e, result)}
                      className={`absolute -top-1 -right-1 p-1 rounded-full transition-colors ${
                        isLiked(result.id) 
                          ? 'bg-pink-500/80 hover:bg-pink-500' 
                          : 'bg-black/50 hover:bg-black/70'
                      }`}
                    >
                      <Heart className={`w-3 h-3 ${
                        isLiked(result.id) ? 'text-white fill-white' : 'text-white'
                      }`} />
                    </button>
                  </div>

                  {/* Content Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        result.media_type === 'movie' 
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                          : 'bg-green-500/20 text-green-400 border border-green-500/30'
                      }`}>
                        {result.media_type === 'movie' ? 'Movie' : 'TV Show'}
                      </span>
                      <span className="bg-yellow-500 text-black px-1 py-0.5 rounded text-xs font-bold">
                        ★ {result.vote_average.toFixed(1)}
                      </span>
                    </div>
                    
                    <h3 className="text-white font-medium text-sm mb-1 line-clamp-1">
                      {result.title}
                    </h3>
                    
                    <div className="text-gray-400 text-xs">
                      {(result.release_date || result.first_air_date || '').split('-')[0] || 'TBA'}
                    </div>
                  </div>

                  {/* Play Button */}
                  <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                    <Play className="w-4 h-4 text-white" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchDropdown; 