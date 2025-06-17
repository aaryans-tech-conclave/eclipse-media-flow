
import React, { useState } from 'react';
import { TrendingUp, X, Play, Star, Clock } from 'lucide-react';

interface TrendingItem {
  id: number;
  title: string;
  type: 'movie' | 'show';
  trendingScore: number;
  rating: string;
  year: string;
  image: string;
  socialMentions: string;
}

const TrendingDashboard = () => {
  const [isOpen, setIsOpen] = useState(false);

  const trendingItems: TrendingItem[] = [
    {
      id: 1,
      title: "Wednesday",
      type: "show",
      trendingScore: 98,
      rating: "8.1",
      year: "2022",
      image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=300&h=169&fit=crop",
      socialMentions: "2.4M"
    },
    {
      id: 2,
      title: "Avatar: The Way of Water",
      type: "movie",
      trendingScore: 95,
      rating: "7.6",
      year: "2022",
      image: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=300&h=169&fit=crop",
      socialMentions: "1.8M"
    },
    {
      id: 3,
      title: "House of the Dragon",
      type: "show",
      trendingScore: 92,
      rating: "8.5",
      year: "2022",
      image: "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=300&h=169&fit=crop",
      socialMentions: "1.5M"
    },
    {
      id: 4,
      title: "Top Gun: Maverick",
      type: "movie",
      trendingScore: 89,
      rating: "8.3",
      year: "2022",
      image: "https://images.unsplash.com/photo-1472396961693-142e6e269027?w=300&h=169&fit=crop",
      socialMentions: "1.2M"
    },
    {
      id: 5,
      title: "Stranger Things 4",
      type: "show",
      trendingScore: 87,
      rating: "8.7",
      year: "2022",
      image: "https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?w=300&h=169&fit=crop",
      socialMentions: "980K"
    }
  ];

  const toggleDashboard = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div className="flex items-center">
        <button
          onClick={toggleDashboard}
          className={`flex items-center space-x-2 px-3 py-2 rounded-full transition-all duration-300 ${
            isOpen
              ? 'bg-purple-500/20 border border-purple-500/40 text-purple-400'
              : 'bg-white/10 hover:bg-white/20 text-gray-400 hover:text-white border border-white/20'
          }`}
          title="Trending on Social Media"
        >
          <TrendingUp className="w-4 h-4" />
          <span className="text-xs font-medium hidden sm:inline">Trending</span>
        </button>
      </div>

      {/* Trending Dashboard Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-20">
          <div className="bg-black/90 backdrop-blur-xl border border-white/20 rounded-2xl p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-white mb-1">Trending Now</h2>
                <p className="text-sm text-gray-400">Most talked about on social media</p>
              </div>
              <button
                onClick={toggleDashboard}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Trending Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto max-h-[60vh] scrollbar-hide">
              {trendingItems.map((item, index) => (
                <div
                  key={item.id}
                  className="group relative bg-white/5 rounded-lg overflow-hidden hover:bg-white/10 transition-all duration-300 border border-white/10"
                >
                  {/* Trending Rank */}
                  <div className="absolute top-2 left-2 z-10">
                    <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-2 py-1 rounded-full text-xs font-bold">
                      #{index + 1}
                    </div>
                  </div>

                  {/* Trending Score */}
                  <div className="absolute top-2 right-2 z-10">
                    <div className="bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                      <TrendingUp className="w-3 h-3" />
                      <span>{item.trendingScore}%</span>
                    </div>
                  </div>

                  {/* Image */}
                  <div className="relative aspect-video">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    
                    {/* Play Button */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 hover:bg-white/30 transition-colors cursor-pointer">
                        <Play className="w-6 h-6 text-white fill-white" />
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.type === 'movie' 
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                          : 'bg-green-500/20 text-green-400 border border-green-500/30'
                      }`}>
                        {item.type === 'movie' ? 'Movie' : 'TV Show'}
                      </span>
                      <div className="flex items-center space-x-1 text-yellow-400">
                        <Star className="w-3 h-3 fill-current" />
                        <span className="text-xs font-medium">{item.rating}</span>
                      </div>
                    </div>

                    <h3 className="text-white font-semibold mb-2 line-clamp-2">{item.title}</h3>
                    
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{item.year}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <TrendingUp className="w-3 h-3" />
                        <span>{item.socialMentions} mentions</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="mt-6 pt-4 border-t border-white/10">
              <p className="text-xs text-gray-400 text-center">
                Data updated every hour • Based on social media engagement
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TrendingDashboard;
