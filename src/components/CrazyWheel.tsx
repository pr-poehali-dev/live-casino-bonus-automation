import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface CrazyWheelProps {
  onClose: () => void;
}

const wheelSegments = [
  { value: 2, color: '#FF6B9D', emoji: '🍭' },
  { value: 5, color: '#4ECDC4', emoji: '🍬' },
  { value: 1, color: '#FFE66D', emoji: '🧁' },
  { value: 4, color: '#A8E6CF', emoji: '🍰' },
  { value: 3, color: '#FF8B94', emoji: '🎂' },
];



const CrazyWheel = ({ onClose }: CrazyWheelProps) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<{ value: number; color: string; emoji: string } | null>(null);
  const [confetti, setConfetti] = useState<Array<{ id: number; x: number; y: number; emoji: string }>>([]);

  const spinWheel = () => {
    setIsSpinning(true);
    setResult(null);
    setConfetti([]);

    setTimeout(() => {
      const segment = wheelSegments[Math.floor(Math.random() * wheelSegments.length)];
      
      const newConfetti = Array.from({ length: 30 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: -10,
        emoji: ['🎉', '✨', '💫', '🌟', '🎊'][Math.floor(Math.random() * 5)]
      }));
      setConfetti(newConfetti);
      
      toast.success(`${segment.emoji} Выпало: ${segment.value}x!`, {
        duration: 4000,
      });

      setResult(segment);
      setIsSpinning(false);
    }, 3000);
  };

  return (
    <Card className="bg-gradient-to-br from-pink-500/20 via-purple-500/20 to-cyan-500/20 border-pink-400/40 p-8 relative overflow-hidden">
      <Button
        onClick={onClose}
        variant="ghost"
        className="absolute top-4 right-4 text-white/70 hover:text-pink-400 z-20"
      >
        <Icon name="X" size={24} />
      </Button>

      <div className="text-center relative z-10">
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
          {confetti.map(c => (
            <div
              key={c.id}
              className="absolute text-3xl animate-confetti-fall"
              style={{
                left: `${c.x}%`,
                top: `${c.y}%`,
                animationDelay: `${Math.random() * 0.5}s`,
              }}
            >
              {c.emoji}
            </div>
          ))}
        </div>
        <h2 className="text-4xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent mb-6 drop-shadow-lg">🍭 Bubble Surprise</h2>

        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div
              className={`w-80 h-80 rounded-full relative ${
                isSpinning ? 'animate-spin' : ''
              }`}
              style={{
                background: `conic-gradient(
                  from 0deg,
                  #FF6B9D 0deg 72deg,
                  #4ECDC4 72deg 144deg,
                  #FFE66D 144deg 216deg,
                  #A8E6CF 216deg 288deg,
                  #FF8B94 288deg 360deg
                )`,
                boxShadow: '0 0 60px rgba(255, 107, 157, 0.5), inset 0 0 40px rgba(255, 255, 255, 0.2)',
                border: '6px solid rgba(255, 255, 255, 0.3)',
              }}
            >
              <div className="absolute inset-0 rounded-full" style={{
                background: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.3), transparent 50%)',
              }} />
              {wheelSegments.map((segment, index) => (
                <div
                  key={index}
                  className="absolute top-1/2 left-1/2 origin-left"
                  style={{
                    transform: `rotate(${index * 72 + 36}deg)`,
                  }}
                >
                  <div
                    className="text-white font-bold text-2xl flex items-center gap-2 bg-black/20 backdrop-blur-sm px-3 py-1 rounded-full"
                    style={{
                      transform: 'translateX(70px) translateY(-50%)',
                    }}
                  >
                    <span className="text-3xl">{segment.emoji}</span>
                    <span>{segment.value}x</span>
                  </div>
                </div>
              ))}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-white shadow-2xl flex items-center justify-center text-3xl">
                🎯
              </div>
            </div>
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-3 z-10">
              <div className="w-0 h-0 border-l-[20px] border-r-[20px] border-t-[30px] border-transparent border-t-white drop-shadow-lg" />
            </div>
          </div>
        </div>

        {result !== null && (
          <div className="mb-6 animate-bounce-in">
            <div className="text-8xl mb-4 animate-pulse">
              {result.emoji}
            </div>
            <div
              className="text-6xl font-bold mb-2 animate-scale-in"
              style={{
                color: result.color,
                textShadow: `0 0 30px ${result.color}, 0 0 60px ${result.color}`,
              }}
            >
              {result.value}x
            </div>
            <div className="text-xl text-white/80 font-semibold">
              🎊 Поздравляем! 🎊
            </div>
          </div>
        )}

        <Button
          onClick={spinWheel}
          disabled={isSpinning}
          className="bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 hover:from-pink-600 hover:via-purple-600 hover:to-cyan-600 text-white font-bold px-12 py-6 text-xl disabled:opacity-50 shadow-2xl transform hover:scale-105 transition-all"
        >
          {isSpinning ? '🎪 Вращаем...' : '🎯 Крутить колесо!'}
        </Button>

        <div className="mt-8 bg-white/10 backdrop-blur-md rounded-2xl p-6 max-w-md mx-auto border border-white/20">
          <div className="text-sm text-white/90 font-medium mb-3">
            🎮 Возможные результаты:
          </div>
          <div className="flex flex-wrap gap-3 justify-center">
            {wheelSegments.map((seg, i) => (
              <div
                key={i}
                className="px-4 py-2 rounded-full font-bold text-white shadow-lg"
                style={{ backgroundColor: seg.color }}
              >
                {seg.emoji} {seg.value}x
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CrazyWheel;