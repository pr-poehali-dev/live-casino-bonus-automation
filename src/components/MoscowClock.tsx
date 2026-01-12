import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';

interface GameRecommendation {
  type: 'number' | 'multiplier' | 'bonus';
  emoji: string;
  value: string;
  label: string;
  color: string;
}

interface HistoryItem {
  id: number;
  timestamp: string;
  recommendations: GameRecommendation[];
}

const generateRecommendations = (): GameRecommendation[] => {
  // Цифры (1, 2, 5) - часто (70%)
  const numbers = [1, 1, 1, 1, 2, 2, 2, 2, 5, 5, 5, 5];
  
  // Умножение (2x-10x) - редко (20%)
  const multipliers = [2, 3, 4, 5, 6, 7, 8, 9, 10];
  
  // Бонусные раунды (Pachinko, Coin) - редко (10%)
  const bonuses = ['Pachinko', 'Coin'];
  
  const rand = Math.random();
  
  if (rand < 0.7) {
    // Цифра
    const num = numbers[Math.floor(Math.random() * numbers.length)];
    return [{
      type: 'number',
      emoji: '🔢',
      value: num.toString(),
      label: 'Цифра',
      color: num === 5 ? '#FFD700' : num === 2 ? '#4ECDC4' : '#8B5CF6'
    }];
  } else if (rand < 0.9) {
    // Умножение
    const mult = multipliers[Math.floor(Math.random() * multipliers.length)];
    return [{
      type: 'multiplier',
      emoji: '✖️',
      value: `${mult}x`,
      label: 'Умножение',
      color: mult >= 7 ? '#FF6B9D' : mult >= 4 ? '#FB923C' : '#FFD93D'
    }];
  } else {
    // Бонус
    const bonus = bonuses[Math.floor(Math.random() * bonuses.length)];
    return [{
      type: 'bonus',
      emoji: bonus === 'Pachinko' ? '🎯' : '🪙',
      value: bonus,
      label: 'Бонусный раунд',
      color: '#A78BFA'
    }];
  }
};

