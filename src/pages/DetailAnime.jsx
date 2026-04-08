import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

export default function Detail() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [anime, setAnime] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showFullSynopsis, setShowFullSynopsis] = useState(false);

    useEffect(() => {
        const fetchDetail = async () => {
            setLoading(true);
            try {
                const response = await fetch(`https://api-animeinfo.vercel.app/api/detail/${slug}`);
                const result = await response.json();

                if (result.success) {
                    setAnime(result.data);
                } else {
                    console.error('Detail not found');
                    navigate('/');
                }
            } catch (error) {
                console.error('Error fetching detail:', error);
                navigate('/');
            } finally {
                setLoading(false);
            }
        };

        if (slug) {
            fetchDetail();
        }
    }, [slug, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 pb-20">
                <div className="animate-pulse">
                    <div className="bg-gray-800 h-80 w-full"></div>
                    <div className="px-4 mt-4">
                        <div className="h-6 bg-gray-800 rounded w-3/4 mb-2"></div>
                        <div className="h-4 bg-gray-800 rounded w-1/2 mb-4"></div>
                        <div className="flex gap-2 mb-4">
                            <div className="h-6 bg-gray-800 rounded-full w-20"></div>
                            <div className="h-6 bg-gray-800 rounded-full w-20"></div>
                        </div>
                        <div className="h-24 bg-gray-800 rounded w-full"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!anime) return null;

    // Synopsis truncated
    const synopsisText = anime.synopsis || 'Sinopsis belum tersedia untuk anime ini.';
    const truncatedSynopsis = synopsisText.length > 150 ? synopsisText.substring(0, 150) + '...' : synopsisText;

    return (
        <div className="min-h-screen bg-gray-900 pb-20">
            {/* Hero Section with Full Width Poster */}
            <div className="relative">
                {/* Background Image */}
                <div
                    className="absolute inset-0 bg-cover bg-top bg-no-repeat"
                    style={{ backgroundImage: `url(${anime.image})` }}
                />
                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/80 to-gray-900" />

                {/* Poster Full Width */}
                <div className="relative">
                    <img
                        src={anime.image}
                        alt={anime.title}
                        className="w-full aspect-[16/9] object-cover object-top"
                        onError={(e) => {
                            e.target.src = 'https://placehold.co/800x450/374151/9ca3af?text=No+Image';
                        }}
                    />
                </div>

                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="absolute top-4 left-4 z-10 bg-black/50 backdrop-blur rounded-full p-2 border border-white/20 hover:bg-black/70 transition-all active:scale-95"
                >
                    <i className="ri-arrow-left-line text-white text-xl"></i>
                </button>
            </div>

            {/* Content Section */}
            <div className="px-4 -mt-6 relative z-10">
                {/* Title - clamp 3 lines */}
                <h1 className="text-white font-bold text-xl leading-tight line-clamp-3 mb-2">
                    {anime.title}
                </h1>

                {/* Info Row: Season, Score, Type, Studio */}
                <div className="flex flex-wrap items-center gap-2 mb-3">
                    {/* Season - clickable */}
                    {anime.season && (
                        <Link
                            to={`/season/${anime.season.slug}`}
                            className="bg-blue-600/20 text-blue-400 text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-0.5 hover:bg-blue-600/30 transition"
                        >
                            <i className="ri-calendar-line text-[10px]"></i>
                            {anime.season.name}
                        </Link>
                    )}

                    {/* Score */}
                    {anime.score && (
                        <span className="bg-yellow-500/20 text-yellow-400 text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-0.5">
                            <i className="ri-star-fill text-[10px]"></i>
                            {anime.score}
                        </span>
                    )}

                    {/* Type */}
                    <span className="bg-purple-500/20 text-purple-400 text-[10px] font-bold px-2 py-1 rounded-full">
                        {anime.type || 'Anime'}
                    </span>

                    {/* Studio - clickable */}
                    {anime.details?.studios && (
                        <Link
                            to={`/studio/${encodeURIComponent(anime.details.studios.name.toLowerCase().replace(/\s+/g, '-'))}`}
                            className="bg-gray-700/50 text-gray-300 text-[10px] font-medium px-2 py-1 rounded-full flex items-center gap-0.5 hover:bg-gray-700 transition"
                        >
                            <i className="ri-building-line text-[10px]"></i>
                            {anime.details.studios.name}
                        </Link>
                    )}
                </div>


                {/* Genres - clickable */}
                {anime.genres && anime.genres.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                        
                        {anime.genres.map((genre, idx) => (
                            <Link
                                key={idx}
                                to={`/genre/${genre.slug}`}
                                className="bg-gray-800 text-gray-300 text-[10px] px-2.5 py-1 rounded-full hover:bg-gray-700 hover:text-blue-400 transition"
                            >
                                {genre.name}
                            </Link>
                        ))}
                    </div>
                )}

                {/* Synopsis Section with Read More */}
                <div className="bg-gray-800/50 rounded-xl p-4 mb-4">
                    <p className="text-gray-300 text-[11px]">tayang {anime.details.aired}</p>
                    <p className="text-gray-300 text-[11px]">durasi {anime.duration}</p>
                    <h3 className="text-sm font-semibold text-gray-200 mb-2 flex items-center gap-1">
                        <i className="ri-file-text-line text-blue-400 text-sm"></i>
                        Sinopsis
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                        {showFullSynopsis ? synopsisText : truncatedSynopsis}
                    </p>
                    {synopsisText.length > 150 && (
                        <button
                            onClick={() => setShowFullSynopsis(!showFullSynopsis)}
                            className="text-blue-400 text-xs font-medium mt-2 hover:text-blue-300 transition flex items-center gap-0.5"
                        >
                            {showFullSynopsis ? (
                                <>
                                    <i className="ri-arrow-up-s-line"></i>
                                    Tampilkan Sedikit
                                </>
                            ) : (
                                <>
                                    <i className="ri-arrow-down-s-line"></i>
                                    Baca Selengkapnya
                                </>
                            )}
                        </button>
                    )}
                </div>

                {/* Related Series (Recommendations) - 3 Grid */}
                {anime.recommendations?.list && anime.recommendations.list.length > 0 && (
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm font-semibold text-gray-200 flex items-center gap-1">
                                <i className="ri-shuffle-line text-blue-400 text-sm"></i>
                                Related Series
                            </h3>
                            <span className="text-[10px] text-gray-500">{anime.recommendations.total} anime</span>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                            {anime.recommendations.list.slice(0, 9).map((rec, idx) => (
                                <Link
                                    key={idx}
                                    to={`/${rec.id}`}
                                    className="bg-gray-800 rounded-xl overflow-hidden hover:border-blue-500/50 border border-gray-700 transition-all active:scale-95 group"
                                >
                                    <div className="relative">
                                        <img
                                            src={rec.image}
                                            alt={rec.title}
                                            className="w-full aspect-[2/3] object-cover"
                                            onError={(e) => {
                                                e.target.src = 'https://placehold.co/200x280/374151/9ca3af?text=No+Img';
                                            }}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-2">
                                            <span className="text-white text-[9px] font-medium bg-blue-600/90 px-2 py-0.5 rounded-full">
                                                <i className="ri-play-fill text-[8px] mr-0.5"></i> Detail
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-2">
                                        <h4 className="text-[10px] font-semibold text-gray-200 line-clamp-2 leading-tight min-h-[2rem]">
                                            {rec.title}
                                        </h4>
                                        <div className="flex items-center gap-1 mt-1">
                                            {rec.rating && (
                                                <span className="text-yellow-400 text-[8px] flex items-center gap-0.5">
                                                    <i className="ri-star-fill text-[6px]"></i>
                                                    {rec.rating}
                                                </span>
                                            )}
                                            <span className="text-gray-500 text-[8px]">{rec.type}</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* Episodes Section */}
                {anime.episodes?.list && anime.episodes.list.length > 0 && (
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm font-semibold text-gray-200 flex items-center gap-1">
                                <i className="ri-movie-line text-blue-400 text-sm"></i>
                                Daftar Episode
                            </h3>
                            <span className="text-[10px] text-gray-500">{anime.episodes.total || `${anime.episodes.list.length} episode`}</span>
                        </div>
                        <div className="space-y-2">
                            {anime.episodes.list.slice(0, 10).map((ep, idx) => (
                                <a
                                    key={idx}
                                    href={ep.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-between bg-gray-800/50 rounded-xl p-3 hover:bg-gray-750 transition-all border border-gray-700 hover:border-blue-500/50 group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-blue-600/20 rounded-full flex items-center justify-center group-hover:bg-blue-600/40 transition">
                                            <i className="ri-play-fill text-blue-400 text-sm"></i>
                                        </div>
                                        <div>
                                            <p className="text-white text-sm font-medium">Episode {ep.episode}</p>
                                            {ep.release_date && (
                                                <p className="text-gray-500 text-[10px]">{ep.release_date}</p>
                                            )}
                                        </div>
                                    </div>
                                    <i className="ri-arrow-right-s-line text-gray-500 group-hover:text-blue-400 transition"></i>
                                </a>
                            ))}
                        </div>
                        {anime.episodes.list.length > 10 && (
                            <button className="w-full mt-3 py-2 text-center text-xs text-blue-400 bg-gray-800/30 rounded-xl hover:bg-gray-800/50 transition">
                                Lihat semua episode ({anime.episodes.list.length})
                            </button>
                        )}
                    </div>
                )}

                {/* No Episodes */}
                {(!anime.episodes?.list || anime.episodes.list.length === 0) && (
                    <div className="bg-gray-800/30 rounded-xl p-6 text-center mb-6">
                        <i className="ri-error-warning-line text-3xl text-gray-600"></i>
                        <p className="text-gray-400 text-sm mt-2">Belum ada episode tersedia</p>
                    </div>
                )}
            </div>

        </div>
    );
}