import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';

export default function DetailSeason() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [seasonInfo, setSeasonInfo] = useState(null);
    const [animeList, setAnimeList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [hasNextPage, setHasNextPage] = useState(false);
    const [hasPrevPage, setHasPrevPage] = useState(false);

    const fetchSeasonAnime = async (page = 1) => {
        setLoading(true);
        try {
            const response = await fetch(`https://api-animeinfo.vercel.app/api/season/${slug}?page=${page}`);
            const result = await response.json();

            if (result.success) {
                setSeasonInfo({
                    name: result.data.season_name || result.data.season,
                    page: result.data.page,
                    total_pages: result.data.total_pages
                });
                setAnimeList(result.data.anime_list || []);
                setCurrentPage(result.pagination?.current_page || page);
                setTotalPages(result.pagination?.total_pages || result.data.total_pages || 1);
                setHasNextPage(result.pagination?.has_next_page || false);
                setHasPrevPage(result.pagination?.has_prev_page || false);
            } else {
                console.error('Failed to fetch season anime');
            }
        } catch (error) {
            console.error('Error fetching season anime:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (slug) {
            fetchSeasonAnime(1);
        }
    }, [slug]);

    const goToPage = (page) => {
        if (page !== currentPage) {
            fetchSeasonAnime(page);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const nextPage = () => {
        if (hasNextPage) goToPage(currentPage + 1);
    };

    const prevPage = () => {
        if (hasPrevPage) goToPage(currentPage - 1);
    };

    // Get season icon based on name
    const getSeasonIcon = (name) => {
        if (name?.includes('Winter')) return 'ri-snowflake-line';
        if (name?.includes('Spring')) return 'ri-flower-line';
        if (name?.includes('Summer')) return 'ri-sun-line';
        if (name?.includes('Fall')) return 'ri-leaf-line';
        return 'ri-calendar-line';
    };

    const getSeasonColor = (name) => {
        if (name?.includes('Winter')) return 'from-blue-600 to-cyan-600';
        if (name?.includes('Spring')) return 'from-green-600 to-teal-600';
        if (name?.includes('Summer')) return 'from-yellow-600 to-orange-600';
        if (name?.includes('Fall')) return 'from-orange-600 to-red-600';
        return 'from-blue-900 to-cyan-800';
    };

    const displaySeasonName = seasonInfo?.name || slug?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

    return (
        <div className="min-h-screen bg-gray-900 pb-20">
            {/* Header */}
            <div className={`bg-gradient-to-br ${getSeasonColor(displaySeasonName)} shadow-xl`}>
                <div className="px-5 pt-8 pb-6">
                    <div className="flex items-center gap-3 mb-2">
                        <button
                            onClick={() => navigate(-1)}
                            className="bg-white/10 backdrop-blur rounded-full p-2 border border-white/20 hover:bg-white/20 transition-all active:scale-95"
                        >
                            <i className="ri-arrow-left-line text-white text-xl"></i>
                        </button>
                        <div>
                            <div className="flex items-center gap-2">
                                <i className={`${getSeasonIcon(displaySeasonName)} text-white text-xl`}></i>
                                <h1 className="text-white text-xl font-bold tracking-tight">
                                    {displaySeasonName}
                                </h1>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-white/80 text-xs">Season</span>
                                {seasonInfo && (
                                    <span className="text-white/80 text-xs">
                                        • Halaman {currentPage} dari {totalPages}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="px-4 mt-4">
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
                ) : animeList.length > 0 ? (
                    <>
                        <div className="grid grid-cols-3 gap-3">
                            {animeList.map((anime, idx) => (
                                <Link
                                    key={idx}
                                    to={`/${anime.id}`}
                                    className="bg-gray-800 rounded-xl overflow-hidden hover:border-blue-500/50 border border-gray-700 transition-all active:scale-95 group"
                                >
                                    <div className="relative">
                                        <img
                                            src={anime.image}
                                            alt={anime.title}
                                            className="w-full aspect-[2/3] object-cover"
                                            onError={(e) => {
                                                e.target.src = 'https://placehold.co/200x280/374151/9ca3af?text=No+Img';
                                            }}
                                        />
                                        {anime.rating && (
                                            <div className="absolute top-2 left-2 bg-black/70 backdrop-blur rounded-full px-1.5 py-0.5 flex items-center gap-0.5">
                                                <i className="ri-star-fill text-yellow-400 text-[8px]"></i>
                                                <span className="text-white text-[9px] font-bold">{anime.rating}</span>
                                            </div>
                                        )}
                                        <div className="absolute top-2 right-2 bg-blue-600/90 backdrop-blur px-1.5 py-0.5 rounded text-[9px] font-bold text-white">
                                            {anime.type || 'TV'}
                                        </div>
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-2">
                                            <span className="text-white text-[10px] font-medium bg-blue-600/90 px-2 py-1 rounded-full">
                                                <i className="ri-play-fill text-xs mr-0.5"></i> Detail
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-2">
                                        <h4 className="text-[11px] font-semibold text-gray-200 line-clamp-2 leading-tight min-h-[2.5rem]">
                                            {anime.title}
                                        </h4>
                                        {anime.genres && (
                                            <div className="flex flex-wrap gap-1 mt-1">
                                                {anime.genres.slice(0, 2).map((g, i) => (
                                                    <span key={i} className="text-[8px] text-gray-500 bg-gray-700/50 px-1 py-0.5 rounded">
                                                        {g}
                                                    </span>
                                                ))}
                                                {anime.genres.length > 2 && (
                                                    <span className="text-[8px] text-gray-500">+{anime.genres.length - 2}</span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {/* Pagination */}
                        {(hasPrevPage || hasNextPage) && (
                            <div className="mt-6 flex items-center justify-center gap-3">
                                <button
                                    onClick={prevPage}
                                    disabled={!hasPrevPage}
                                    className={`px-4 py-2 rounded-xl font-medium text-sm transition-all flex items-center gap-1 ${!hasPrevPage
                                            ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                                            : 'bg-gray-800 border border-gray-700 text-blue-400 hover:bg-gray-700 hover:border-blue-500/50 active:scale-95'
                                        }`}
                                >
                                    <i className="ri-arrow-left-s-line text-lg"></i>
                                    Prev
                                </button>

                                <div className="flex items-center gap-1">
                                    <span className="text-xs text-gray-400">Page</span>
                                    <span className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm font-bold">
                                        {currentPage}
                                    </span>
                                    <span className="text-gray-500 text-xs">of {totalPages}</span>
                                </div>

                                <button
                                    onClick={nextPage}
                                    disabled={!hasNextPage}
                                    className={`px-4 py-2 rounded-xl font-medium text-sm transition-all flex items-center gap-1 ${!hasNextPage
                                            ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                                            : 'bg-blue-600 text-white shadow-md shadow-blue-500/30 hover:bg-blue-500 active:scale-95'
                                        }`}
                                >
                                    Next
                                    <i className="ri-arrow-right-s-line text-lg"></i>
                                </button>
                            </div>
                        )}

                        {/* End of results */}
                        {!hasNextPage && animeList.length > 0 && (
                            <div className="mt-4 text-center py-3">
                                <p className="text-xs text-gray-500">
                                    <i className="ri-check-double-line mr-1"></i>
                                    Menampilkan {animeList.length} anime dari season {displaySeasonName} • Halaman terakhir
                                </p>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-12 bg-gray-800/30 rounded-xl">
                        <i className="ri-emotion-sad-line text-5xl text-gray-600"></i>
                        <p className="text-gray-400 mt-3 text-sm">Tidak ada anime dalam season ini</p>
                    </div>
                )}
            </div>

        </div>
    );
}