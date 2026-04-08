import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';

export default function Seasons() {
    const navigate = useNavigate();
    const [seasons, setSeasons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchSeasons = async () => {
            setLoading(true);
            try {
                const response = await fetch('https://api-animeinfo.vercel.app/api/seasons');
                const result = await response.json();

                if (result.success) {
                    setSeasons(result.data.seasons);
                } else {
                    console.error('Failed to fetch seasons');
                }
            } catch (error) {
                console.error('Error fetching seasons:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSeasons();
    }, []);

    const filteredSeasons = seasons.filter(season =>
        season.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Group by year (descending)
    const groupedByYear = filteredSeasons.reduce((acc, season) => {
        const yearMatch = season.name.match(/\d{4}/);
        const year = yearMatch ? parseInt(yearMatch[0]) : 0;
        if (!acc[year]) acc[year] = [];
        acc[year].push(season);
        return acc;
    }, {});

    const sortedYears = Object.keys(groupedByYear)
        .map(Number)
        .sort((a, b) => b - a);

    // Order of seasons within a year
    const seasonOrder = { Winter: 1, Spring: 2, Summer: 3, Fall: 4 };

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
                        <h1 className="text-white text-xl font-bold tracking-tight">Season Anime</h1>
                    </div>

                    {/* Search Bar */}
                    <div className="relative">
                        <i className="ri-search-line absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg"></i>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Cari season (contoh: winter 2026)..."
                            className="w-full bg-white/10 backdrop-blur border border-white/20 rounded-xl py-3 pl-11 pr-4 text-white placeholder-white/50 focus:outline-none focus:border-blue-400 transition-all"
                        />
                    </div>

                    {/* Total Seasons */}
                    <div className="mt-3 flex items-center gap-2">
                        <i className="ri-calendar-line text-blue-300 text-xs"></i>
                        <span className="text-blue-100 text-xs">{seasons.length} season tersedia</span>
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
                ) : filteredSeasons.length > 0 ? (
                    <>
                        {sortedYears.map((year) => (
                            <div key={year} className="mb-6">
                                <div className="flex items-center gap-2 mb-3 sticky top-0 bg-gray-900 py-1 z-10">
                                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                                        <span className="text-white text-xs font-bold">{year}</span>
                                    </div>
                                    <div className="flex-1 h-px bg-gray-700"></div>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    {groupedByYear[year]
                                        .sort((a, b) => {
                                            const seasonA = a.name.split(' ')[0];
                                            const seasonB = b.name.split(' ')[0];
                                            return (seasonOrder[seasonA] || 5) - (seasonOrder[seasonB] || 5);
                                        })
                                        .map((season) => (
                                            <Link
                                                key={season.id}
                                                to={`/season/${season.slug}`}
                                                className="bg-gray-800 rounded-xl p-3 hover:border-blue-500/50 border border-gray-700 transition-all active:scale-95 group flex items-center gap-2"
                                            >
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${season.name.includes('Winter') ? 'bg-blue-600/20 text-blue-400' :
                                                        season.name.includes('Spring') ? 'bg-green-600/20 text-green-400' :
                                                            season.name.includes('Summer') ? 'bg-yellow-600/20 text-yellow-400' :
                                                                'bg-orange-600/20 text-orange-400'
                                                    }`}>
                                                    <i className={`ri-${season.name.includes('Winter') ? 'snowflake-line' :
                                                        season.name.includes('Spring') ? 'flower-line' :
                                                            season.name.includes('Summer') ? 'sun-line' :
                                                                'leaf-line'} text-sm`}></i>
                                                </div>
                                                <span className="text-gray-200 text-sm font-medium flex-1">
                                                    {season.name}
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
                        <p className="text-gray-400 mt-3 text-sm">Season "{searchTerm}" tidak ditemukan</p>
                    </div>
                )}
            </div>

        </div>
    );
}