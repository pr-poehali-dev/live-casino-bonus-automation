import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface CoinFlipGameProps {
  onClose: () => void;
}

const generateMultiplier = () => {
  const random = Math.random();
  if (random < 0.7) {
    return Math.floor(Math.random() * 146) + 5;
  } else if (random < 0.95) {
    return Math.floor(Math.random() * 351) + 150;
  } else {
    return Math.floor(Math.random() * 501) + 500;
  }
};

const CoinFlipGame = ({ onClose }: CoinFlipGameProps) => {
  const [isFlipping, setIsFlipping] = useState(false);
  const [result, setResult] = useState<'heads' | 'tails' | null>(null);
  const [multiplier, setMultiplier] = useState<number | null>(null);

  const flipCoin = () => {
    setIsFlipping(true);
    setResult(null);
    setMultiplier(null);

    setTimeout(() => {
      const outcome = Math.random() > 0.5 ? 'heads' : 'tails';
      const multi = generateMultiplier();
      setResult(outcome);
      setMultiplier(multi);
      setIsFlipping(false);
      
      toast.success(`Выпало: ${outcome === 'heads' ? 'Орёл' : 'Решка'}! Множитель: ${multi}x`, {
        duration: 4000,
      });
    }, 2000);
  };

  return (
    <Card className="bg-[#1A1F2C] border-[#D4AF37]/30 p-8 relative">
      <Button
        onClick={onClose}
        variant="ghost"
        className="absolute top-4 right-4 text-[#F8F9FA]/50 hover:text-[#D4AF37]"
      >
        <Icon name="X" size={24} />
      </Button>

      <div className="text-center">
        <h2 className="text-3xl font-bold text-[#D4AF37] mb-6">🪙 Coin Flip</h2>

        <div className="mb-8 flex justify-center">
          <div
            className={`w-40 h-40 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#FFD700] flex items-center justify-center text-6xl ${
              isFlipping ? 'animate-spin' : ''
            } transition-all duration-500`}
          >
            {result === null ? '🪙' : result === 'heads' ? '👑' : '💎'}
          </div>
        </div>

        {multiplier !== null && (
          <div className="mb-6 animate-fade-in">
            <div className="text-5xl font-bold text-[#FFD700] gold-text-glow mb-2">
              {multiplier}x
            </div>
            <div className="text-sm text-[#F8F9FA]/60">
              {result === 'heads' ? 'Орёл - Победа!' : 'Решка - Победа!'}
            </div>
          </div>
        )}

        <Button
          onClick={flipCoin}
          disabled={isFlipping}
          className="bg-[#D4AF37] hover:bg-[#FFD700] text-[#0A0E1A] font-semibold px-8 py-6 text-lg disabled:opacity-50"
        >
          {isFlipping ? 'Подбрасываю...' : 'Подбросить монету'}
        </Button>

        <div className="mt-8 grid grid-cols-2 gap-4 max-w-md mx-auto">
          <div className="bg-[#0A0E1A]/50 rounded-lg p-4">
            <div className="text-xs text-[#F8F9FA]/50 mb-1">Мин. множитель</div>
            <div className="text-xl font-bold text-[#D4AF37]">5x</div>
          </div>
          <div className="bg-[#0A0E1A]/50 rounded-lg p-4">
            <div className="text-xs text-[#F8F9FA]/50 mb-1">Макс. множитель</div>
            <div className="text-xl font-bold text-[#FFD700]">1000x</div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CoinFlipGame;
