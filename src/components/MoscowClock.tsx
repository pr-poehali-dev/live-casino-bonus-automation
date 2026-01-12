import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';

const MoscowClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
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
  );
};

export default MoscowClock;
