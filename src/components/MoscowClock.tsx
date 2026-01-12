import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';

interface GameRecommendation {
  game: string;
  emoji: string;
  value: string;
  color: string;
}

interface HistoryItem {
  id: number;
  timestamp: string;
  recommendations: GameRecommendation[];
}

const generateRecommendations = (): GameRecommendation[] => {
  const wheelValues = [1, 1, 1, 2, 2, 2, 5, 5, 5, 3, 4];
  const pachinkoValues = ['Bubble x1', 'Bubble x2', 'Bubble x3', 'Bubble x2', 'Bubble x1'];
  const coinValues = ['Random x5-50', 'Random x10-100', 'Random x5-75'];
  
  const wheelRec = wheelValues[Math.floor(Math.random() * wheelValues.length)];
  const pachinkoRec = pachinkoValues[Math.floor(Math.random() * pachinkoValues.length)];
  const coinRec = coinValues[Math.floor(Math.random() * coinValues.length)];
  
  return [
    {
      game: 'Bubble Surprise',
      emoji: '💫',
      value: `${wheelRec}x`,
      color: wheelRec >= 4 ? '#FB923C' : wheelRec >= 3 ? '#FFD93D' : '#4ECDC4'
    },
    {
      game: 'Pachinko',
      emoji: '🎯',
      value: pachinkoRec,
      color: '#8B5CF6'
    },
    {
      game: 'Coin Flip',
      emoji: '🪙',
      value: coinRec,
      color: '#F59E0B'
    }
  ];
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
            <span>🎲</span>
            <span>Рекомендации по играм</span>
            <span>🎲</span>
          </h3>
          <p className="text-xs text-[#F8F9FA]/50 mt-1">Оптимальные множители сейчас</p>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mb-6">
          {recommendations.map((rec, index) => (
            <div
              key={index}
              className={`bg-[#0A0E1A]/50 backdrop-blur-sm rounded-xl p-4 border border-[#D4AF37]/20 hover:border-[#D4AF37]/50 transition-all ${
                isNewUpdate ? 'animate-pulse scale-105' : ''
              }`}
            >
              <div className="text-4xl mb-2">{rec.emoji}</div>
              <div className="text-xs text-[#F8F9FA]/60 mb-2">{rec.game}</div>
              <div
                className="text-2xl font-bold"
                style={{
                  color: rec.color,
                  textShadow: `0 0 20px ${rec.color}80`
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
              <span>История рекомендаций</span>
            </h4>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="bg-[#0A0E1A]/30 rounded-lg p-3 border border-[#D4AF37]/10"
                >
                  <div className="text-xs text-[#D4AF37]/60 mb-2 font-mono">
                    {item.timestamp}
                  </div>
                  <div className="flex gap-2">
                    {item.recommendations.map((rec, idx) => (
                      <div
                        key={idx}
                        className="flex-1 bg-[#1A1F2C]/50 rounded px-2 py-1 text-center"
                      >
                        <div className="text-lg">{rec.emoji}</div>
                        <div
                          className="text-sm font-bold"
                          style={{ color: rec.color }}
                        >
                          {rec.value}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="mt-4 text-xs text-[#F8F9FA]/40 text-center">
          💡 Рекомендации основаны на текущем времени и обновляются автоматически
        </div>
      </Card>
    </div>
  );
};

export default MoscowClock;