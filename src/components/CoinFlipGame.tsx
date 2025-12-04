import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface CoinFlipGameProps {
  onClose: () => void;
}

const generateMultiplier = () => {
  return Math.floor(Math.random() * 96) + 5;
};

const CoinFlipGame = ({ onClose }: CoinFlipGameProps) => {
  const [stage, setStage] = useState<'choose' | 'flipping' | 'result'>('choose');
  const [selectedSide, setSelectedSide] = useState<'heads' | 'tails' | null>(null);
  const [headsMultiplier, setHeadsMultiplier] = useState<number>(generateMultiplier());
  const [tailsMultiplier, setTailsMultiplier] = useState<number>(generateMultiplier());
  const [result, setResult] = useState<'heads' | 'tails' | null>(null);
  const [finalMultiplier, setFinalMultiplier] = useState<number | null>(null);
  const [animatingMultipliers, setAnimatingMultipliers] = useState(true);

  // Анимация множителей при загрузке
  useEffect(() => {
    if (stage === 'choose' && animatingMultipliers) {
      const interval = setInterval(() => {
        setHeadsMultiplier(generateMultiplier());
        setTailsMultiplier(generateMultiplier());
      }, 100);

      setTimeout(() => {
        clearInterval(interval);
        const finalHeads = generateMultiplier();
        const finalTails = generateMultiplier();
        setHeadsMultiplier(finalHeads);
        setTailsMultiplier(finalTails);
        setAnimatingMultipliers(false);
      }, 1500);

      return () => clearInterval(interval);
    }
  }, [stage, animatingMultipliers]);

  const selectSide = (side: 'heads' | 'tails') => {
    setSelectedSide(side);
  };

  const flipCoin = () => {
    if (!selectedSide) return;

    setStage('flipping');

    setTimeout(() => {
      const outcome = Math.random() > 0.5 ? 'heads' : 'tails';
      const multi = outcome === 'heads' ? headsMultiplier : tailsMultiplier;
      
      setResult(outcome);
      setFinalMultiplier(multi);
      setStage('result');

      const won = outcome === selectedSide;
      
      toast.success(
        won 
          ? `🎉 Выпало: ${outcome === 'heads' ? 'Орёл 🎅' : 'Решка 🎁'}! Вы выиграли ${multi}x!`
          : `😔 Выпало: ${outcome === 'heads' ? 'Орёл 🎅' : 'Решка 🎁'}. Вы проиграли.`,
        {
          duration: 4000,
        }
      );
    }, 2500);
  };

  const resetGame = () => {
    setStage('choose');
    setSelectedSide(null);
    setResult(null);
    setFinalMultiplier(null);
    setAnimatingMultipliers(true);
    setHeadsMultiplier(generateMultiplier());
    setTailsMultiplier(generateMultiplier());
  };

  const won = result === selectedSide;

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
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
          <div className="snowflake">❄️</div>
          <div className="snowflake" style={{ left: '20%', animationDelay: '1s', animationDuration: '4s' }}>❄️</div>
          <div className="snowflake" style={{ left: '40%', animationDelay: '2s' }}>⭐</div>
          <div className="snowflake" style={{ left: '60%', animationDelay: '0.5s', animationDuration: '5s' }}>❄️</div>
          <div className="snowflake" style={{ left: '80%', animationDelay: '1.5s' }}>🎄</div>
          <div className="snowflake" style={{ left: '90%', animationDelay: '2.5s', animationDuration: '4.5s' }}>❄️</div>
        </div>
        <h2 className="text-3xl font-bold text-[#D4AF37] mb-6">🎄 Coin Flip</h2>

        {stage === 'choose' && (
          <div className="space-y-6 animate-fade-in">
            <p className="text-[#F8F9FA]/70 mb-6">Выберите сторону монеты и подбросьте!</p>
            
            <div className="grid grid-cols-2 gap-6 max-w-lg mx-auto mb-8">
              <div
                onClick={() => selectSide('heads')}
                className={`cursor-pointer p-6 rounded-xl border-2 transition-all duration-300 ${
                  selectedSide === 'heads'
                    ? 'border-[#FFD700] bg-[#FFD700]/10 scale-105 gold-glow'
                    : 'border-[#D4AF37]/30 bg-[#0A0E1A]/50 hover:border-[#D4AF37] hover:scale-102'
                }`}
              >
                <div className="text-6xl mb-4">🎅</div>
                <div className="text-xl font-bold text-[#F8F9FA] mb-2">Орёл</div>
                <div className={`text-3xl font-bold transition-all duration-100 ${
                  animatingMultipliers ? 'text-[#D4AF37] animate-pulse' : 'text-[#FFD700] gold-text-glow'
                }`}>
                  {headsMultiplier}x
                </div>
              </div>

              <div
                onClick={() => selectSide('tails')}
                className={`cursor-pointer p-6 rounded-xl border-2 transition-all duration-300 ${
                  selectedSide === 'tails'
                    ? 'border-[#FFD700] bg-[#FFD700]/10 scale-105 gold-glow'
                    : 'border-[#D4AF37]/30 bg-[#0A0E1A]/50 hover:border-[#D4AF37] hover:scale-102'
                }`}
              >
                <div className="text-6xl mb-4">🎁</div>
                <div className="text-xl font-bold text-[#F8F9FA] mb-2">Решка</div>
                <div className={`text-3xl font-bold transition-all duration-100 ${
                  animatingMultipliers ? 'text-[#D4AF37] animate-pulse' : 'text-[#FFD700] gold-text-glow'
                }`}>
                  {tailsMultiplier}x
                </div>
              </div>
            </div>

            <Button
              onClick={flipCoin}
              disabled={!selectedSide || animatingMultipliers}
              className="bg-[#D4AF37] hover:bg-[#FFD700] text-[#0A0E1A] font-semibold px-8 py-6 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {!selectedSide ? 'Выберите сторону' : animatingMultipliers ? 'Генерация...' : 'Подбросить монету'}
            </Button>
          </div>
        )}

        {stage === 'flipping' && (
          <div className="animate-fade-in">
            <div className="mb-8 flex justify-center">
              <div className="w-40 h-40 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#FFD700] flex items-center justify-center text-6xl animate-coin-flip">
                🪙
              </div>
            </div>
            <p className="text-[#F8F9FA]/70 text-lg animate-pulse">Монета в воздухе...</p>
          </div>
        )}

        {stage === 'result' && (
          <div className="animate-fade-in space-y-6">
            <div className="mb-8 flex justify-center">
              <div className={`w-48 h-48 rounded-full bg-gradient-to-br flex items-center justify-center text-7xl transition-all duration-500 ${
                won 
                  ? 'from-[#FFD700] to-[#FFA500] gold-glow scale-110' 
                  : 'from-[#666] to-[#444] opacity-70'
              }`}>
                {result === 'heads' ? '🎅' : '🎁'}
              </div>
            </div>

            <div className="mb-6">
              <div className={`text-6xl font-bold mb-3 ${
                won ? 'text-[#FFD700] gold-text-glow' : 'text-[#F8F9FA]/50'
              }`}>
                {finalMultiplier}x
              </div>
              <div className={`text-2xl font-semibold mb-2 ${won ? 'text-[#FFD700]' : 'text-[#F8F9FA]/60'}`}>
                {result === 'heads' ? 'Выпал Орёл 🎅' : 'Выпала Решка 🎁'}
              </div>
              <div className={`text-lg ${won ? 'text-green-400' : 'text-red-400'}`}>
                {won ? '✅ Вы угадали!' : '❌ Вы не угадали'}
              </div>
            </div>

            <Button
              onClick={resetGame}
              className="bg-[#D4AF37] hover:bg-[#FFD700] text-[#0A0E1A] font-semibold px-8 py-6 text-lg"
            >
              Играть снова
            </Button>
          </div>
        )}

        {stage === 'choose' && (
          <div className="mt-8 grid grid-cols-2 gap-4 max-w-md mx-auto">
            <div className="bg-[#0A0E1A]/50 rounded-lg p-4">
              <div className="text-xs text-[#F8F9FA]/50 mb-1">Мин. множитель</div>
              <div className="text-xl font-bold text-[#D4AF37]">5x</div>
            </div>
            <div className="bg-[#0A0E1A]/50 rounded-lg p-4">
              <div className="text-xs text-[#F8F9FA]/50 mb-1">Макс. множитель</div>
              <div className="text-xl font-bold text-[#FFD700]">100x</div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default CoinFlipGame;
