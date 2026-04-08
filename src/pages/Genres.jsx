import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Genres() {
    const navigate = useNavigate();
    const [genres, setGenres] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchGenres = async () => {
            setLoading(true);
            try {
                const response = await fetch('https://api-animeinfo.vercel.app/api/genres');
                const result = await response.json();

                if (result.success) {
                    setGenres(result.data.genres);
                } else {
                    console.error('Failed to fetch genres');
                }
            } catch (error) {
                console.error('Error fetching genres:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchGenres();
    }, []);

    const filteredGenres = genres.filter(genre =>
        genre.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Group by first letter for better organization
    const groupedGenres = filteredGenres.reduce((acc, genre) => {
        const firstLetter = genre.name.charAt(0).toUpperCase();
        if (!acc[firstLetter]) acc[firstLetter] = [];
        acc[firstLetter].push(genre);
        return acc;
    }, {});

    const sortedLetters = Object.keys(groupedGenres).sort();

    return (
        <div className="min-h-screen bg-gray-900 pb-20">
            {/* Header */}
            <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-800 shadow-xl">
                <div className="px-5 pt-8 pb-6">
                    <div className="flex items-center gap-3 mb-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="bg-white/10 backdrop-blur rounded-full p-2 border border-white/20 hover:bg-white/20 transition-all active:scale-95"
                        >
                            <i className="ri-arrow-left-line text-white text-xl"></i>
                        </button>
                        <h1 className="text-white text-xl font-bold tracking-tight">Genre Anime</h1>
                    </div>

                    {/* Search Bar */}
                    <div className="relative">
                        <i className="ri-search-line absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg"></i>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Cari genre..."
                            className="w-full bg-white/10 backdrop-blur border border-white/20 rounded-xl py-3 pl-11 pr-4 text-white placeholder-white/50 focus:outline-none focus:border-blue-400 transition-all"
                        />
                    </div>

                    {/* Total Genres */}
                    <div className="mt-3 flex items-center gap-2">
                        <i className="ri-folder-open-line text-blue-300 text-xs"></i>
                        <span className="text-blue-100 text-xs">{genres.length} genre tersedia</span>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="px-4 mt-4">
                {loading ? (
                    <div className="grid grid-cols-2 gap-3">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="animate-pulse">
                                <div className="bg-gray-800 rounded-xl h-32 w-full"></div>
                            </div>
                        ))}
                    </div>
                ) : filteredGenres.length > 0 ? (
                    <>
                        {sortedLetters.map((letter) => (
                            <div key={letter} className="mb-6">
                                <div className="flex items-center gap-2 mb-3 sticky top-0 bg-gray-900 py-1 z-10">
                                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                                        <span className="text-white text-xs font-bold">{letter}</span>
                                    </div>
                                    <div className="flex-1 h-px bg-gray-700"></div>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    {groupedGenres[letter].map((genre) => (
                                        <Link
                                            key={genre.id}
                                            to={`/genre/${genre.slug}`}
                                            className="bg-gray-800 rounded-xl overflow-hidden hover:border-blue-500/50 border border-gray-700 transition-all active:scale-95 group"
                                        >
                                            <div className="relative h-24 overflow-hidden">
                                                <img
                                                    src={genre.image}
                                                    alt={genre.name}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                    onError={(e) => {
                                                        e.target.src = 'https://placehold.co/400x100/374151/9ca3af?text=No+Image';
                                                    }}
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                                                <div className="absolute bottom-2 left-2 right-2">
                                                    <h3 className="text-white font-bold text-sm line-clamp-1">{genre.name}</h3>
                                                    <div className="flex items-center gap-2 mt-0.5">
                                                        <span className="text-[9px] text-gray-300 flex items-center gap-0.5">
                                                            <i className="ri-movie-line text-[8px]"></i>
                                                            {genre.total_series} series
                                                        </span>
                                                        {genre.has_ongoing && (
                                                            <span className="text-[9px] text-green-400 flex items-center gap-0.5">
                                                                <i className="ri-live-line text-[8px]"></i>
                                                                {genre.ongoing} ongoing
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </>
                ) : (
                    <div className="text-center py-12">
                        <i className="ri-emotion-sad-line text-5xl text-gray-600"></i>
                        <p className="text-gray-400 mt-3 text-sm">Genre "{searchTerm}" tidak ditemukan</p>
                    </div>
                )}
            </div>

        </div>
    );
}