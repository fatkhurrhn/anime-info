import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Studios() {
    const navigate = useNavigate();
    const [studios, setStudios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchStudios = async () => {
            setLoading(true);
            try {
                const response = await fetch('https://api-animeinfo.vercel.app/api/studios');
                const result = await response.json();

                if (result.success) {
                    setStudios(result.data.studios);
                } else {
                    console.error('Failed to fetch studios');
                }
            } catch (error) {
                console.error('Error fetching studios:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStudios();
    }, []);

    const filteredStudios = studios.filter(studio =>
        studio.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Group by first letter
    const groupedStudios = filteredStudios.reduce((acc, studio) => {
        const firstLetter = studio.name.charAt(0).toUpperCase();
        if (!acc[firstLetter]) acc[firstLetter] = [];
        acc[firstLetter].push(studio);
        return acc;
    }, {});

    const sortedLetters = Object.keys(groupedStudios).sort();

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
                        <h1 className="text-white text-xl font-bold tracking-tight">Studio Anime</h1>
                    </div>

                    {/* Search Bar */}
                    <div className="relative">
                        <i className="ri-search-line absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg"></i>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Cari studio..."
                            className="w-full bg-white/10 backdrop-blur border border-white/20 rounded-xl py-3 pl-11 pr-4 text-white placeholder-white/50 focus:outline-none focus:border-blue-400 transition-all"
                        />
                    </div>

                    {/* Total Studios */}
                    <div className="mt-3 flex items-center gap-2">
                        <i className="ri-building-line text-blue-300 text-xs"></i>
                        <span className="text-blue-100 text-xs">{studios.length} studio tersedia</span>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="px-4 mt-4">
                {loading ? (
                    <div className="grid grid-cols-2 gap-3">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="animate-pulse">
                                <div className="bg-gray-800 rounded-xl h-20 w-full"></div>
                            </div>
                        ))}
                    </div>
                ) : filteredStudios.length > 0 ? (
                    <>
                        {sortedLetters.map((letter) => (
                            <div key={letter} className="mb-6">
                                <div className="flex items-center gap-2 mb-3 sticky top-0 bg-gray-900 py-1 z-10">
                                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                                        <span className="text-white text-xs font-bold">{letter}</span>
                                    </div>
                                    <div className="flex-1 h-px bg-gray-700"></div>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    {groupedStudios[letter].map((studio) => (
                                        <Link
                                            key={studio.id}
                                            to={`/studio/${studio.slug}`}
                                            className="bg-gray-800 rounded-xl p-3 hover:border-blue-500/50 border border-gray-700 transition-all active:scale-95 group flex items-center gap-2"
                                        >
                                            <div className="w-8 h-8 bg-blue-600/20 rounded-full flex items-center justify-center group-hover:bg-blue-600/40 transition">
                                                <i className="ri-building-line text-blue-400 text-sm"></i>
                                            </div>
                                            <span className="text-gray-200 text-sm font-medium line-clamp-1 flex-1">
                                                {studio.name}
                                            </span>
                                            <i className="ri-arrow-right-s-line text-gray-500 group-hover:text-blue-400 transition"></i>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </>
                ) : (
                    <div className="text-center py-12">
                        <i className="ri-emotion-sad-line text-5xl text-gray-600"></i>
                        <p className="text-gray-400 mt-3 text-sm">Studio "{searchTerm}" tidak ditemukan</p>
                    </div>
                )}
            </div>

        </div>
    );
}