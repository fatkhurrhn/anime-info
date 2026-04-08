import React from 'react';

export default function BottomNav({ active = 'home' }) {
    const navItems = [
        { id: 'home', icon: 'ri-home-5-line', label: 'Beranda' },
        { id: 'search', icon: 'ri-search-line', label: 'Cari' },
        { id: 'schedule', icon: 'ri-calendar-line', label: 'Jadwal' },
        { id: 'favorite', icon: 'ri-heart-line', label: 'Favorit' },
        { id: 'profile', icon: 'ri-user-line', label: 'Profil' },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-lg border-t border-gray-800 px-4 py-2 z-20 shadow-lg">
            <div className="flex items-center justify-between max-w-md mx-auto">
                {navItems.map((item) => (
                    <div
                        key={item.id}
                        className={`flex flex-col items-center gap-0.5 transition-all duration-200 cursor-pointer ${active === item.id
                                ? 'text-purple-400'
                                : 'text-gray-500'
                            }`}
                    >
                        <i className={`${item.icon} text-xl ${active === item.id ? 'font-bold' : ''}`}></i>
                        <span className={`text-[10px] font-medium ${active === item.id ? 'text-purple-400' : 'text-gray-500'}`}>
                            {item.label}
                        </span>
                        {active === item.id && (
                            <div className="w-1 h-1 bg-purple-400 rounded-full mt-0.5"></div>
                        )}
                    </div>
                ))}
            </div>
        </nav>
    );
}