import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';

export default function SearchPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingPage, setLoadingPage] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasNextPage, setHasNextPage] = useState(false);
    const [hasPrevPage, setHasPrevPage] = useState(false);
    const [totalResults, setTotalResults] = useState(0);
    const [hasSearched, setHasSearched] = useState(false);
    const [searchType, setSearchType] = useState('all');
    const searchInputRef = useRef(null);
    const suggestionsRef = useRef(null);

    // Fungsi untuk mengecek apakah halaman berikutnya ada (force check)
    const checkNextPage = async (query, currentPage) => {
        try {
            // Coba fetch page berikutnya
            const testResponse = await fetch(`https://api-animeinfo.vercel.app/api/search?q=${encodeURIComponent(query)}&page=${currentPage + 1}`);
            const testResult = await testResponse.json();

            // Jika page berikutnya mengembalikan data (meskipun has_next_page false), kita anggap ada
            if (testResult.success && testResult.data.anime_list && testResult.data.anime_list.length > 0) {
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error checking next page:', error);
            return false;
        }
    };

    // Fetch search results dengan page tertentu
    const performSearch = async (query, page = 1, isNewSearch = true) => {
        if (!query.trim()) return;

        if (isNewSearch) {
            setLoading(true);
            setSearchResults([]);
            setCurrentPage(1);
            setShowSuggestions(false);
        } else {
            setLoadingPage(true);
        }

        try {
            const response = await fetch(`https://api-animeinfo.vercel.app/api/search?q=${encodeURIComponent(query)}&page=${page}`);
            const result = await response.json();

            if (result.success) {
                let newResults = result.data.anime_list || [];

                // Filter by type if needed
                if (searchType !== 'all') {
                    newResults = newResults.filter(anime =>
                        anime.type?.toLowerCase() === searchType.toLowerCase()
                    );
                }

                setSearchResults(newResults);
                setTotalResults(result.data.total_results_this_page || newResults.length);
                setCurrentPage(result.pagination.current_page);

                // FORCE CHECK: Cek apakah halaman berikutnya benar-benar ada
                let nextPageExists = result.pagination.has_next_page === true;

                // Jika API bilang false, kita cek manual dengan mencoba fetch page berikutnya
                if (!nextPageExists && result.data.anime_list && result.data.anime_list.length > 0) {
                    const actualNextExists = await checkNextPage(query, page);
                    nextPageExists = actualNextExists;
                }

                setHasNextPage(nextPageExists);
                setHasPrevPage(result.pagination.has_prev_page === true || page > 1);
                setHasSearched(true);
            }
        } catch (error) {
            console.error('Error searching:', error);
        } finally {
            setLoading(false);
            setLoadingPage(false);
        }
    };

    // Go to specific page
    const goToPage = (page) => {
        if (page !== currentPage && searchQuery) {
            performSearch(searchQuery, page, false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    // Next page
    const nextPage = () => {
        if (searchQuery) {
            // Langsung coba ke page berikutnya tanpa bergantung hasNextPage
            goToPage(currentPage + 1);
        }
    };

    // Prev page
    const prevPage = () => {
        if (hasPrevPage && searchQuery) {
            goToPage(currentPage - 1);
        }
    };

    // Fetch suggestions (ketik 2 huruf)
    const fetchSuggestions = useCallback(async (query) => {
        if (query.length < 2) {
            setSuggestions([]);
            return;
        }

        try {
            const response = await fetch(`https://api-animeinfo.vercel.app/api/search?q=${encodeURIComponent(query)}&page=1`);
            const result = await response.json();
            if (result.success) {
                const suggestionList = (result.data.anime_list || []).slice(0, 5);
                setSuggestions(suggestionList);
                setShowSuggestions(true);
            }
        } catch (error) {
            console.error('Error fetching suggestions:', error);
        }
    }, []);

    // Debounce untuk suggestions
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchQuery.length >= 2 && !hasSearched) {
                fetchSuggestions(searchQuery);
            } else if (searchQuery.length < 2) {
                setSuggestions([]);
                setShowSuggestions(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery, fetchSuggestions, hasSearched]);

    // Click outside untuk nutup suggestions
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (suggestionsRef.current && !suggestionsRef.current.contains(event.target) &&
                searchInputRef.current && !searchInputRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            performSearch(searchQuery, 1, true);
        }
    };

    const handleSuggestionClick = (suggestion) => {
        setSearchQuery(suggestion.title);
        performSearch(suggestion.title, 1, true);
    };

    const clearSearch = () => {
        setSearchQuery('');
        setSearchResults([]);
        setHasSearched(false);
        setSuggestions([]);
        setShowSuggestions(false);
        searchInputRef.current?.focus();
    };

    // Trending searches
    const trendingSearches = [
        'One Piece', 'Naruto', 'Jujutsu Kaisen', 'Demon Slayer',
        'Attack on Titan', 'Solo Leveling', 'Bleach', 'My Hero Academia'
    ];

    return (
        <div className="min-h-screen bg-gray-900 pb-20">
            {/* Header */}
            <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-800 shadow-xl">
                <div className="px-5 pt-8 pb-6">
                    <div className="flex items-center gap-3 mb-4">
                        <Link to="/" className="bg-white/10 backdrop-blur rounded-full p-2 border border-white/20 hover:bg-white/20 transition-all active:scale-95 inline-flex">
                            <i className="ri-arrow-left-line text-white text-xl"></i>
                        </Link>
                        <h1 className="text-white text-xl font-bold tracking-tight">Cari Anime</h1>
                    </div>

                    {/* Search Bar */}
                    <div className="relative" ref={suggestionsRef}>
                        <form onSubmit={handleSearch} className="relative">
                            <div className="relative">
                                <i className="ri-search-line absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg"></i>
                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onFocus={() => {
                                        if (suggestions.length > 0) setShowSuggestions(true);
                                    }}
                                    placeholder="Cari anime favoritmu... (min. 2 huruf)"
                                    className="w-full bg-white/10 backdrop-blur border border-white/20 rounded-xl py-3 pl-11 pr-12 text-white placeholder-white/50 focus:outline-none focus:border-blue-400 transition-all"
                                />
                                {searchQuery && (
                                    <button
                                        type="button"
                                        onClick={clearSearch}
                                        className="absolute right-14 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
                                    >
                                        <i className="ri-close-circle-fill text-lg"></i>
                                    </button>
                                )}
                                <button
                                    type="submit"
                                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 rounded-lg p-1.5 hover:bg-blue-500 transition-all active:scale-95"
                                >
                                    <i className="ri-search-line text-white text-lg"></i>
                                </button>
                            </div>
                        </form>

                        {/* Auto-suggest Dropdown */}
                        {showSuggestions && suggestions.length > 0 && !hasSearched && (
                            <div className="absolute z-10 mt-2 w-full bg-gray-800 rounded-xl border border-gray-700 shadow-xl overflow-hidden">
                                <div className="px-3 py-2 border-b border-gray-700">
                                    <span className="text-xs text-gray-400">Rekomendasi</span>
                                </div>
                                {suggestions.map((item, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleSuggestionClick(item)}
                                        className="w-full px-3 py-2 flex items-center gap-3 hover:bg-gray-700 transition-colors text-left"
                                    >
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            className="w-8 h-12 object-cover rounded"
                                            onError={(e) => e.target.src = 'https://placehold.co/32x48/374151/9ca3af?text=No'}
                                        />
                                        <div className="flex-1">
                                            <p className="text-sm text-gray-200 line-clamp-1">{item.title}</p>
                                            <p className="text-xs text-gray-500">{item.type || 'Anime'} • ⭐ {item.rating || '?'}</p>
                                        </div>
                                        <i className="ri-arrow-right-s-line text-gray-500"></i>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Filter Chips */}
                    <div className="flex gap-2 mt-4 overflow-x-auto pb-1 scrollbar-hide">
                        {[
                            { id: 'all', label: 'Semua', icon: 'ri-apps-line' },
                            { id: 'Movie', label: 'Movie', icon: 'ri-movie-line' },
                            { id: 'TV', label: 'TV Series', icon: 'ri-tv-line' },
                            { id: 'Special', label: 'Special', icon: 'ri-star-line' },
                            { id: 'OVA', label: 'OVA', icon: 'ri-disc-line' },
                        ].map((filter) => (
                            <button
                                key={filter.id}
                                onClick={() => {
                                    setSearchType(filter.id === 'all' ? 'all' : filter.id);
                                    if (hasSearched && searchQuery) {
                                        performSearch(searchQuery, 1, true);
                                    }
                                }}
                                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1 whitespace-nowrap ${searchType === (filter.id === 'all' ? 'all' : filter.id)
                                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                                    }`}
                            >
                                <i className={`${filter.icon} text-xs`}></i>
                                {filter.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="px-4 mt-4">
                {/* Hasil Pencarian */}
                {hasSearched && (
                    <div className="mb-4">
                        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                            <h3 className="text-sm font-bold text-gray-200">
                                <i className="ri-search-line mr-1 text-blue-400"></i>
                                Hasil "{searchQuery}"
                                {totalResults > 0 && (
                                    <span className="ml-2 text-xs text-gray-500 font-normal">(Halaman {currentPage})</span>
                                )}
                            </h3>
                            <button
                                onClick={clearSearch}
                                className="text-xs text-gray-400 hover:text-blue-400 transition flex items-center gap-1"
                            >
                                <i className="ri-refresh-line"></i>
                                Baru
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
                        ) : searchResults.length > 0 ? (
                            <>
                                <div className="grid grid-cols-3 gap-3">
                                    {searchResults.map((anime, idx) => (
                                        <div
                                            key={`${anime.id}-${idx}`}
                                            onClick={() => {
                                                if (anime.url) window.open(anime.url, '_blank');
                                            }}
                                            className="bg-gray-800 rounded-xl overflow-hidden cursor-pointer active:scale-95 transition-all duration-200 border border-gray-700 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10 group"
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
                                                {anime.rating && anime.rating !== 'N/A' && (
                                                    <div className="absolute top-2 left-2 bg-black/70 backdrop-blur rounded-full px-1.5 py-0.5 flex items-center gap-0.5">
                                                        <i className="ri-star-fill text-yellow-400 text-[8px]"></i>
                                                        <span className="text-white text-[9px] font-bold">{anime.rating}</span>
                                                    </div>
                                                )}
                                                <div className="absolute top-2 right-2 bg-blue-600/90 backdrop-blur px-1.5 py-0.5 rounded text-[9px] font-bold text-white">
                                                    {anime.type || 'Anime'}
                                                </div>
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-2">
                                                    <span className="text-white text-[10px] font-medium bg-blue-600/90 px-2 py-1 rounded-full">
                                                        <i className="ri-play-fill text-xs mr-0.5"></i> Tonton
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="p-2">
                                                <h4 className="text-[11px] font-semibold text-gray-200 line-clamp-2 leading-tight min-h-[2.5rem]">
                                                    {anime.title}
                                                </h4>
                                                <p className="text-[9px] text-gray-500 mt-1 flex items-center gap-1">
                                                    <i className="ri-file-list-line text-[8px]"></i>
                                                    {anime.type || 'Anime'}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Pagination Navigation - TOMBOL PAGE NEXT/PREV */}
                                {/* Tampilkan NEXT PAGE selalu jika ada kemungkinan page berikutnya */}
                                <div className="mt-6 flex items-center justify-center gap-3">
                                    <button
                                        onClick={prevPage}
                                        disabled={!hasPrevPage || loadingPage}
                                        className={`px-4 py-2 rounded-xl font-medium text-sm transition-all flex items-center gap-1 ${!hasPrevPage || loadingPage
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
                                        {/* Tampilkan indikator Next Page tersedia */}
                                        <button
                                            onClick={nextPage}
                                            disabled={loadingPage}
                                            className="text-xs text-gray-400 hover:text-blue-400 transition flex items-center gap-0.5"
                                        >
                                            <i className="ri-arrow-right-s-line"></i>
                                        </button>
                                    </div>

                                    <button
                                        onClick={nextPage}
                                        disabled={loadingPage}
                                        className={`px-4 py-2 rounded-xl font-medium text-sm transition-all flex items-center gap-1 ${loadingPage
                                                ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                                                : 'bg-blue-600 text-white shadow-md shadow-blue-500/30 hover:bg-blue-500 active:scale-95'
                                            }`}
                                    >
                                        Next
                                        <i className="ri-arrow-right-s-line text-lg"></i>
                                    </button>
                                </div>

                                {/* Loading indicator saat pindah page */}
                                {loadingPage && (
                                    <div className="mt-4 text-center">
                                        <div className="inline-flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-full">
                                            <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                                            <span className="text-xs text-gray-400">Memuat halaman {currentPage + 1}...</span>
                                        </div>
                                    </div>
                                )}

                                {/* Info jika tidak ada next page (setelah dicoba) */}
                                {!hasNextPage && searchResults.length > 0 && (
                                    <div className="mt-4 text-center py-3">
                                        <p className="text-xs text-gray-500">
                                            <i className="ri-check-double-line mr-1"></i>
                                            Menampilkan {searchResults.length} hasil • Halaman terakhir
                                        </p>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center py-12 bg-gray-800/50 rounded-2xl">
                                <i className="ri-emotion-sad-line text-5xl text-gray-600"></i>
                                <p className="text-gray-400 mt-3 text-sm">Tidak ada hasil untuk "{searchQuery}"</p>
                                <p className="text-gray-500 text-xs mt-1">Coba dengan kata kunci lain</p>
                                <button
                                    onClick={clearSearch}
                                    className="mt-4 px-4 py-2 bg-gray-800 rounded-lg text-xs text-blue-400 hover:bg-gray-700 transition"
                                >
                                    <i className="ri-search-line mr-1"></i>
                                    Cari lagi
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Belum Search - Halaman Awal */}
                {!hasSearched && (
                    <div>
                        <div className="mb-8">
                            <div className="flex items-center gap-2 mb-3">
                                <i className="ri-fire-line text-orange-500 text-sm"></i>
                                <h3 className="text-sm font-bold text-gray-200">Trending Pencarian</h3>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {trendingSearches.map((trend) => (
                                    <button
                                        key={trend}
                                        onClick={() => {
                                            setSearchQuery(trend);
                                            performSearch(trend, 1, true);
                                        }}
                                        className="px-3 py-1.5 bg-gray-800 rounded-full text-xs text-gray-300 hover:bg-gray-700 hover:text-blue-400 transition-all flex items-center gap-1"
                                    >
                                        <i className="ri-fire-line text-orange-400 text-[10px]"></i>
                                        {trend}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                            <div className="flex items-start gap-3">
                                <div className="bg-blue-600/20 rounded-full p-2">
                                    <i className="ri-lightbulb-flash-line text-blue-400 text-lg"></i>
                                </div>
                                <div>
                                    <h4 className="text-sm font-semibold text-gray-200 mb-1">Tips Pencarian</h4>
                                    <ul className="text-xs text-gray-400 space-y-1">
                                        <li>• <i className="ri-check-line text-green-500 text-[10px]"></i> Ketik minimal 2 huruf untuk rekomendasi otomatis</li>
                                        <li>• <i className="ri-check-line text-green-500 text-[10px]"></i> Gunakan filter Movie/TV Series untuk hasil lebih spesifik</li>
                                        <li>• <i className="ri-check-line text-green-500 text-[10px]"></i> Klik Next untuk halaman berikutnya (One Piece punya 2 halaman!)</li>
                                        <li>• <i className="ri-check-line text-green-500 text-[10px]"></i> Klik card anime untuk nonton langsung</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

        </div>
    );
}