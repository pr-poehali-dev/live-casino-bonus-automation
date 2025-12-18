import { useState, useRef, useEffect } from 'react';
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

// Множители в перемежку - несколько низких, несколько средних, несколько высоких
const slots = [5, 8, 10, 15, 20, 25, 30, 40, 50, 60, 75, 80, 90, 100];

// Генерация препятствий (колышки) - больше рядов и колышков
const generatePegs = () => {
  const pegs = [];
  const rows = 10; // Увеличено с 6 до 10
  for (let row = 0; row < rows; row++) {
    const pegsInRow = 6 + row; // Больше колышков в каждом ряду
    for (let col = 0; col < pegsInRow; col++) {
      pegs.push({
        x: 10 + (80 / (pegsInRow - 1)) * col,
        y: 8 + row * 8,
        row: row,
      });
    }
  }
  return pegs;
};

const pegs = generatePegs();

const PachinkoGame = ({ onClose }: PachinkoGameProps) => {
  const [isDropping, setIsDropping] = useState(false);
  const [landedSlot, setLandedSlot] = useState<number | null>(null);
  const [ballPosition, setBallPosition] = useState({ x: 50, y: 0 });
  const [hitPegIndex, setHitPegIndex] = useState<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Инициализация Web Audio API
  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    return () => {
      audioContextRef.current?.close();
    };
  }, []);

  // Функция для создания звука удара о колышек
  const playPegHitSound = (frequency: number = 800) => {
    if (!audioContextRef.current) return;

    const audioContext = audioContextRef.current;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    
    // Быстрое затухание для эффекта "тик"
    gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.05);
  };

  // Функция для звука попадания в слот
  const playSlotSound = () => {
    if (!audioContextRef.current) return;

    const audioContext = audioContextRef.current;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(300, audioContext.currentTime + 0.3);
    
    gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  };

  const dropBall = () => {
    setIsDropping(true);
    setLandedSlot(null);
    setBallPosition({ x: 50, y: 3 });

    // Определяем целевой слот заранее - генерируем множитель и подбираем ближайший слот
    const generatedMultiplier = generateMultiplier();
    const targetSlot = slots.reduce((prev, curr) =>
      Math.abs(curr - generatedMultiplier) < Math.abs(prev - generatedMultiplier) ? curr : prev
    );
    const targetSlotIndex = slots.indexOf(targetSlot);
    
    // Вычисляем целевую X позицию для попадания в нужный слот
    const targetX = 8 + (targetSlotIndex / (slots.length - 1)) * 84;

    // Проходим через каждый ряд препятствий
    const pegsByRow: { [key: number]: typeof pegs } = {};
    pegs.forEach(peg => {
      const row = Math.floor((peg.y - 8) / 8);
      if (!pegsByRow[row]) pegsByRow[row] = [];
      pegsByRow[row].push(peg);
    });

    let currentX = 50;
    let currentY = 3;
    let step = 0;
    let lastRow = -1;

    const animationInterval = setInterval(() => {
      const row = Math.floor(step / 2);
      
      if (row < Object.keys(pegsByRow).length) {
        // Проверяем, если перешли на новый ряд - играем звук
        if (row !== lastRow && pegsByRow[row]) {
          lastRow = row;
          // Находим ближайший колышек для визуальной подсветки
          const closestPeg = pegsByRow[row].reduce((prev, curr) => 
            Math.abs(curr.x - currentX) < Math.abs(prev.x - currentX) ? curr : prev
          );
          const pegIndex = pegs.findIndex(p => p.x === closestPeg.x && p.y === closestPeg.y);
          setHitPegIndex(pegIndex);
          setTimeout(() => setHitPegIndex(null), 100);
          
          // Варьируем частоту звука в зависимости от ряда для разнообразия
          const frequency = 600 + row * 50;
          playPegHitSound(frequency);
        }

        // Двигаемся к целевой позиции с плавным отклонением
        const direction = targetX > currentX ? 1 : -1;
        const randomness = (Math.random() - 0.5) * 2; // Меньше случайности для точности
        currentX += direction * 3 + randomness;
        currentX = Math.max(8, Math.min(92, currentX));
        
        currentY += 2.2; // Замедлено падение (было 3.5)

        setBallPosition({ x: currentX, y: currentY });
      } else {
        // Шарик достиг низа - завершаем
        clearInterval(animationInterval);
        
        // Финальное движение точно к целевому слоту
        const finalInterval = setInterval(() => {
          currentY += 1.5; // Еще медленнее на финише
          // Корректируем X к точному центру слота
          const diff = targetX - currentX;
          currentX += diff * 0.3; // Плавное приближение к центру
          
          setBallPosition({ x: currentX, y: currentY });
          
          if (currentY >= 92) {
            clearInterval(finalInterval);
            setLandedSlot(targetSlot);
            setIsDropping(false);
            
            // Звук попадания в слот
            playSlotSound();

            toast.success(`🎄 Шарик упал в слот ${targetSlot}x!`, {
              duration: 4000,
            });
          }
        }, 80); // Замедлено (было 50)
      }
      
      step++;
    }, 220); // Замедлено общее падение (было 150)
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
          {/* Увеличенное игровое поле */}
          <div className="h-[520px] bg-gradient-to-b from-[#0A0E1A] to-[#1A1F2C] rounded-lg border-2 border-[#D4AF37]/30 p-4 relative overflow-hidden">
            {/* Препятствия (колышки) */}
            {pegs.map((peg, index) => (
              <div
                key={index}
                className={`absolute w-2 h-2 rounded-full transition-all duration-100 ${
                  hitPegIndex === index 
                    ? 'bg-[#FFD700] scale-150 gold-glow' 
                    : 'bg-[#D4AF37]/60'
                }`}
                style={{
                  left: `${peg.x}%`,
                  top: `${peg.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              />
            ))}

            {/* Шарик - увеличенный и более заметный */}
            {isDropping && (
              <div 
                className="absolute transition-all duration-200 ease-linear z-10"
                style={{
                  left: `${ballPosition.x}%`,
                  top: `${ballPosition.y}%`,
                  transform: 'translate(-50%, -50%)'
                }}
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#FFD700] to-[#FFA500] shadow-lg animate-pulse gold-glow" />
              </div>
            )}

            {/* Слоты внизу - больше слотов в перемежку */}
            <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1 px-2">
              {slots.map((slot) => (
                <div
                  key={slot}
                  className={`flex-1 h-16 rounded-lg flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                    landedSlot === slot
                      ? 'bg-[#FFD700] text-[#0A0E1A] scale-110 gold-glow'
                      : slot <= 20
                      ? 'bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30'
                      : slot <= 50
                      ? 'bg-[#D4AF37]/25 text-[#FFD700] border border-[#D4AF37]/40'
                      : 'bg-[#D4AF37]/35 text-[#FFD700] border border-[#FFD700]/50 font-extrabold'
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
