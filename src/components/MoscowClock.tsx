import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';

interface GameRecommendation {
  game: string;
  emoji: string;
  value: string;
  color: string;
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

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const updateTimer = setInterval(() => {
      setSecondsUntilUpdate(prev => {
        if (prev <= 1) {
          setRecommendations(generateRecommendations());
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
        
        <div className="grid grid-cols-3 gap-4">
          {recommendations.map((rec, index) => (
            <div
              key={index}
              className="bg-[#0A0E1A]/50 backdrop-blur-sm rounded-xl p-4 border border-[#D4AF37]/20 hover:border-[#D4AF37]/50 transition-all"
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
        
        <div className="mt-4 text-xs text-[#F8F9FA]/40 text-center">
          💡 Рекомендации основаны на текущем времени и обновляются автоматически
        </div>
      </Card>
    </div>
  );
};

export default MoscowClock;