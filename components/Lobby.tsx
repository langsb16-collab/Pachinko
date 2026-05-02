
import React, { useState, useEffect } from 'react';
import { MACHINES } from '../constants';
import { Machine, UserProfile } from '../types';
import { i18n } from '../i18n';
import MachineCard from './MachineCard';

interface LobbyProps {
  profile: UserProfile;
  onSelectMachine: (machine: Machine) => void;
  theme: 'night' | 'day';
}

const Lobby: React.FC<LobbyProps> = ({ profile, onSelectMachine, theme }) => {
  const t = i18n[profile.lang];
  const [activeTab, setActiveTab] = useState(t.lobby);
  const tabs = [t.lobby, t.online, t.bonus];
  const [tickerIndex, setTickerIndex] = useState(0);
  
  const news = [
    t.guest_mode,
    `[WINNER] SEAT 103: GALAXY RUSH JACKPOT! +88,200 COINS!`,
    `[EVENT] ${t.grand_jackpot} IS NOW ACTIVE!`,
    `[TIP] ANALYZE THE SLUMP GRAPHS FOR HIGH-SETTING MACHINES.`
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setTickerIndex(prev => (prev + 1) % news.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [news.length]);

  return (
    <div className="pt-16 pb-24 px-4 max-w-[1400px] mx-auto min-h-screen">
      {/* News Ticker */}
      <div className="mt-4 bg-black/80 border-y border-[var(--vip-main)]/20 py-1 flex items-center gap-4 overflow-hidden relative">
        <div className="bg-[var(--vip-main)] text-white text-[10px] font-bold px-3 py-0.5 z-10 skew-x-[-20deg] ml-2 font-orbitron">{t.news_flash}</div>
        <div className="flex-1 relative h-4 overflow-hidden">
          <div 
            key={tickerIndex}
            className="absolute inset-0 text-[10px] text-[#00F0FF] font-bold flex items-center transition-all duration-500 transform"
            style={{ animation: 'slideUpNews 0.4s ease-out' }}
          >
            {news[tickerIndex]}
          </div>
        </div>
        
        {/* Theme Toggle */}
        <button
          onClick={() => setTheme(prev => prev === 'night' ? 'day' : 'night')}
          className="relative mr-4 w-14 h-7 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 p-0.5 overflow-hidden group"
          style={{
            boxShadow: theme === 'night' 
              ? '0 0 20px rgba(139, 92, 246, 0.6), inset 0 0 10px rgba(139, 92, 246, 0.3)'
              : '0 0 20px rgba(251, 191, 36, 0.6), inset 0 0 10px rgba(251, 191, 36, 0.3)'
          }}
        >
          {/* Rotating Border Animation */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div 
              className="absolute inset-[-2px] rounded-full"
              style={{
                background: 'conic-gradient(from 0deg, #FFD700, #FF2E63, #00F0FF, #FFD700)',
                animation: 'rotateBorder 3s linear infinite'
              }}
            />
          </div>
          
          {/* Inner Button */}
          <div className="relative w-full h-full bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-between px-1">
            <div 
              className="absolute w-5 h-5 rounded-full transition-all duration-300 shadow-lg"
              style={{
                left: theme === 'night' ? '2px' : 'calc(100% - 22px)',
                background: theme === 'night' 
                  ? 'linear-gradient(135deg, #8B5CF6, #EC4899)'
                  : 'linear-gradient(135deg, #FBBF24, #F59E0B)',
                boxShadow: theme === 'night'
                  ? '0 0 15px rgba(139, 92, 246, 0.8)'
                  : '0 0 15px rgba(251, 191, 36, 0.8)'
              }}
            />
            <span className="text-[10px] ml-1 z-10">{theme === 'night' ? '🌙' : '☀️'}</span>
            <span className="text-[10px] mr-1 z-10">{theme === 'day' ? '☀️' : '🌙'}</span>
          </div>
        </button>
      </div>

      <style>{`
        @keyframes slideUpNews {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes rotateBorder {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

      {/* Hero Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mt-6">
        <div className="lg:col-span-3 relative h-48 md:h-64 rounded-lg overflow-hidden border border-white/10 group shadow-2xl">
          <img 
            src="https://images.unsplash.com/photo-1541348263662-e0c86433ec10?q=80&w=2000&auto=format&fit=crop" 
            alt="Arcade Campaign" 
            className="w-full h-full object-cover opacity-70 transition-transform duration-[15s] scale-110 group-hover:scale-100"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
          <div className="absolute bottom-6 left-8 z-10">
            <h2 className="font-orbitron text-2xl md:text-5xl mb-1 text-white drop-shadow-[0_2px_10px_rgba(255,46,99,0.5)] italic font-black tracking-tighter">
              {t.grand_jackpot}
            </h2>
            <p className="text-[#00F0FF] font-rajdhani text-lg md:text-xl font-bold tracking-widest flex items-center gap-2">
              <span className="bg-[#00F0FF] text-black text-[10px] px-1 rounded">LIVE</span> {t.live_access}
            </p>
          </div>
        </div>
        
        <div className="hidden lg:flex flex-col gap-4">
           <div className="flex-1 bg-gradient-to-br from-[#1A1F3A] to-[#0B1020] border border-[#FFD700]/30 rounded-lg p-4 flex flex-col justify-center text-center">
              <div className="text-[#FFD700] text-[10px] font-bold font-orbitron mb-1 tracking-tighter uppercase">{t.free_credit}</div>
              <div className="text-2xl font-black text-white font-rajdhani mb-2">+5000</div>
              <button className="bg-[#FFD700] text-black py-1.5 rounded text-[10px] font-bold hover:bg-white transition-all shadow-[0_0_15px_rgba(255,215,0,0.3)]">{t.claim_now}</button>
           </div>
           <div className="flex-1 bg-gradient-to-br from-[#1A1F3A] to-[#0B1020] border border-[var(--vip-main)]/30 rounded-lg p-4 flex flex-col justify-center text-center">
              <div className="text-[var(--vip-main)] text-[10px] font-bold font-orbitron mb-1 tracking-tighter uppercase">VIP RANKING</div>
              <div className="text-[10px] text-gray-400 mb-2">Player Leaderboard</div>
              <button className="bg-white/5 border border-white/20 text-white py-1.5 rounded text-[10px] font-bold hover:bg-white/10 transition-all">{t.view_rank}</button>
           </div>
        </div>
      </div>

      {/* Floor Selection */}
      <div className="mt-8 flex flex-col md:flex-row items-center justify-between border-b border-[var(--vip-main)]/20 pb-2 mb-6">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide w-full md:w-auto">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap px-6 py-2 rounded-t text-[11px] font-bold font-orbitron transition-all relative ${
                activeTab === tab 
                  ? 'bg-gradient-to-t from-[#1A1F3A] to-[#111633] text-[#FFD700] border-t border-x border-[#FFD700]/50' 
                  : 'text-gray-500 hover:text-white'
              }`}
            >
              {tab}
              {activeTab === tab && <div className="absolute bottom-[-2px] left-0 right-0 h-1 bg-[#FFD700]"></div>}
            </button>
          ))}
        </div>
        <div className="hidden md:flex items-center gap-4 text-[10px] font-bold font-rajdhani">
           <div className="flex items-center gap-1.5">
             <span className="text-gray-500">{t.system}:</span>
             <span className="text-green-500 animate-pulse">{t.stable}</span>
           </div>
           <div className="flex items-center gap-1.5">
             <span className="text-gray-500">{t.lobby}:</span>
             <span className="text-[#00F0FF]">12,942 {t.online}</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
        {MACHINES.map(m => (
          <MachineCard key={m.id} machine={m} onSelect={onSelectMachine} />
        ))}
      </div>
    </div>
  );
};

export default Lobby;
