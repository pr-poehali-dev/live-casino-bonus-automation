import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface PachinkoGameProps {
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

const slots = [5, 10, 25, 50, 100, 250, 500, 1000];

const PachinkoGame = ({ onClose }: PachinkoGameProps) => {
  const [isDropping, setIsDropping] = useState(false);
  const [landedSlot, setLandedSlot] = useState<number | null>(null);

  const dropBall = () => {
    setIsDropping(true);
    setLandedSlot(null);

    setTimeout(() => {
      const multi = generateMultiplier();
      const closestSlot = slots.reduce((prev, curr) =>
        Math.abs(curr - multi) < Math.abs(prev - multi) ? curr : prev
      );
      setLandedSlot(closestSlot);
      setIsDropping(false);

      toast.success(`Шарик упал в слот ${closestSlot}x!`, {
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
        <h2 className="text-3xl font-bold text-[#D4AF37] mb-6">🎯 Pachinko</h2>

        <div className="mb-8 relative">
          <div className="h-64 bg-gradient-to-b from-[#0A0E1A] to-[#1A1F2C] rounded-lg border-2 border-[#D4AF37]/30 p-4 relative overflow-hidden">
            {isDropping && (
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 animate-bounce">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FFD700] to-[#D4AF37] shadow-lg" />
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
            <div className="text-xl font-bold text-[#FFD700]">1000x</div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default PachinkoGame;
