
import React from 'react';
import { Machine } from '../types';

interface MachineCardProps {
  machine: Machine;
  onSelect: (machine: Machine) => void;
}

const MachineCard: React.FC<MachineCardProps> = ({ machine, onSelect }) => {
  const getPath = (data: number[]) => {
    if (!data.length) return "";
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = Math.max(max - min, 1);
    const width = 100;
    const height = 30;
    
    return data.map((val, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((val - min) / range) * height;
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
  };

  return (
    <div 
      className="bg-[#1A1F3A] rounded border border-white/10 hover:border-[#FF2E63] transition-all cursor-pointer group flex flex-col h-full shadow-lg relative overflow-hidden"
      onClick={() => onSelect(machine)}
    >
      {/* Top Banner Area */}
      <div className="relative h-24 overflow-hidden bg-black">
        <img 
          src={machine.image} 
          alt={machine.name} 
          className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1F3A] to-transparent" />
        
        <div className="absolute top-1 left-1 flex flex-col gap-0.5">
          <span className="bg-black/80 text-[#FFD700] text-[9px] px-1.5 py-0.5 rounded font-orbitron border border-[#FFD700]/30 shadow-sm">
            NO.{machine.seatNumber}
          </span>
        </div>

        {machine.isHot && (
          <div className="absolute top-1 right-1">
             <span className="bg-[#FF2E63] text-white text-[8px] px-1.5 py-0.5 rounded font-black italic animate-pulse shadow-[0_0_10px_#FF2E63]">
               高設定
             </span>
          </div>
        )}
      </div>
      
      {/* Data Board Section */}
      <div className="p-2 flex-1 flex flex-col bg-gradient-to-b from-[#1A1F3A] to-[#0B1020]">
        <h3 className="font-orbitron text-[11px] text-[#EAEAEA] mb-1 truncate tracking-tight">{machine.name}</h3>
        
        <div className="grid grid-cols-2 gap-1 mb-2">
          <div className="bg-black/40 p-1 rounded border border-white/5">
            <div className="text-[7px] text-gray-500 uppercase">Total ROT</div>
            <div className="text-[10px] font-rajdhani font-bold text-[#00F0FF]">{machine.totalRotations.toLocaleString()}</div>
          </div>
          <div className="bg-black/40 p-1 rounded border border-white/5 text-right">
            <div className="text-[7px] text-gray-500 uppercase">Big Win</div>
            <div className="text-[10px] font-rajdhani font-bold text-[#FF2E63]">{machine.bigWins}</div>
          </div>
        </div>

        {/* Slump Graph / Chart View */}
        <div className="relative h-10 bg-black/60 rounded border border-white/5 mb-2 overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 grid grid-cols-4 grid-rows-2 opacity-10 pointer-events-none">
            <div className="border-r border-b border-white"></div>
            <div className="border-r border-b border-white"></div>
            <div className="border-r border-b border-white"></div>
            <div className="border-b border-white"></div>
            <div className="border-r border-white"></div>
            <div className="border-r border-white"></div>
            <div className="border-r border-white"></div>
            <div></div>
          </div>
          <svg viewBox="0 0 100 30" className="w-full h-full preserve-aspect-ratio-none relative z-10 p-1">
            <path 
              d={getPath(machine.history)} 
              fill="none" 
              stroke={machine.isHot ? "#FF2E63" : "#00F0FF"} 
              strokeWidth="2" 
              strokeLinecap="round"
              className="drop-shadow-[0_0_3px_rgba(255,46,99,0.5)]"
            />
          </svg>
        </div>

        <div className="mt-auto flex justify-between items-center text-[9px]">
           <span className="text-gray-500 font-rajdhani uppercase">Min Bet: {machine.minBet}</span>
           <span className="text-[#FFD700] font-bold animate-pulse group-hover:scale-110 transition-transform">PLAY ➔</span>
        </div>
      </div>
    </div>
  );
};

export default MachineCard;
