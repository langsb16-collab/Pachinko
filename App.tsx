
import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import Lobby from './components/Lobby';
import SlotGame from './components/SlotGame';
import { View, UserProfile, Machine, Lang } from './types';
import { VIP_TIERS } from './constants';
import { i18n } from './i18n';

const App: React.FC = () => {
  const [view, setView] = useState<View>('LOBBY');
  const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null);
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('spinworld_profile');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (!parsed.lang) parsed.lang = 'ko';
        if (!parsed.jackpotPool) parsed.jackpotPool = 250000;
        return parsed;
      } catch (e) { console.error(e); }
    }
    return {
      coins: 10000,
      xp: 0,
      level: 1,
      vipTier: 'BRONZE',
      dailyBonusClaimed: false,
      totalSpins: 0,
      totalWins: 0,
      totalBet: 0,
      lang: 'ko',
      jackpotPool: 250000
    };
  });

  // Background Particles Logic
  useEffect(() => {
    const canvas = document.getElementById('bgFX') as HTMLCanvasElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: any[] = [];
    let animationId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    const createParticle = () => {
      const mode = profile.lang;
      if (mode === 'ja') { // 🌸 Cherry Blossoms
        return {
          x: Math.random() * canvas.width,
          y: -20,
          size: Math.random() * 5 + 3,
          speedY: Math.random() * 1.5 + 0.5,
          drift: Math.random() * 1 - 0.5,
          color: "rgba(255,182,193,0.7)",
          type: 'flower'
        };
      }
      if (mode === 'zh') { // 🔥 Gold Fire
        return {
          x: Math.random() * canvas.width,
          y: canvas.height + 20,
          size: Math.random() * 3 + 1,
          speedY: -(Math.random() * 2 + 1),
          drift: Math.random() * 0.4 - 0.2,
          color: "rgba(255,215,0,0.8)",
          type: 'spark'
        };
      }
      if (mode === 'en') { // 💡 Neon Streaks
        return {
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: 2,
          speedY: 0,
          drift: Math.random() * 3 + 2,
          color: "rgba(0,191,255,0.4)",
          type: 'streak'
        };
      }
      // 💜 Korea Aurora
      return {
        x: Math.random() * canvas.width,
        y: canvas.height + 20,
        size: Math.random() * 4 + 2,
        speedY: -(Math.random() * 1 + 0.5),
        drift: Math.random() * 0.6 - 0.3,
        color: "rgba(123,63,228,0.4)",
        type: 'glow'
      };
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (particles.length < 100) particles.push(createParticle());

      particles.forEach((p, idx) => {
        p.y += p.speedY;
        p.x += p.drift;

        ctx.beginPath();
        if (p.type === 'streak') {
           ctx.fillStyle = p.color;
           ctx.fillRect(p.x, p.y, 80, 1);
        } else {
           ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
           ctx.fillStyle = p.color;
           ctx.fill();
        }

        if (p.y < -50 || p.y > canvas.height + 50 || p.x > canvas.width + 100 || p.x < -100) {
          particles.splice(idx, 1);
        }
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, [profile.lang]);

  useEffect(() => {
    localStorage.setItem('spinworld_profile', JSON.stringify(profile));
    applyCountryTheme(profile.lang);
  }, [profile]);

  useEffect(() => {
    if (view === 'GAME' && window.innerWidth <= 768) {
      document.body.classList.add('mobile-immersive');
    } else {
      document.body.classList.remove('mobile-immersive');
    }
    window.scrollTo(0, 0);
  }, [view]);

  const applyCountryTheme = (lang: Lang) => {
    const root = document.documentElement;
    const colors: Record<Lang, { main: string; glow: string }> = {
      'ko': { main: '#7B3FE4', glow: 'rgba(123,63,228,0.6)' },
      'ja': { main: '#FF2E63', glow: 'rgba(255,46,99,0.6)' },
      'en': { main: '#00BFFF', glow: 'rgba(0,191,255,0.6)' },
      'zh': { main: '#FFD700', glow: 'rgba(255,215,0,0.7)' }
    };
    const c = colors[lang];
    root.style.setProperty('--vip-main', c.main);
    root.style.setProperty('--vip-glow', c.glow);
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile(prev => {
      const newProfile = { ...prev, ...updates };
      const newLevel = Math.floor(newProfile.xp / 1000) + 1;
      const currentTier = [...VIP_TIERS].reverse().find(t => newProfile.xp >= t.minXp);
      return { 
        ...newProfile, 
        level: newLevel,
        vipTier: currentTier?.name || 'BRONZE'
      };
    });
  };

  const handleLangChange = (lang: Lang) => {
    updateProfile({ lang });
  };

  const handleSelectMachine = (machine: Machine) => {
    setSelectedMachine(machine);
    setView('GAME');
  };

  const handleGoHome = () => {
    setView('LOBBY');
    setSelectedMachine(null);
  };

  const t = i18n[profile.lang];

  return (
    <div className="min-h-screen bg-[#0B1020] text-[#EAEAEA] transition-colors duration-500">
      <Header profile={profile} onGoHome={handleGoHome} onLangChange={handleLangChange} />
      
      <main className="transition-all duration-300 relative z-10">
        {view === 'LOBBY' ? (
          <Lobby profile={profile} onSelectMachine={handleSelectMachine} />
        ) : (
          selectedMachine && (
            <SlotGame 
              machine={selectedMachine} 
              profile={profile} 
              onUpdateProfile={updateProfile} 
            />
          )
        )}
      </main>

      {/* Winner Ticker */}
      <div id="winnerTicker" className="fixed bottom-16 left-0 right-0 h-8 bg-black/40 backdrop-blur-md border-y border-white/5 flex items-center overflow-hidden z-40">
        <div className="flex whitespace-nowrap animate-[tickerMove_30s_linear_infinite] hover:[animation-play-state:paused] cursor-default">
           {[...Array(20)].map((_, i) => (
             <span key={i} className="mx-8 text-[11px] font-bold font-rajdhani text-gray-400">
               🌍 <span className="text-white">GUEST_{Math.floor(1000 + Math.random() * 9000)}</span> WON <span className="text-[#FFD700]">{Math.floor(Math.random() * 50000).toLocaleString()}</span> COINS ON <span className="text-[var(--vip-main)]">PHARAOH GOLD</span>
             </span>
           ))}
        </div>
      </div>

      <footer className="fixed bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black to-[#111633] border-t border-[var(--vip-main)]/30 flex items-center justify-around md:hidden z-50">
        <button onClick={handleGoHome} className={`flex flex-col items-center gap-1.5 ${view === 'LOBBY' ? 'text-[#FFD700]' : 'text-gray-500'}`}>
          <span className="text-xl">🏛️</span>
          <span className="text-[9px] font-bold font-orbitron">{t.lobby}</span>
        </button>
        <button className="flex flex-col items-center gap-1.5 text-gray-500">
          <span className="text-xl">📈</span>
          <span className="text-[9px] font-bold font-orbitron">{t.data}</span>
        </button>
        <button className="flex flex-col items-center gap-1.5 text-[var(--vip-main)] animate-pulse">
          <span className="text-xl">🧧</span>
          <span className="text-[9px] font-bold font-orbitron">{t.bonus}</span>
        </button>
        <button className="flex flex-col items-center gap-1.5 text-gray-500">
          <span className="text-xl">⚙️</span>
          <span className="text-[9px] font-bold font-orbitron">{t.system}</span>
        </button>
      </footer>
    </div>
  );
};

export default App;
