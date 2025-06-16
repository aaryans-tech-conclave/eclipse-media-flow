
import React, { useState, useEffect } from 'react';
import { Heart, Clock } from 'lucide-react';

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const heroContent = [
    {
      id: 1,
      title: "Avengers: Endgame",
      description: "After the devastating events of Avengers: Infinity War, the universe is in ruins. With the help of remaining allies, the Avengers assemble once more to reverse Thanos' actions and restore balance to the universe.",
      genre: "Action",
      duration: "3h 1min",
      rating: "8.4",
      image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1920&h=1080&fit=crop",
      year: "2019"
    },
    {
      id: 2,
      title: "Interstellar",
      description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival as Earth faces an environmental crisis that threatens the future of mankind.",
      genre: "Sci-Fi",
      duration: "2h 49min",
      rating: "8.6",
      image: "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=1920&h=1080&fit=crop",
      year: "2014"
    },
    {
      id: 3,
      title: "The Matrix",
      description: "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.",
      genre: "Action",
      duration: "2h 16min",
      rating: "8.7",
      image: "https://images.unsplash.com/photo-1500673922987-e212871fec22?w=1920&h=1080&fit=crop",
      year: "1999"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroContent.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const currentContent = heroContent[currentSlide];

  return (
    <div className="relative h-screen overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out"
        style={{ backgroundImage: `url(${currentContent.image})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center h-full px-6 md:px-16">
        <div className="max-w-2xl space-y-6 animate-fade-in">
          {/* Movie Info Tags */}
          <div className="flex items-center space-x-4 text-sm">
            <span className="bg-gradient-to-r from-pink-500 to-purple-600 px-3 py-1 rounded-full text-white font-medium">
              {currentContent.genre}
            </span>
            <span className="text-gray-300">{currentContent.year}</span>
            <div className="flex items-center text-gray-300">
              <Clock className="w-4 h-4 mr-1" />
              {currentContent.duration}
            </div>
            <span className="bg-yellow-500 text-black px-2 py-1 rounded text-xs font-bold">
              ★ {currentContent.rating}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
            {currentContent.title}
          </h1>

          {/* Description */}
          <p className="text-lg text-gray-300 leading-relaxed max-w-xl">
            {currentContent.description}
          </p>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4 pt-4">
            <button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-pink-500/25">
              ▶ Watch Now
            </button>
            <button className="bg-white/20 backdrop-blur-sm border border-white/30 text-white px-8 py-3 rounded-full font-semibold hover:bg-white/30 transition-all duration-300 flex items-center space-x-2">
              <Heart className="w-5 h-5" />
              <span>My List</span>
            </button>
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
        {heroContent.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? 'bg-gradient-to-r from-pink-500 to-purple-600 scale-125' 
                : 'bg-white/30 hover:bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSection;
