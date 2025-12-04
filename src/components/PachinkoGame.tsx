import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface PachinkoGameProps {
  onClose: () => void;
}

const generateMultiplier = () => {
  return Math.floor(Math.random() * 96) + 5;
};

const slots = [5, 10, 25, 50, 75, 100];

const PachinkoGame = ({ onClose }: PachinkoGameProps) => {
  const [isDropping, setIsDropping] = useState(false);
  const [landedSlot, setLandedSlot] = useState<number | null>(null);
  const [ballPosition, setBallPosition] = useState({ x: 50, y: 0 });

  const dropBall = () => {
    setIsDropping(true);
    setLandedSlot(null);
    setBallPosition({ x: 50, y: 0 });

    const interval = setInterval(() => {
      setBallPosition(prev => ({
        x: Math.max(10, Math.min(90, prev.x + (Math.random() - 0.5) * 15)),
        y: prev.y + 5
      }));
    }, 100);

    setTimeout(() => {
      clearInterval(interval);
      const multi = generateMultiplier();
      const closestSlot = slots.reduce((prev, curr) =>
        Math.abs(curr - multi) < Math.abs(prev - multi) ? curr : prev
      );
      setLandedSlot(closestSlot);
      setIsDropping(false);

      toast.success(`🎄 Шарик упал в слот ${closestSlot}x!`, {
        duration: 4000,
      });
    }, 3000);
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
          <div className="snowflake" style={{ left: '15%', animationDelay: '0.8s', animationDuration: '5.5s' }}>⭐</div>
          <div className="snowflake" style={{ left: '35%', animationDelay: '1.5s' }}>❄️</div>
          <div className="snowflake" style={{ left: '55%', animationDelay: '0.3s', animationDuration: '4.8s' }}>🎁</div>
          <div className="snowflake" style={{ left: '75%', animationDelay: '2s' }}>❄️</div>
          <div className="snowflake" style={{ left: '85%', animationDelay: '1.2s', animationDuration: '5.2s' }}>🎄</div>
        </div>
        <h2 className="text-3xl font-bold text-[#D4AF37] mb-6">☃️ Pachinko</h2>

        <div className="mb-8 relative">
          <div className="h-64 bg-gradient-to-b from-[#0A0E1A] to-[#1A1F2C] rounded-lg border-2 border-[#D4AF37]/30 p-4 relative overflow-hidden">
            {isDropping && (
              <div 
                className="absolute transition-all duration-100 ease-linear"
                style={{
                  left: `${ballPosition.x}%`,
                  top: `${ballPosition.y}%`,
                  transform: 'translate(-50%, -50%)'
                }}
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FFD700] to-[#D4AF37] shadow-lg animate-pulse" />
              </div>
            )}

            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
              {slots.map((slot) => (
                <div
                  key={slot}
                  className={`w-12 h-16 rounded-lg flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                    landedSlot === slot
                      ? 'bg-[#FFD700] text-[#0A0E1A] scale-110 gold-glow'
                      : 'bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30'
                  }`}
                >
                  {slot}x
                </div>
              ))}
            </div>
          </div>
        </div>

        {landedSlot !== null && (
          <div className="mb-6 animate-fade-in">
            <div className="text-5xl font-bold text-[#FFD700] gold-text-glow mb-2">
              {landedSlot}x
            </div>
            <div className="text-sm text-[#F8F9FA]/60">Выигрышный слот!</div>
          </div>
        )}

        <Button
          onClick={dropBall}
          disabled={isDropping}
          className="bg-[#D4AF37] hover:bg-[#FFD700] text-[#0A0E1A] font-semibold px-8 py-6 text-lg disabled:opacity-50"
        >
          {isDropping ? 'Шарик падает...' : 'Бросить шарик'}
        </Button>

        <div className="mt-8 grid grid-cols-3 gap-4 max-w-md mx-auto">
          <div className="bg-[#0A0E1A]/50 rounded-lg p-4">
            <div className="text-xs text-[#F8F9FA]/50 mb-1">Слотов</div>
            <div className="text-xl font-bold text-[#D4AF37]">{slots.length}</div>
          </div>
          <div className="bg-[#0A0E1A]/50 rounded-lg p-4">
            <div className="text-xs text-[#F8F9FA]/50 mb-1">Мин</div>
            <div className="text-xl font-bold text-[#D4AF37]">5x</div>
          </div>
          <div className="bg-[#0A0E1A]/50 rounded-lg p-4">
            <div className="text-xs text-[#F8F9FA]/50 mb-1">Макс</div>
            <div className="text-xl font-bold text-[#FFD700]">100x</div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default PachinkoGame;