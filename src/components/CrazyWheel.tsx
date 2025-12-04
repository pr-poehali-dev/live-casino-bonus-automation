import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface CrazyWheelProps {
  onClose: () => void;
}

const wheelSegments = [
  { value: 1, color: '#D4AF37', isTop: false },
  { value: 2, color: '#8B7355', isTop: false },
  { value: 5, color: '#D4AF37', isTop: false },
  { value: 10, color: '#8B7355', isTop: false },
  { value: 1, color: '#D4AF37', isTop: true },
  { value: 2, color: '#8B7355', isTop: true },
  { value: 5, color: '#D4AF37', isTop: true },
  { value: 20, color: '#FFD700', isTop: false },
];

const generateMultiplier = () => {
  return Math.floor(Math.random() * 96) + 5;
};

const CrazyWheel = ({ onClose }: CrazyWheelProps) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<{ value: number; isTop: boolean; finalMultiplier?: number } | null>(null);

  const spinWheel = () => {
    setIsSpinning(true);
    setResult(null);

    setTimeout(() => {
      const segment = wheelSegments[Math.floor(Math.random() * wheelSegments.length)];
      const finalResult = { ...segment, finalMultiplier: segment.value };

      if (segment.isTop && [1, 2, 5].includes(segment.value)) {
        const topMultiplier = generateMultiplier();
        finalResult.finalMultiplier = segment.value * topMultiplier;
        
        toast.success(`🎊 ТОП СЛОТ! ${segment.value}x × ${topMultiplier}x = ${finalResult.finalMultiplier}x`, {
          duration: 5000,
        });
      } else {
        toast.success(`Выпало: ${segment.value}x`, {
          duration: 4000,
        });
      }

      setResult(finalResult);
      setIsSpinning(false);
    }, 4000);
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
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
          <div className="snowflake">❄️</div>
          <div className="snowflake" style={{ left: '25%', animationDelay: '1.2s', animationDuration: '4.2s' }}>🎅</div>
          <div className="snowflake" style={{ left: '45%', animationDelay: '0.7s' }}>❄️</div>
          <div className="snowflake" style={{ left: '65%', animationDelay: '1.8s', animationDuration: '5.5s' }}>⭐</div>
          <div className="snowflake" style={{ left: '85%', animationDelay: '0.4s' }}>❄️</div>
        </div>
        <h2 className="text-3xl font-bold text-[#D4AF37] mb-6">🎁 Crazy Wheel</h2>

        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div
              className={`w-64 h-64 rounded-full border-8 border-[#D4AF37] relative ${
                isSpinning ? 'animate-spin-slow' : ''
              }`}
              style={{
                background: `conic-gradient(
                  from 0deg,
                  #D4AF37 0deg 45deg,
                  #8B7355 45deg 90deg,
                  #D4AF37 90deg 135deg,
                  #8B7355 135deg 180deg,
                  #D4AF37 180deg 225deg,
                  #8B7355 225deg 270deg,
                  #D4AF37 270deg 315deg,
                  #FFD700 315deg 360deg
                )`,
              }}
            >
              {wheelSegments.map((segment, index) => (
                <div
                  key={index}
                  className="absolute top-1/2 left-1/2 origin-top-left text-white font-bold text-lg"
                  style={{
                    transform: `rotate(${index * 45}deg) translate(80px, -50%)`,
                  }}
                >
                  {segment.isTop && '⭐'} {segment.value}x
                </div>
              ))}
            </div>
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
              <div className="w-0 h-0 border-l-8 border-r-8 border-t-12 border-transparent border-t-[#FFD700]" />
            </div>
          </div>
        </div>

        {result !== null && (
          <div className="mb-6 animate-fade-in">
            <div className="text-5xl font-bold text-[#FFD700] gold-text-glow mb-2">
              {result.finalMultiplier}x
            </div>
            {result.isTop && (
              <div className="text-sm text-[#FFD700] mb-1 flex items-center justify-center gap-2">
                <Icon name="Star" className="fill-[#FFD700]" size={16} />
                ТОП СЛОТ - Множитель активирован!
                <Icon name="Star" className="fill-[#FFD700]" size={16} />
              </div>
            )}
            <div className="text-sm text-[#F8F9FA]/60">
              Базовое значение: {result.value}x
            </div>
          </div>
        )}

        <Button
          onClick={spinWheel}
          disabled={isSpinning}
          className="bg-[#D4AF37] hover:bg-[#FFD700] text-[#0A0E1A] font-semibold px-8 py-6 text-lg disabled:opacity-50"
        >
          {isSpinning ? 'Колесо крутится...' : 'Крутить колесо'}
        </Button>

        <div className="mt-8 bg-[#0A0E1A]/50 rounded-lg p-4 max-w-md mx-auto">
          <div className="text-xs text-[#F8F9FA]/50 mb-2 flex items-center justify-center gap-2">
            <Icon name="Star" className="fill-[#FFD700]" size={14} />
            ТОП СЛОТЫ
          </div>
          <div className="text-sm text-[#D4AF37]">
            Слоты с ⭐ (1x, 2x, 5x) умножаются на случайный множитель до 100x
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CrazyWheel;