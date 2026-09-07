import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { BottomNav } from './components/layout/BottomNav';
import { PokedexPage } from './pages/PokedexPage';
import { CapturedPage } from './pages/CapturedPage';
import { PokemonDetailPage } from './pages/PokemonDetailPage';

export const App: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <Header />
      
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 pt-6 pb-24">
        <Routes>
          <Route path="/" element={<PokedexPage />} />
          <Route path="/captured" element={<CapturedPage />} />
          <Route path="/pokemon/:id" element={<PokemonDetailPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <BottomNav />
    </div>
  );
};

export default App;
