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
  const rows = 10;
  for (let row = 0; row < rows; row++) {
    const pegsInRow = 6 + row;
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
  const [totalDrops, setTotalDrops] = useState(0);
  const [history, setHistory] = useState<number[]>([]);
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
    setTotalDrops(prev => prev + 1);

    const generatedMultiplier = generateMultiplier();
    const targetSlot = slots.reduce((prev, curr) =>
      Math.abs(curr - generatedMultiplier) < Math.abs(prev - generatedMultiplier) ? curr : prev
    );
    const targetSlotIndex = slots.indexOf(targetSlot);
    const targetX = 8 + (targetSlotIndex / (slots.length - 1)) * 84;

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
        if (row !== lastRow && pegsByRow[row]) {
          lastRow = row;
          const closestPeg = pegsByRow[row].reduce((prev, curr) => 
            Math.abs(curr.x - currentX) < Math.abs(prev.x - currentX) ? curr : prev
          );
          const pegIndex = pegs.findIndex(p => p.x === closestPeg.x && p.y === closestPeg.y);
          setHitPegIndex(pegIndex);
          setTimeout(() => setHitPegIndex(null), 100);
          
          const frequency = 600 + row * 50;
          playPegHitSound(frequency);
        }

        const direction = targetX > currentX ? 1 : -1;
        const randomness = (Math.random() - 0.5) * 2;
        currentX += direction * 3 + randomness;
        currentX = Math.max(8, Math.min(92, currentX));
        
        currentY += 2.2;

        setBallPosition({ x: currentX, y: currentY });
      } else {
        clearInterval(animationInterval);
        
        const finalInterval = setInterval(() => {
          currentY += 1.5;
          const diff = targetX - currentX;
          currentX += diff * 0.3;
          
          setBallPosition({ x: currentX, y: currentY });
          
          if (currentY >= 92) {
            clearInterval(finalInterval);
            setLandedSlot(targetSlot);
            setIsDropping(false);
            setHistory(prev => [...prev, targetSlot]);
            
            playSlotSound();

            toast.success(`🎄 Шарик упал в слот ${targetSlot}x!`, {
              duration: 4000,
            });
          }
        }, 80);
      }
      
      step++;
    }, 220);
  };

  return (
    <Card className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-amber-600/20 p-8 relative shadow-2xl">
      <Button
        onClick={onClose}
        variant="ghost"
        className="absolute top-4 right-4 text-slate-300 hover:text-amber-500"
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
        <h2 className="text-3xl font-bold text-amber-400 mb-6 drop-shadow-lg">☃️ Pachinko</h2>

        <div className="mb-8 relative perspective-1000">
          {/* 3D игровое поле с реалистичными текстурами */}
          <div className="h-[520px] relative overflow-hidden rounded-2xl shadow-2xl" style={{
            background: 'linear-gradient(135deg, #1e293b 0%, #334155 50%, #1e293b 100%)',
            border: '3px solid #78350f',
            boxShadow: 'inset 0 0 60px rgba(0,0,0,0.5), 0 10px 40px rgba(0,0,0,0.6)'
          }}>
            {/* Деревянная рамка эффект */}
            <div className="absolute inset-0 pointer-events-none" style={{
              background: 'radial-gradient(circle at 50% 50%, transparent 60%, rgba(120, 53, 15, 0.3) 100%)'
            }} />

            {/* Препятствия (металлические колышки с 3D эффектом) */}
            {pegs.map((peg, index) => (
              <div
                key={index}
                className={`absolute transition-all duration-100`}
                style={{
                  left: `${peg.x}%`,
                  top: `${peg.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <div className={`w-3 h-3 rounded-full relative ${
                  hitPegIndex === index ? 'scale-150' : ''
                }`} style={{
                  background: hitPegIndex === index 
                    ? 'radial-gradient(circle at 30% 30%, #fbbf24, #d97706, #92400e)'
                    : 'radial-gradient(circle at 30% 30%, #cbd5e1, #94a3b8, #475569)',
                  boxShadow: hitPegIndex === index
                    ? '0 0 20px rgba(251, 191, 36, 0.8), inset -2px -2px 4px rgba(0,0,0,0.4), inset 2px 2px 4px rgba(255,255,255,0.3)'
                    : '0 2px 6px rgba(0,0,0,0.5), inset -2px -2px 4px rgba(0,0,0,0.4), inset 2px 2px 4px rgba(255,255,255,0.3)'
                }}>
                  <div className="absolute inset-0 rounded-full" style={{
                    background: 'radial-gradient(circle at 40% 40%, rgba(255,255,255,0.6), transparent)'
                  }} />
                </div>
              </div>
            ))}

            {/* Шарик - металлический с реалистичными бликами */}
            {isDropping && (
              <div 
                className="absolute transition-all duration-200 ease-linear z-20"
                style={{
                  left: `${ballPosition.x}%`,
                  top: `${ballPosition.y}%`,
                  transform: 'translate(-50%, -50%)',
                  filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.5))'
                }}
              >
                <div className="w-8 h-8 rounded-full relative animate-pulse" style={{
                  background: 'radial-gradient(circle at 35% 35%, #fef08a, #fbbf24, #f59e0b, #d97706)',
                  boxShadow: '0 4px 12px rgba(251, 191, 36, 0.6), inset -3px -3px 6px rgba(0,0,0,0.4), inset 3px 3px 6px rgba(255,255,255,0.4)'
                }}>
                  {/* Световой блик */}
                  <div className="absolute top-2 left-2 w-3 h-3 rounded-full" style={{
                    background: 'radial-gradient(circle, rgba(255,255,255,0.9), transparent)',
                  }} />
                  {/* Тень внутри */}
                  <div className="absolute bottom-1 right-1 w-4 h-4 rounded-full" style={{
                    background: 'radial-gradient(circle, transparent, rgba(0,0,0,0.3))',
                  }} />
                </div>
              </div>
            )}

            {/* Слоты с 3D эффектом и реалистичными цветами */}
            <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1 px-2">
              {slots.map((slot) => {
                const isLanded = landedSlot === slot;
                const isLow = slot <= 20;
                const isMedium = slot > 20 && slot <= 50;
                const isHigh = slot > 50;

                return (
                  <div
                    key={slot}
                    className={`flex-1 h-16 rounded-lg flex items-center justify-center font-bold text-xs transition-all duration-300 relative overflow-hidden ${
                      isLanded ? 'scale-110' : ''
                    }`}
                    style={{
                      background: isLanded
                        ? 'linear-gradient(145deg, #fbbf24, #f59e0b)'
                        : isHigh
                        ? 'linear-gradient(145deg, #dc2626, #991b1b)'
                        : isMedium
                        ? 'linear-gradient(145deg, #f97316, #c2410c)'
                        : 'linear-gradient(145deg, #6366f1, #4338ca)',
                      boxShadow: isLanded
                        ? '0 0 25px rgba(251, 191, 36, 0.8), inset 0 2px 4px rgba(255,255,255,0.3), inset 0 -2px 4px rgba(0,0,0,0.3)'
                        : 'inset 0 2px 4px rgba(255,255,255,0.2), inset 0 -2px 4px rgba(0,0,0,0.3), 0 4px 8px rgba(0,0,0,0.4)',
                      border: isLanded ? '2px solid #fef08a' : 'none',
                      color: '#fff',
                      textShadow: '0 1px 3px rgba(0,0,0,0.8)'
                    }}
                  >
                    {/* Блик сверху */}
                    <div className="absolute top-0 left-0 right-0 h-1/3" style={{
                      background: 'linear-gradient(to bottom, rgba(255,255,255,0.3), transparent)',
                      borderRadius: '8px 8px 0 0'
                    }} />
                    <span className="relative z-10">{slot}x</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {landedSlot !== null && (
          <div className="mb-6 animate-fade-in">
            <div className="text-6xl font-bold mb-2" style={{
              background: 'linear-gradient(135deg, #fbbf24, #f59e0b, #fbbf24)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 2px 8px rgba(251, 191, 36, 0.6))'
            }}>
              {landedSlot}x
            </div>
            <div className="text-sm text-slate-300">Выигрышный слот!</div>
          </div>
        )}

        <Button
          onClick={dropBall}
          disabled={isDropping}
          className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold px-8 py-6 text-lg disabled:opacity-50 shadow-lg transform transition-transform hover:scale-105"
        >
          {isDropping ? 'Шарик падает...' : 'Бросить шарик'}
        </Button>

        <div className="mt-8 grid grid-cols-4 gap-3 max-w-2xl mx-auto">
          <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
            <div className="text-xs text-slate-400 mb-1">Бросков</div>
            <div className="text-xl font-bold text-amber-400">{totalDrops}</div>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
            <div className="text-xs text-slate-400 mb-1">Средний</div>
            <div className="text-xl font-bold text-indigo-400">
              {history.length > 0 ? (history.reduce((a, b) => a + b, 0) / history.length).toFixed(1) : '0'}x
            </div>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
            <div className="text-xs text-slate-400 mb-1">Лучший</div>
            <div className="text-xl font-bold text-red-400">
              {history.length > 0 ? Math.max(...history) : '0'}x
            </div>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
            <div className="text-xs text-slate-400 mb-1">Последний</div>
            <div className="text-xl font-bold text-emerald-400">
              {landedSlot ? `${landedSlot}x` : '-'}
            </div>
          </div>
        </div>

        {history.length > 0 && (
          <div className="mt-6 bg-slate-800/30 rounded-lg p-4 border border-slate-700 max-w-2xl mx-auto">
            <div className="text-xs text-slate-400 mb-3">История последних 10 бросков:</div>
            <div className="flex gap-2 flex-wrap justify-center">
              {history.slice(-10).reverse().map((value, index) => (
                <div
                  key={index}
                  className="px-3 py-1 rounded-md text-sm font-semibold"
                  style={{
                    background: value > 50
                      ? 'linear-gradient(145deg, #dc2626, #991b1b)'
                      : value > 20
                      ? 'linear-gradient(145deg, #f97316, #c2410c)'
                      : 'linear-gradient(145deg, #6366f1, #4338ca)',
                    color: '#fff'
                  }}
                >
                  {value}x
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default PachinkoGame;