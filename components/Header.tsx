
import React from 'react';
import { UserProfile, Lang } from '../types';

interface HeaderProps {
  profile: UserProfile;
  onGoHome: () => void;
  onLangChange: (lang: Lang) => void;
  theme: 'night' | 'day';
  onThemeToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ profile, onGoHome, onLangChange, theme, onThemeToggle }) => {
  return (
    <header className="fixed top-0 left-0 right-0 h-14 bg-gradient-to-b from-[#111633] to-[#0B1020] border-b border-[var(--vip-main)]/30 flex items-center justify-between px-4 z-50 shadow-[0_2px_15px_rgba(0,0,0,0.8)]">
      <div className="flex items-center gap-4">
        <div 
          className="font-orbitron text-xl text-[var(--vip-main)] cursor-pointer flex items-center gap-2 group transition-all"
          onClick={onGoHome}
        >
          <span className="bg-[var(--vip-main)] text-white px-1 rounded text-[10px] font-bold animate-pulse">LIVE</span>
          <span className="group-hover:text-[#FFD700] transition-colors tracking-tighter">SPIN<span className="text-[#FFD700]">WORLD</span> 777</span>
        </div>
      </div>
      
      <div className="flex items-center gap-2 md:gap-4">
        {/* Jackpot Pool */}
        <div className="hidden lg:flex flex-col items-center bg-black/40 px-4 py-0.5 rounded border border-[#FFD700]/30 shadow-[0_0_10px_rgba(255,215,0,0.1)]">
           <span className="text-[8px] text-[#FFD700] font-bold font-orbitron tracking-widest">JACKPOT</span>
           <span className="text-sm font-rajdhani font-black text-[#FFD700] tracking-tighter">
             {profile.jackpotPool.toLocaleString()}
           </span>
        </div>

        {/* Credit Display */}
        <div className="bg-black/60 px-2 md:px-3 py-1 rounded border border-[#FFD700]/50 flex items-center gap-2">
          <span className="hidden md:inline text-[#FFD700] text-[9px] font-bold font-orbitron">CREDIT</span>
          <span className="font-rajdhani font-bold text-[#EAEAEA] text-base md:text-lg">
            {profile.coins.toLocaleString()}
          </span>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={onThemeToggle}
          className="relative w-14 h-7 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 p-0.5 overflow-hidden group"
          style={{
            boxShadow: theme === 'night' 
              ? '0 0 20px rgba(139, 92, 246, 0.6), inset 0 0 10px rgba(139, 92, 246, 0.3)'
              : '0 0 20px rgba(251, 191, 36, 0.6), inset 0 0 10px rgba(251, 191, 36, 0.3)'
          }}
        >
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div 
              className="absolute inset-[-2px] rounded-full"
              style={{
                background: 'conic-gradient(from 0deg, #FFD700, #FF2E63, #00F0FF, #FFD700)',
                animation: 'rotateBorder 3s linear infinite'
              }}
            />
          </div>
          
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

        {/* Language Selector */}
        <select 
          value={profile.lang} 
          onChange={(e) => onLangChange(e.target.value as Lang)}
          className="bg-black/60 border border-white/20 text-white text-[10px] rounded px-1.5 py-1 font-bold outline-none focus:border-[var(--vip-main)] transition-colors"
        >
          <option value="ko">KR</option>
          <option value="ja">JP</option>
          <option value="en">US</option>
          <option value="zh">CN</option>
        </select>
        
        {/* Profile */}
        <div className="hidden sm:flex items-center gap-2 border-l border-white/10 pl-3">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-[#1A1F3A] to-[#0B1020] border border-[var(--vip-main)]/50 flex items-center justify-center text-sm">
            👤
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
