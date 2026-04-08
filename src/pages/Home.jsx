import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BottomNav from '../components/BottomNav';

export default function Home() {
  const [animeList, setAnimeList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeGenre, setActiveGenre] = useState('Semua');

  // Fetch anime dari API
  useEffect(() => {
    const fetchAnime = async () => {
      setLoading(true);
      try {
        const response = await fetch('https://api-animeinfo.vercel.app/api/latest');
        const result = await response.json();

        if (result.success) {
          setAnimeList(result.data.anime_list);
        }
      } catch (error) {
        console.error('Error fetching anime:', error);
        setAnimeList([
          { id: 'isekai-nonbiri-nouka-2', title: 'Isekai Nonbiri Nouka 2', episode: '1', image: 'https://placehold.co/200x280/374151/9ca3af?text=Anime+1', status: 'Ongoing' },
          { id: 'one-piece', title: 'One Piece', episode: '1122', image: 'https://placehold.co/200x280/374151/9ca3af?text=Anime+2', status: 'Ongoing' },
          { id: 'naruto-shippuden', title: 'Naruto Shippuden', episode: '500', image: 'https://placehold.co/200x280/374151/9ca3af?text=Anime+3', status: 'Completed' },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchAnime();
  }, []);

  const genres = ['Semua', 'Donghua', 'Anime', 'Movie', 'Action', 'Adventure', 'Fantasy', 'Romance', 'Sci-Fi', 'Comedy'];

  const latestEpisodes = animeList.slice(0, 18).map(anime => ({
    id: anime.id,
    title: anime.title,
    episode: anime.episode,
    image: anime.image,
    isNew: true,
    status: anime.status
  }));

  return (
    <div className="min-h-screen bg-gray-900 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-800 rounded-b-3xl shadow-xl">
        <div className="px-5 pt-8 pb-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-blue-300 text-sm mb-1">Welcome Back,</p>
              <h2 className="text-white text-2xl font-bold tracking-tight">Alfath</h2>
            </div>
            <Link to="/search" className="bg-white/10 backdrop-blur rounded-full p-2.5 border border-white/20 hover:bg-white/20 transition-all active:scale-95">
              <i className="ri-search-line text-white text-xl"></i>
            </Link>
          </div>

          <div className="mt-5 bg-blue-800/30 backdrop-blur rounded-xl p-3 border border-blue-500/30">
            <div className="flex items-center gap-2">
              <i className="ri-megaphone-line text-blue-300 text-sm"></i>
              <p className="text-blue-100 text-xs flex-1">
                Kami berupaya memberikan yang terbaik untuk Anda. Terimakasih atas dukungannya 😊
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 mt-4">
        {/* Genre Chips */}
        <div className="mb-6">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {genres.map((genre) => (
              <button
                key={genre}
                onClick={() => setActiveGenre(genre)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap ${activeGenre === genre
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>

        {/* Latest Episodes Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-gray-200">Episode Terbaru</h3>
            <button className="text-xs text-blue-400 font-medium flex items-center gap-1 hover:text-blue-300 transition">
              Lihat Jadwal
              <i className="ri-arrow-right-s-line text-sm"></i>
            </button>
          </div>

          {loading ? (
            <div className="grid grid-cols-3 gap-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-800 rounded-xl h-40 w-full"></div>
                  <div className="mt-2 h-3 bg-gray-800 rounded w-full"></div>
                  <div className="mt-1 h-2 bg-gray-800 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              {latestEpisodes.map((anime, idx) => (
                <Link
                  key={idx}
                  to={`/${anime.id}`}
                  className="bg-gray-800 rounded-xl overflow-hidden cursor-pointer active:scale-95 transition-all duration-200 border border-gray-700 hover:border-blue-500/50 block"
                >
                  <div className="relative">
                    <img
                      src={anime.image}
                      alt={anime.title}
                      className="w-full aspect-[2/3] object-cover"
                      onError={(e) => {
                        e.target.src = 'https://placehold.co/200x300/374151/9ca3af?text=No+Img';
                      }}
                    />
                    {anime.isNew && (
                      <div className="absolute top-2 left-2 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                        NEW
                      </div>
                    )}
                    <div className="absolute bottom-2 right-2 bg-black/80 backdrop-blur px-1.5 py-0.5 rounded text-[9px] font-bold text-white">
                      EP {anime.episode}
                    </div>
                    {anime.status === 'Ongoing' && (
                      <div className="absolute top-2 right-2 bg-green-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                        ONG
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-end justify-center p-2">
                      <span className="text-white text-[10px] font-medium bg-blue-600/90 px-2 py-1 rounded-full">
                        <i className="ri-play-fill text-xs mr-0.5"></i> Detail
                      </span>
                    </div>
                  </div>
                  <div className="p-2">
                    <h4 className="text-[11px] font-semibold text-gray-200 line-clamp-2 leading-tight min-h-[2.5rem]">
                      {anime.title}
                    </h4>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <BottomNav active="home" />
    </div>
  );
}