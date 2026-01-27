
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Machine, UserProfile } from '../types';
import { SLOT_SYMBOLS } from '../constants';
import { audioService } from '../services/audioService';
import { i18n } from '../i18n';

interface SlotGameProps {
  machine: Machine;
  profile: UserProfile;
  onUpdateProfile: (updates: Partial<UserProfile>) => void;
}

const SlotGame: React.FC<SlotGameProps> = ({ machine, profile, onUpdateProfile }) => {
  const t = i18n[profile.lang];
  const [reels, setReels] = useState(['🎰', '🎰', '🎰']);
  const [isSpinning, setIsSpinning] = useState(false);
  const [bet, setBet] = useState(machine.minBet);
  const [message, setMessage] = useState('READY TO SPIN');
  const [autoSpin, setAutoSpin] = useState(false);
  
  const spinIntervals = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Mobile Immersive Glow
  useEffect(() => {
    if (isSpinning && window.innerWidth <= 768) {
      document.body.style.boxShadow = "inset 0 0 100px var(--vip-main)";
    } else {
      document.body.style.boxShadow = "none";
    }
  }, [isSpinning]);

  const showJackpot = (amount: number) => {
    const el = document.getElementById('jackpot-root');
    const amtEl = document.getElementById('jackpot-overlay-amount');
    if (el && amtEl) {
      amtEl.innerText = amount.toLocaleString();
      el.classList.add('active');
      setTimeout(() => el.classList.remove('active'), 3000);
    }
  };

  const getRandomSymbol = () => {
    const totalWeight = SLOT_SYMBOLS.reduce((acc, s) => acc + s.weight, 0);
    let random = Math.random() * totalWeight;
    for (const s of SLOT_SYMBOLS) {
      if (random < s.weight) return s;
      random -= s.weight;
    }
    return SLOT_SYMBOLS[0];
  };

  const spin = useCallback(() => {
    if (isSpinning) return;
    if (profile.coins < bet) {
      setMessage(t.insufficient);
      audioService.playError();
      setAutoSpin(false);
      return;
    }

    audioService.init();
    setIsSpinning(true);
    setMessage(t.spin + 'NING...');
    
    // Add to jackpot pool (2% of bet)
    const jackpotContrib = Math.max(1, Math.floor(bet * 0.02));

    onUpdateProfile({ 
      coins: profile.coins - bet,
      totalSpins: profile.totalSpins + 1,
      totalBet: profile.totalBet + bet,
      jackpotPool: profile.jackpotPool + jackpotContrib
    });
    
    const duration = 1200;
    const startTime = Date.now();

    const animate = () => {
      const now = Date.now();
      const elapsed = now - startTime;

      if (elapsed < duration) {
        setReels(prev => prev.map(() => SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)].icon));
        audioService.playSpin();
        requestAnimationFrame(animate);
      } else {
        const finalSymbols = [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()];
        setReels(finalSymbols.map(s => s.icon));
        setIsSpinning(false);
        audioService.playStop();
        
        // Calculate Payout
        const isWin = finalSymbols[0].icon === finalSymbols[1].icon && finalSymbols[1].icon === finalSymbols[2].icon;
        
        if (isWin) {
          let winAmount = bet * finalSymbols[0].payout;
          const jackpotHit = finalSymbols[0].icon === '7️⃣';
          
          if (jackpotHit) {
             winAmount += profile.jackpotPool;
             showJackpot(winAmount);
          }

          onUpdateProfile({ 
            coins: profile.coins - bet + winAmount,
            xp: profile.xp + 50,
            totalWins: profile.totalWins + winAmount,
            jackpotPool: jackpotHit ? 250000 : profile.jackpotPool
          });
          
          setMessage(`${jackpotHit ? t.jackpot : t.win} +${winAmount.toLocaleString()} 💰`);
          audioService.playWin();
        } else {
          setMessage(t.lose);
          onUpdateProfile({ xp: profile.xp + 10 });
        }
      }
    };

    requestAnimationFrame(animate);
  }, [isSpinning, profile, bet, onUpdateProfile, t]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (autoSpin && !isSpinning) {
      timer = setTimeout(spin, 1000);
    }
    return () => clearTimeout(timer);
  }, [autoSpin, isSpinning, spin]);

  const changeBet = (amount: number) => {
    const newBet = Math.max(machine.minBet, Math.min(bet + amount, 5000));
    setBet(newBet);
  };

  const rtp = profile.totalBet > 0 ? ((profile.totalWins / profile.totalBet) * 100).toFixed(1) : '0';

  return (
    <div className="pt-20 pb-24 px-4 max-w-6xl mx-auto flex flex-col lg:flex-row gap-8 items-center lg:items-start justify-center">
      {/* Slot Machine */}
      <div className="flex-1 w-full max-w-xl bg-[#1A1F3A] rounded-3xl border-4 border-[var(--vip-main)] p-6 glow-vip transition-colors duration-500">
        <div className="text-center mb-6">
          <h2 className="font-orbitron text-2xl text-[#FFD700] tracking-widest">{machine.name}</h2>
          <div className="flex justify-center gap-1 mt-1">
            <span className="text-[8px] px-2 py-0.5 bg-black/40 rounded border border-white/5 text-gray-400 uppercase">Fair Play</span>
            <span className="text-[8px] px-2 py-0.5 bg-black/40 rounded border border-white/5 text-[var(--vip-main)] font-bold uppercase">VIP</span>
          </div>
        </div>

        {/* Reels */}
        <div className="relative mb-8 p-1 bg-gradient-to-b from-gray-700 via-gray-900 to-gray-700 rounded-2xl border-2 border-black/50 shadow-2xl">
          <div className="flex justify-center gap-3 bg-black/80 p-5 rounded-xl">
            {reels.map((icon, i) => (
              <div 
                key={i} 
                className={`w-20 h-28 md:w-32 md:h-44 bg-white rounded-lg flex items-center justify-center text-4xl md:text-7xl shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] transform transition-all border-y-4 border-gray-200 ${isSpinning ? 'blur-[1px] -translate-y-1' : 'scale-100'}`}
                style={{ transitionDuration: `${50 * (i + 1)}ms` }}
              >
                {icon}
              </div>
            ))}
          </div>
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-[var(--vip-main)] opacity-30 shadow-[0_0_10px_var(--vip-main)]" />
        </div>

        <div className="text-center h-8 mb-6 font-rajdhani font-bold text-2xl text-[#00F0FF] uppercase">
          {message}
        </div>

        {/* Controls */}
        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col items-center justify-center p-2 bg-black/20 rounded-xl border border-white/5">
            <span className="text-[10px] text-gray-400 mb-1 font-orbitron">{t.bet}</span>
            <div className="flex items-center gap-2">
              <button onClick={() => changeBet(-50)} className="w-8 h-8 rounded bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-colors">-</button>
              <span className="font-rajdhani font-bold text-xl min-w-[40px] text-center">{bet}</span>
              <button onClick={() => changeBet(50)} className="w-8 h-8 rounded bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-colors">+</button>
            </div>
          </div>

          <button 
            onClick={spin}
            disabled={isSpinning}
            className={`col-span-1 py-3 rounded-2xl font-orbitron text-xl font-bold transition-all shadow-xl ${
              isSpinning 
                ? 'bg-gray-700 text-gray-500 scale-95 opacity-50' 
                : 'bg-gradient-to-b from-[var(--vip-main)] to-[#8B0000] text-white glow-red hover:scale-105 active:scale-95'
            }`}
          >
            {t.spin}
          </button>

          <div className="flex flex-col items-center justify-center p-2 bg-black/20 rounded-xl border border-white/5">
            <span className="text-[10px] text-gray-400 mb-1 font-orbitron">{t.auto}</span>
            <button 
              onClick={() => setAutoSpin(!autoSpin)}
              className={`w-full py-1.5 rounded-lg text-xs font-bold transition-all ${
                autoSpin ? 'bg-[#00F0FF] text-black shadow-[0_0_10px_rgba(0,240,255,0.5)]' : 'bg-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              {autoSpin ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>
      </div>

      {/* Dashboard */}
      <div className="hidden md:block w-72 bg-[#1A1F3A] rounded-2xl p-6 border border-white/5 h-fit shadow-2xl">
        <h3 className="font-orbitron text-xs text-[#FFD700] mb-6 border-b border-white/10 pb-3 tracking-widest uppercase">Dashboard</h3>
        
        <div className="space-y-4 font-rajdhani">
          <div className="bg-black/20 p-3 rounded-lg border border-white/5">
            <div className="text-[10px] text-gray-500 uppercase">{t.coins}</div>
            <div className="text-xl font-bold text-[#EAEAEA]">💰 {profile.coins.toLocaleString()}</div>
          </div>

          <div className="grid grid-cols-2 gap-3">
             <div className="bg-black/20 p-2.5 rounded-lg border border-white/5">
              <div className="text-[10px] text-gray-500 uppercase">{t.level}</div>
              <div className="text-lg font-bold text-[#00F0FF]">Lv.{profile.level}</div>
            </div>
            <div className="bg-black/20 p-2.5 rounded-lg border border-white/5">
              <div className="text-[10px] text-gray-500 uppercase">{t.tier}</div>
              <div className="text-lg font-bold text-[var(--vip-main)]">{profile.vipTier}</div>
            </div>
          </div>

          <hr className="opacity-10" />

          <div className="space-y-3">
            <div className="flex justify-between items-end">
              <span className="text-[10px] text-gray-500 uppercase">{t.total_spins}</span>
              <span className="text-sm font-bold">{profile.totalSpins.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-end">
              <span className="text-[10px] text-gray-500 uppercase">{t.total_wins}</span>
              <span className="text-sm font-bold text-[#FFD700]">{profile.totalWins.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-end pt-2 border-t border-white/5">
              <span className="text-[10px] text-gray-500 uppercase">{t.rtp}</span>
              <span className={`text-lg font-bold ${Number(rtp) >= 95 ? 'text-green-400' : 'text-[#00F0FF]'}`}>
                {rtp}%
              </span>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="font-orbitron text-[9px] text-gray-500 mb-4 border-b border-white/10 pb-2 uppercase">{t.payout_hierarchy}</h3>
          <div className="space-y-2">
            {SLOT_SYMBOLS.sort((a,b) => b.payout - a.payout).map(s => (
              <div key={s.icon} className="flex justify-between items-center text-[11px]">
                <span className="tracking-tighter">{s.icon}{s.icon}{s.icon}</span>
                <span className="text-gray-400">x{s.payout}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SlotGame;
