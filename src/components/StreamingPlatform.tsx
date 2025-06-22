import React, { useState, useEffect } from 'react';
import StreamingHeader from './StreamingHeader';
import HeroSection from './HeroSection';
import ContentRow from './ContentRow';
import { TMDBService } from '../services/tmdbService';

interface ContentItem {
  id: number;
  title: string;
  image: string;
  genre: string;
  year: string;
  rating: string;
  duration: string;
}

const StreamingPlatform = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [tvShows, setTvShows] = useState<ContentItem[]>([]);
  const [isLoadingTvShows, setIsLoadingTvShows] = useState(false);

  const trendingMovies = [
    {
      id: 1,
      title: "The Batman",
      image: "https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg",
      genre: "Action",
      year: "2022",
      rating: "7.8",
      duration: "2h 56min"
    },
    {
      id: 2,
      title: "Dune",
      image: "https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIckC.jpg",
      genre: "Sci-Fi",
      year: "2021",
      rating: "8.0",
      duration: "2h 35min"
    },
    {
      id: 3,
      title: "Spider-Man: No Way Home",
      image: "https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg",
      genre: "Action",
      year: "2021",
      rating: "8.4",
      duration: "2h 28min"
    },
    {
      id: 4,
      title: "The Matrix Resurrections",
      image: "https://image.tmdb.org/t/p/w500/8c4a8kE7PizaGQQnditMmI1xbRp.jpg",
      genre: "Sci-Fi",
      year: "2021",
      rating: "5.7",
      duration: "2h 28min"
    },
    {
      id: 5,
      title: "Top Gun: Maverick",
      image: "https://image.tmdb.org/t/p/w500/62HCnUTziyWcpDaBO2i1DX17ljH.jpg",
      genre: "Action",
      year: "2022",
      rating: "8.3",
      duration: "2h 11min"
    },
    {
      id: 6,
      title: "Black Panther: Wakanda Forever",
      image: "https://image.tmdb.org/t/p/w500/438QXt1E3WJWb3PqNniK0tAE5c1.jpg",
      genre: "Action",
      year: "2022",
      rating: "7.2",
      duration: "2h 41min"
    }
  ];

  const newReleases = [
    {
      id: 7,
      title: "Avatar: The Way of Water",
      image: "https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg",
      genre: "Sci-Fi",
      year: "2022",
      rating: "7.6",
      duration: "3h 12min"
    },
    {
      id: 8,
      title: "Black Adam",
      image: "https://image.tmdb.org/t/p/w500/pFlaoHTZeyNkG83vxsAJiGzfSsa.jpg",
      genre: "Action",
      year: "2022",
      rating: "6.3",
      duration: "2h 5min"
    },
    {
      id: 9,
      title: "Thor: Love and Thunder",
      image: "https://image.tmdb.org/t/p/w500/pIkRyD18kl4FhoCNQuWxWu5cBLM.jpg",
      genre: "Action",
      year: "2022",
      rating: "6.2",
      duration: "1h 59min"
    },
    {
      id: 10,
      title: "Doctor Strange in the Multiverse of Madness",
      image: "https://image.tmdb.org/t/p/w500/9Gtg2DzBhmYamXBS1hKAhiwbBKS.jpg",
      genre: "Action",
      year: "2022",
      rating: "6.9",
      duration: "2h 6min"
    },
    {
      id: 11,
      title: "The Northman",
      image: "https://image.tmdb.org/t/p/w500/zhLKlUaF1SEpO58ppHIAyENkwgw.jpg",
      genre: "Action",
      year: "2022",
      rating: "7.0",
      duration: "2h 17min"
    },
    {
      id: 12,
      title: "Everything Everywhere All at Once",
      image: "https://image.tmdb.org/t/p/w500/w3LxiVYdWWRvEVdn5RYq6jIqkb1.jpg",
      genre: "Sci-Fi",
      year: "2022",
      rating: "7.8",
      duration: "2h 19min"
    }
  ];

  const actionMovies = [
    {
      id: 13,
      title: "John Wick: Chapter 4",
      image: "https://image.tmdb.org/t/p/w500/vZloFAK7NmvMGKE7VkF5UHaz0I.jpg",
      genre: "Action",
      year: "2023",
      rating: "7.7",
      duration: "2h 49min"
    },
    {
      id: 14,
      title: "Fast X",
      image: "https://image.tmdb.org/t/p/w500/fiVW06jE7z9YnO4trhaMEdclSiC.jpg",
      genre: "Action",
      year: "2023",
      rating: "5.8",
      duration: "2h 21min"
    },
    {
      id: 15,
      title: "Mission: Impossible – Dead Reckoning",
      image: "https://image.tmdb.org/t/p/w500/NNxYkU70HPurnNCSiCjYAmacwm.jpg",
      genre: "Action",
      year: "2023",
      rating: "7.7",
      duration: "2h 43min"
    },
    {
      id: 16,
      title: "Guardians of the Galaxy Vol. 3",
      image: "https://image.tmdb.org/t/p/w500/r2J02Z2OpNTctfOSN1Ydgii51I3.jpg",
      genre: "Action",
      year: "2023",
      rating: "7.9",
      duration: "2h 30min"
    },
    {
      id: 17,
      title: "The Flash",
      image: "https://image.tmdb.org/t/p/w500/wD2kUCX1Bb6oeIb2uz7kbdfLP6k.jpg",
      genre: "Action",
      year: "2023",
      rating: "6.7",
      duration: "2h 24min"
    },
    {
      id: 18,
      title: "Indiana Jones 5",
      image: "https://image.tmdb.org/t/p/w500/Af4bXE63pVsb2FtbW8uYIyPBadD.jpg",
      genre: "Action",
      year: "2023",
      rating: "6.5",
      duration: "2h 34min"
    }
  ];

  // Additional movie categories for the Movies tab
  const comedyMovies = [
    {
      id: 19,
      title: "The Super Mario Bros. Movie",
      image: "https://image.tmdb.org/t/p/w500/qNBAXBIQlnOThrVvA6mA2B5ggV6.jpg",
      genre: "Comedy",
      year: "2023",
      rating: "7.0",
      duration: "1h 32min"
    },
    {
      id: 20,
      title: "Ant-Man and the Wasp: Quantumania",
      image: "https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg",
      genre: "Comedy",
      year: "2023",
      rating: "6.1",
      duration: "2h 4min"
    },
    {
      id: 21,
      title: "Shazam! Fury of the Gods",
      image: "https://image.tmdb.org/t/p/w500/A3ZbZsmsvNGdprRi2lKgGEeVLEH.jpg",
      genre: "Comedy",
      year: "2023",
      rating: "6.0",
      duration: "2h 10min"
    },
    {
      id: 22,
      title: "Dungeons & Dragons: Honor Among Thieves",
      image: "https://image.tmdb.org/t/p/w500/6LuXaihVIoJ5FeSiFb7CZMtU7du.jpg",
      genre: "Comedy",
      year: "2023",
      rating: "7.3",
      duration: "2h 14min"
    }
  ];

  const dramaMovies = [
    {
      id: 23,
      title: "Oppenheimer",
      image: "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
      genre: "Drama",
      year: "2023",
      rating: "8.4",
      duration: "3h 0min"
    },
    {
      id: 24,
      title: "Killers of the Flower Moon",
      image: "https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIckC.jpg",
      genre: "Drama",
      year: "2023",
      rating: "7.6",
      duration: "3h 26min"
    },
    {
      id: 25,
      title: "The Whale",
      image: "https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg",
      genre: "Drama",
      year: "2022",
      rating: "7.7",
      duration: "1h 57min"
    },
    {
      id: 26,
      title: "The Banshees of Inisherin",
      image: "https://image.tmdb.org/t/p/w500/8c4a8kE7PizaGQQnditMmI1xbRp.jpg",
      genre: "Drama",
      year: "2022",
      rating: "7.7",
      duration: "1h 54min"
    }
  ];

  // Fallback TV Shows data
  const fallbackTvShows: ContentItem[] = [
    {
      id: 1,
      title: "Andor",
      image: "https://images.unsplash.com/photo-1500673922987-e212871fec22?w=400&h=225&fit=crop",
      genre: "TV Show",
      year: "2022",
      rating: "8.4",
      duration: "45min"
    },
    {
      id: 2,
      title: "Arya",
      image: "https://images.unsplash.com/photo-1500673922987-e212871fec22?w=400&h=225&fit=crop",
      genre: "TV Show",
      year: "2023",
      rating: "7.8",
      duration: "45min"
    },
    {
      id: 3,
      title: "Breaking Bad",
      image: "https://images.unsplash.com/photo-1472396961693-142e6e269027?w=400&h=225&fit=crop",
      genre: "TV Show",
      year: "2008",
      rating: "9.5",
      duration: "45min"
    },
    {
      id: 4,
      title: "Friends",
      image: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=400&h=225&fit=crop",
      genre: "TV Show",
      year: "1994",
      rating: "8.9",
      duration: "22min"
    },
    {
      id: 5,
      title: "House of the Dragon",
      image: "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=400&h=225&fit=crop",
      genre: "TV Show",
      year: "2022",
      rating: "8.5",
      duration: "1h"
    },
    {
      id: 6,
      title: "How I Met Your Mother",
      image: "https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?w=400&h=225&fit=crop",
      genre: "TV Show",
      year: "2005",
      rating: "8.3",
      duration: "22min"
    },
    {
      id: 7,
      title: "Stranger Things",
      image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=225&fit=crop",
      genre: "TV Show",
      year: "2016",
      rating: "8.7",
      duration: "45min"
    },
    {
      id: 8,
      title: "The Bear",
      image: "https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?w=400&h=225&fit=crop",
      genre: "TV Show",
      year: "2022",
      rating: "8.7",
      duration: "30min"
    },
    {
      id: 9,
      title: "The Big Bang Theory",
      image: "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=400&h=225&fit=crop",
      genre: "TV Show",
      year: "2007",
      rating: "8.1",
      duration: "22min"
    },
    {
      id: 10,
      title: "The Family Man",
      image: "https://images.unsplash.com/photo-1472396961693-142e6e269027?w=400&h=225&fit=crop",
      genre: "TV Show",
      year: "2019",
      rating: "8.7",
      duration: "45min"
    },
    {
      id: 11,
      title: "The Lord of the Rings: The Rings of Power",
      image: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=400&h=225&fit=crop",
      genre: "TV Show",
      year: "2022",
      rating: "6.9",
      duration: "1h 15min"
    },
    {
      id: 12,
      title: "Wednesday",
      image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=225&fit=crop",
      genre: "TV Show",
      year: "2022",
      rating: "8.1",
      duration: "45min"
    }
  ];

  // Load TV Shows when the series tab is selected
  useEffect(() => {
    if (activeTab === 'series' && tvShows.length === 0) {
      loadTvShows();
    }
  }, [activeTab]);

  const loadTvShows = async () => {
    setIsLoadingTvShows(true);
    try {
      const trendingTvShows = await TMDBService.getTrendingTVShows('day');
      const formattedTvShows: ContentItem[] = trendingTvShows.slice(0, 12).map((show, index) => ({
        id: index + 1,
        title: show.title,
        image: show.posterPath 
          ? `https://image.tmdb.org/t/p/w500${show.posterPath}`
          : "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=225&fit=crop",
        genre: "TV Show",
        year: show.releaseDate ? new Date(show.releaseDate).getFullYear().toString() : "2024",
        rating: show.voteAverage ? show.voteAverage.toFixed(1) : "7.0",
        duration: "45min"
      }));
      setTvShows(formattedTvShows);
    } catch (error) {
      console.error('Error loading TV shows:', error);
      // Fallback to static data if API fails
      setTvShows(fallbackTvShows);
    } finally {
      setIsLoadingTvShows(false);
    }
  };

  // Render content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'series':
        return (
          <div className="relative z-10 pt-20 space-y-8 pb-16">
            {isLoadingTvShows ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
                <span className="ml-4 text-white text-lg">Loading TV Shows...</span>
              </div>
            ) : (
              <>
                <ContentRow title="Trending TV Shows" movies={tvShows} />
                <ContentRow title="Popular Series" movies={tvShows} />
                <ContentRow title="New Episodes" movies={tvShows} />
                <ContentRow title="Continue Watching" movies={tvShows} />
              </>
            )}
          </div>
        );
      case 'movies':
        return (
          <div className="relative z-10 pt-20 space-y-8 pb-16">
            <ContentRow title="Trending Movies" movies={trendingMovies} />
            <ContentRow title="New Releases" movies={newReleases} />
            <ContentRow title="Action Movies" movies={actionMovies} />
            <ContentRow title="Comedy Movies" movies={comedyMovies} />
            <ContentRow title="Drama Movies" movies={dramaMovies} />
            <ContentRow title="Continue Watching" movies={trendingMovies.slice(0, 4)} />
          </div>
        );
      case 'mylist':
        return (
          <div className="relative z-10 -mt-32 space-y-8 pb-16">
            <ContentRow title="My List" movies={newReleases.slice(0, 6)} />
            <ContentRow title="Recently Added" movies={trendingMovies.slice(0, 4)} />
          </div>
        );
      default: // home
        return (
          <div className="relative z-10 -mt-32 space-y-8 pb-16">
            <ContentRow title="Trending Now" movies={trendingMovies} />
            <ContentRow title="New Releases" movies={newReleases} />
            <ContentRow title="Action Movies" movies={actionMovies} />
            <ContentRow title="Continue Watching" movies={trendingMovies.slice(0, 4)} />
            <ContentRow title="My List" movies={newReleases.slice(0, 3)} />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-pink-900">
      <StreamingHeader activeTab={activeTab} onTabChange={setActiveTab} />
      {activeTab === 'home' && <HeroSection />}
      
      {renderContent()}
    </div>
  );
};

export default StreamingPlatform;
