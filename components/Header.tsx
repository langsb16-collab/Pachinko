
import React from 'react';
import { UserProfile, Lang } from '../types';

interface HeaderProps {
  profile: UserProfile;
  onGoHome: () => void;
  onLangChange: (lang: Lang) => void;
}

const Header: React.FC<HeaderProps> = ({ profile, onGoHome, onLangChange }) => {
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
