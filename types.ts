
export type View = 'LOBBY' | 'GAME';
export type Lang = 'ko' | 'ja' | 'en' | 'zh';

export interface UserProfile {
  coins: number;
  xp: number;
  level: number;
  vipTier: string;
  dailyBonusClaimed: boolean;
  lang: Lang;
  // Stats tracking
  totalSpins: number;
  totalWins: number;
  totalBet: number;
  jackpotPool: number;
}

export interface Machine {
  id: string;
  name: string;
  type: 'PACHINKO' | 'SLOT';
  jackpot: number;
  isHot: boolean;
  minBet: number;
  image: string;
  seatNumber: number;
  history: number[];
  totalRotations: number;
  bigWins: number;
}

export interface SlotSymbol {
  icon: string;
  weight: number;
  payout: number;
}
