
import { Machine, SlotSymbol } from './types';

export const SLOT_SYMBOLS: SlotSymbol[] = [
  { icon: '🍒', weight: 45, payout: 2 },
  { icon: '🍋', weight: 30, payout: 5 },
  { icon: '🔔', weight: 15, payout: 15 },
  { icon: '💎', weight: 7, payout: 50 },
  { icon: '7️⃣', weight: 3, payout: 250 },
];

const generateHistory = () => Array.from({ length: 10 }, () => Math.floor(Math.random() * 100) - 40);

export const MACHINES: Machine[] = [
  {
    id: 'm1',
    name: 'LUCKY DRAGON',
    type: 'SLOT',
    jackpot: 1250000,
    isHot: true,
    minBet: 50,
    image: 'https://picsum.photos/seed/dragon/400/200',
    seatNumber: 101,
    history: generateHistory(),
    totalRotations: 1240,
    bigWins: 12
  },
  {
    id: 'm2',
    name: 'NEON SAMURAI',
    type: 'SLOT',
    jackpot: 850000,
    isHot: false,
    minBet: 100,
    image: 'https://picsum.photos/seed/samurai/400/200',
    seatNumber: 102,
    history: generateHistory(),
    totalRotations: 850,
    bigWins: 5
  },
  {
    id: 'm3',
    name: 'GALAXY RUSH',
    type: 'SLOT',
    jackpot: 2400000,
    isHot: true,
    minBet: 200,
    image: 'https://picsum.photos/seed/galaxy/400/200',
    seatNumber: 103,
    history: generateHistory(),
    totalRotations: 3100,
    bigWins: 24
  },
  {
    id: 'm4',
    name: 'OCEAN TREASURE',
    type: 'SLOT',
    jackpot: 500000,
    isHot: false,
    minBet: 20,
    image: 'https://picsum.photos/seed/ocean/400/200',
    seatNumber: 104,
    history: generateHistory(),
    totalRotations: 450,
    bigWins: 2
  },
  {
    id: 'm5',
    name: 'PHARAOH GOLD',
    type: 'SLOT',
    jackpot: 3100000,
    isHot: true,
    minBet: 500,
    image: 'https://picsum.photos/seed/pharaoh/400/200',
    seatNumber: 105,
    history: generateHistory(),
    totalRotations: 1800,
    bigWins: 18
  },
  {
    id: 'm6',
    name: 'CYBER SLOTS 2077',
    type: 'SLOT',
    jackpot: 120000,
    isHot: false,
    minBet: 10,
    image: 'https://picsum.photos/seed/cyber/400/200',
    seatNumber: 106,
    history: generateHistory(),
    totalRotations: 200,
    bigWins: 1
  }
];

export const VIP_TIERS = [
  { name: 'BRONZE', minXp: 0, color: '#CD7F32' },
  { name: 'SILVER', minXp: 1000, color: '#C0C0C0' },
  { name: 'GOLD', minXp: 5000, color: '#FFD700' },
  { name: 'PLATINUM', minXp: 20000, color: '#E5E4E2' },
  { name: 'DIAMOND', minXp: 100000, color: '#B9F2FF' }
];
