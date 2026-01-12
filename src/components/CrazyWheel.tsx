import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface CrazyWheelProps {
  onClose: () => void;
}

const bubbleColors = [
  { bg: '#FF6B9D', shadow: '#FF1493' },
  { bg: '#4ECDC4', shadow: '#00CED1' },
  { bg: '#FFD93D', shadow: '#FFA500' },
  { bg: '#A78BFA', shadow: '#7C3AED' },
  { bg: '#FB923C', shadow: '#F97316' },
];

interface Bubble {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  colorIndex: number;
}

const CrazyWheel = ({ onClose }: CrazyWheelProps) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<number | null>(null);
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [poppedNumbers, setPoppedNumbers] = useState<Array<{ value: number; x: number; y: number; id: number }>>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setBubbles(prev => {
        const updated = prev
          .map(bubble => ({
            ...bubble,
            y: bubble.y - bubble.speed
          }))
          .filter(bubble => bubble.y > -100);

        if (Math.random() > 0.7 && updated.length < 15) {
          updated.push({
            id: Date.now() + Math.random(),
            x: Math.random() * 90 + 5,
            y: 100,
            size: 60 + Math.random() * 40,
            speed: 0.3 + Math.random() * 0.5,
            colorIndex: Math.floor(Math.random() * bubbleColors.length),
          });
        }

        return updated;
      });

      setPoppedNumbers(prev => prev.filter(item => Date.now() - item.id < 2000));
    }, 50);

    return () => clearInterval(interval);
  }, []);

  const popBubble = (bubble: Bubble) => {
    if (isSpinning) return;

    const multipliers = [1, 2, 3, 4, 5];
    const randomMultiplier = multipliers[Math.floor(Math.random() * multipliers.length)];

    setPoppedNumbers(prev => [
      ...prev,
      { value: randomMultiplier, x: bubble.x, y: bubble.y, id: Date.now() }
    ]);

    setBubbles(prev => prev.filter(b => b.id !== bubble.id));

    setIsSpinning(true);
    setResult(randomMultiplier);

    toast.success(`💥 Пузырь лопнул! Выпало: ${randomMultiplier}x`, {
      duration: 3000,
    });

    setTimeout(() => {
      setIsSpinning(false);
      setResult(null);
    }, 2000);
  };

  return (
    <Card className="bg-gradient-to-br from-purple-900 via-pink-800 to-blue-900 border-pink-500/30 p-8 relative overflow-hidden">
      <Button
        onClick={onClose}
        variant="ghost"
        className="absolute top-4 right-4 text-white/70 hover:text-pink-300 z-50"
      >
        <Icon name="X" size={24} />
      </Button>

      <div className="text-center relative">
        <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 mb-6 drop-shadow-lg">
          💫 Bubble Surprise
        </h2>

        <div 
          className="relative h-[500px] rounded-3xl overflow-hidden mb-6"
          style={{
            background: 'linear-gradient(180deg, rgba(139, 92, 246, 0.3) 0%, rgba(219, 39, 119, 0.3) 100%)',
            border: '3px solid rgba(236, 72, 153, 0.5)',
            boxShadow: '0 0 40px rgba(236, 72, 153, 0.3), inset 0 0 40px rgba(139, 92, 246, 0.2)'
          }}
        >
          {bubbles.map(bubble => {
            const color = bubbleColors[bubble.colorIndex];
            return (
              <div
                key={bubble.id}
                onClick={() => popBubble(bubble)}
                className="absolute cursor-pointer transition-transform hover:scale-110 animate-pulse"
                style={{
                  left: `${bubble.x}%`,
                  top: `${bubble.y}%`,
                  width: `${bubble.size}px`,
                  height: `${bubble.size}px`,
                  transform: 'translate(-50%, -50%)'
                }}
              >
                <div
                  className="w-full h-full rounded-full flex items-center justify-center font-bold text-white text-2xl"
                  style={{
                    background: `radial-gradient(circle at 30% 30%, ${color.bg}, ${color.shadow})`,
                    boxShadow: `0 8px 32px ${color.shadow}80, inset -4px -4px 8px rgba(0,0,0,0.3), inset 4px 4px 8px rgba(255,255,255,0.3)`,
                    border: '3px solid rgba(255, 255, 255, 0.3)'
                  }}
                >
                  ?
                </div>
              </div>
            );
          })}

          {poppedNumbers.map(item => (
            <div
              key={item.id}
              className="absolute text-6xl font-bold text-yellow-300"
              style={{
                left: `${item.x}%`,
                top: `${item.y}%`,
                transform: 'translate(-50%, -50%)',
                textShadow: '0 0 20px rgba(253, 224, 71, 0.8), 0 0 40px rgba(253, 224, 71, 0.5)',
                animation: 'float-up 2s ease-out forwards'
              }}
            >
              {item.value}x
            </div>
          ))}

          <div className="absolute inset-0 pointer-events-none" style={{
            background: 'radial-gradient(circle at 50% 120%, transparent 0%, rgba(139, 92, 246, 0.2) 100%)'
          }} />
        </div>

        {result !== null && (
          <div className="mb-6 animate-fade-in">
            <div 
              className="text-6xl font-bold mb-2"
              style={{
                color: '#FDE047',
                textShadow: '0 0 20px rgba(253, 224, 71, 0.8), 0 0 40px rgba(253, 224, 71, 0.5)'
              }}
            >
              {result}x
            </div>
            <div className="text-lg text-pink-300">
              Множитель активирован!
            </div>
          </div>
        )}

        <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 max-w-md mx-auto border border-pink-500/30">
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="text-2xl">💎</span>
            <div className="text-sm text-pink-300 font-semibold">КАК ИГРАТЬ</div>
            <span className="text-2xl">💎</span>
          </div>
          <div className="text-sm text-white/80 leading-relaxed">
            Лопай пузыри, чтобы получить случайный множитель!<br/>
            Выпадают: 1x, 2x, 3x, 4x, 5x
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float-up {
          0% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(0.5);
          }
          50% {
            opacity: 1;
            transform: translate(-50%, -100px) scale(1.2);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -150px) scale(0.8);
          }
        }
      `}</style>
    </Card>
  );
};

export default CrazyWheel;
