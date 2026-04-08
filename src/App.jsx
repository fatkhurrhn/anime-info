import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AutoToTop from './components/AutoToTop';
import SearchPage from './pages/Search';
import Detail from './pages/DetailAnime';
import Genres from './pages/Genres';
import DetailGenre from './pages/DetailGenre';
import Studios from './pages/Studios';
import DetailStudio from './pages/DetailStudio';
import Seasons from './pages/Seasons';
import DetailSeason from './pages/DetailSeason';

function App() {
  return (
    <Router>
      <AutoToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/:slug" element={<Detail />} />
        <Route path="/genres" element={<Genres />} />
        <Route path="/genre/:slug" element={<DetailGenre />} />
        <Route path="/studios" element={<Studios />} />
        <Route path="/studio/:slug" element={<DetailStudio />} />
        <Route path="/seasons" element={<Seasons />} />
        <Route path="/season/:slug" element={<DetailSeason />} />
      </Routes>
    </Router>
  );
}

export default App;
