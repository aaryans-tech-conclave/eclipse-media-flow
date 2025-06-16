
import React from 'react';
import StreamingHeader from './StreamingHeader';
import HeroSection from './HeroSection';
import ContentRow from './ContentRow';

const StreamingPlatform = () => {
  const trendingMovies = [
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
    }
  ];

  const newReleases = [
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
    }
  ];

  const actionMovies = [
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
    },
    {
      id: 17,
      title: "The Flash",
      image: "https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?w=400&h=225&fit=crop",
      genre: "Action",
      year: "2023",
      rating: "6.7",
      duration: "2h 24min"
    },
    {
      id: 18,
      title: "Indiana Jones 5",
      image: "https://images.unsplash.com/photo-1472396961693-142e6e269027?w=400&h=225&fit=crop",
      genre: "Action",
      year: "2023",
      rating: "6.5",
      duration: "2h 34min"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-pink-900">
      <StreamingHeader />
      <HeroSection />
      
      <div className="relative z-10 -mt-32 space-y-8 pb-16">
        <ContentRow title="Trending Now" movies={trendingMovies} />
        <ContentRow title="New Releases" movies={newReleases} />
        <ContentRow title="Action Movies" movies={actionMovies} />
        <ContentRow title="Continue Watching" movies={trendingMovies.slice(0, 4)} />
        <ContentRow title="My List" movies={newReleases.slice(0, 3)} />
      </div>
    </div>
  );
};

export default StreamingPlatform;