const MoscowClock = () => {
  const [time, setTime] = useState(new Date());
  const [recommendations, setRecommendations] = useState<GameRecommendation[]>(generateRecommendations());
  const [secondsUntilUpdate, setSecondsUntilUpdate] = useState(35);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isNewUpdate, setIsNewUpdate] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    return () => {
      audioContextRef.current?.close();
    };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const playUpdateSound = () => {
    if (!audioContextRef.current) return;

    const audioContext = audioContextRef.current;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(1200, audioContext.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  };

  useEffect(() => {
    const updateTimer = setInterval(() => {
      setSecondsUntilUpdate(prev => {
        if (prev <= 1) {
          const newRecs = generateRecommendations();
          setRecommendations(newRecs);
          
          const now = new Date();
          const timeString = now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
          
          setHistory(prevHistory => [
            {
              id: Date.now(),
              timestamp: timeString,
              recommendations: newRecs
            },
            ...prevHistory.slice(0, 9)
          ]);
          
          setIsNewUpdate(true);
          setTimeout(() => setIsNewUpdate(false), 1000);
          
          playUpdateSound();
          toast.success('🎲 Рекомендации обновлены!', {
            duration: 3000,
          });
          
          return 35;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(updateTimer);
  }, []);

  const moscowTime = new Date(time.toLocaleString('en-US', { timeZone: 'Europe/Moscow' }));
  
  const hours = moscowTime.getHours().toString().padStart(2, '0');
  const minutes = moscowTime.getMinutes().toString().padStart(2, '0');
  const seconds = moscowTime.getSeconds().toString().padStart(2, '0');
  
  const date = moscowTime.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Europe/Moscow'
  });

  return (
    <div className="space-y-4">
      <Card className="bg-gradient-to-br from-[#1A1F2C] via-[#0A0E1A] to-[#1A1F2C] border-[#D4AF37]/30 p-8 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[200px]">🕐</div>
        </div>
        
        <div className="relative z-10">
          <div className="text-sm text-[#D4AF37]/70 uppercase tracking-widest mb-2 flex items-center justify-center gap-2">
            <span>🇷🇺</span>
            <span>Московское время</span>
          </div>
          
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="bg-[#D4AF37]/10 backdrop-blur-sm rounded-2xl px-6 py-4 border border-[#D4AF37]/30">
              <div className="text-6xl font-bold text-[#FFD700] tabular-nums gold-text-glow">
                {hours}
              </div>
            </div>
            
            <div className="text-5xl text-[#D4AF37] animate-pulse">:</div>
            
            <div className="bg-[#D4AF37]/10 backdrop-blur-sm rounded-2xl px-6 py-4 border border-[#D4AF37]/30">
              <div className="text-6xl font-bold text-[#FFD700] tabular-nums gold-text-glow">
                {minutes}
              </div>
            </div>
            
            <div className="text-5xl text-[#D4AF37] animate-pulse">:</div>
            
            <div className="bg-[#D4AF37]/10 backdrop-blur-sm rounded-2xl px-6 py-4 border border-[#D4AF37]/30">
              <div className="text-6xl font-bold text-[#FFD700] tabular-nums gold-text-glow">
                {seconds}
              </div>
            </div>
          </div>
          
          <div className="text-lg text-[#F8F9FA]/70">
            {date}
          </div>
        </div>
      </Card>

      <Card className="bg-gradient-to-br from-[#1A1F2C] via-[#0A0E1A] to-[#1A1F2C] border-[#D4AF37]/30 p-6 relative overflow-hidden">
        <div className="absolute top-4 right-4 text-xs text-[#D4AF37]/70 font-mono">
          Обновление через {secondsUntilUpdate}с
        </div>
        
        <div className="mb-4">
          <h3 className="text-xl font-bold text-[#D4AF37] flex items-center justify-center gap-2">
            <span>🎡</span>
            <span>Что дать на колесе</span>
            <span>🎡</span>
          </h3>
          <p className="text-xs text-[#F8F9FA]/50 mt-1">Рекомендация обновляется каждые 35 секунд</p>
        </div>
        
        <div className="flex justify-center mb-6">
          {recommendations.map((rec, index) => (
            <div
              key={index}
              className={`bg-[#0A0E1A]/50 backdrop-blur-sm rounded-xl p-8 border-2 border-[#D4AF37]/30 hover:border-[#D4AF37] transition-all ${
                isNewUpdate ? 'animate-pulse scale-105' : ''
              }`}
            >
              <div className="text-xs text-[#D4AF37]/70 uppercase tracking-wider mb-2">
                {rec.label}
              </div>
              <div className="text-6xl mb-3">{rec.emoji}</div>
              <div
                className="text-5xl font-bold"
                style={{
                  color: rec.color,
                  textShadow: `0 0 30px ${rec.color}80`
                }}
              >
                {rec.value}
              </div>
            </div>
          ))}
        </div>

        {history.length > 0 && (
          <div className="border-t border-[#D4AF37]/20 pt-4">
            <h4 className="text-sm font-semibold text-[#D4AF37] mb-3 flex items-center gap-2">
              <span>📊</span>
              <span>История выдач</span>
            </h4>
            <div className="flex gap-2 flex-wrap justify-center">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="bg-[#0A0E1A]/30 rounded-lg px-4 py-2 border border-[#D4AF37]/10"
                >
                  <div className="text-xs text-[#D4AF37]/60 mb-1 font-mono">
                    {item.timestamp}
                  </div>
                  {item.recommendations.map((rec, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="text-lg">{rec.emoji}</div>
                      <div
                        className="text-lg font-bold"
                        style={{ color: rec.color }}
                      >
                        {rec.value}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default MoscowClock;