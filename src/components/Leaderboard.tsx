import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

const mockLeaders = [
  { rank: 1, player: 'Игрок #9876', wins: 45, topMultiplier: 1000, totalWon: '2,450,000₽', avatar: '👑' },
  { rank: 2, player: 'Игрок #8932', wins: 38, topMultiplier: 850, totalWon: '1,890,000₽', avatar: '💎' },
  { rank: 3, player: 'Игрок #4521', wins: 32, topMultiplier: 750, totalWon: '1,650,000₽', avatar: '⭐' },
  { rank: 4, player: 'Игрок #7654', wins: 28, topMultiplier: 500, totalWon: '1,120,000₽', avatar: '🎯' },
  { rank: 5, player: 'Игрок #2341', wins: 25, topMultiplier: 450, totalWon: '980,000₽', avatar: '🎰' },
  { rank: 6, player: 'Игрок #3456', wins: 22, topMultiplier: 400, totalWon: '850,000₽', avatar: '🔥' },
  { rank: 7, player: 'Игрок #5678', wins: 19, topMultiplier: 350, totalWon: '720,000₽', avatar: '💰' },
  { rank: 8, player: 'Игрок #8901', wins: 16, topMultiplier: 300, totalWon: '650,000₽', avatar: '🎲' },
];

const Leaderboard = () => {
  const getMedalColor = (rank: number) => {
    if (rank === 1) return 'from-[#FFD700] to-[#FFA500]';
    if (rank === 2) return 'from-[#C0C0C0] to-[#A8A8A8]';
    if (rank === 3) return 'from-[#CD7F32] to-[#B87333]';
    return 'from-[#D4AF37]/30 to-[#D4AF37]/10';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-[#D4AF37]">🏆 Топ игроков</h2>
        <div className="flex items-center gap-2 text-sm text-[#F8F9FA]/50">
          <Icon name="Calendar" size={16} />
          <span>Сегодня</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {mockLeaders.slice(0, 3).map((leader) => (
          <Card
            key={leader.rank}
            className={`bg-gradient-to-br ${getMedalColor(leader.rank)} border-[#D4AF37] p-6 text-center relative overflow-hidden`}
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-12 -mt-12" />
            <div className="relative">
              <div className="text-5xl mb-3">{leader.avatar}</div>
              <div className="text-2xl font-bold mb-1">{leader.player}</div>
              <div className="flex items-center justify-center gap-2 mb-4">
                <Icon name="Award" size={16} className="text-[#0A0E1A]" />
                <span className="font-bold text-[#0A0E1A]">#{leader.rank}</span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-black/20 rounded-lg p-2">
                  <div className="text-xs text-[#0A0E1A]/70 mb-1">Побед</div>
                  <div className="font-bold text-[#0A0E1A]">{leader.wins}</div>
                </div>
                <div className="bg-black/20 rounded-lg p-2">
                  <div className="text-xs text-[#0A0E1A]/70 mb-1">Макс x</div>
                  <div className="font-bold text-[#0A0E1A]">{leader.topMultiplier}</div>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-black/20">
                <div className="text-xs text-[#0A0E1A]/70 mb-1">Всего выиграно</div>
                <div className="text-lg font-bold text-[#0A0E1A]">{leader.totalWon}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="bg-[#1A1F2C] border-[#D4AF37]/30 p-6">
        <div className="space-y-3">
          {mockLeaders.slice(3).map((leader) => (
            <div
              key={leader.rank}
              className="flex items-center justify-between p-4 rounded-lg bg-[#0A0E1A]/50 hover:bg-[#0A0E1A]/70 transition-colors"
            >
              <div className="flex items-center gap-4 flex-1">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D4AF37]/30 to-[#D4AF37]/10 flex items-center justify-center font-bold text-[#D4AF37]">
                  #{leader.rank}
                </div>
                <div className="text-2xl">{leader.avatar}</div>
                <div className="flex-1">
                  <div className="font-semibold text-[#F8F9FA] mb-1">{leader.player}</div>
                  <div className="flex items-center gap-4 text-xs text-[#F8F9FA]/50">
                    <span>Побед: {leader.wins}</span>
                    <span>•</span>
                    <span>Макс: {leader.topMultiplier}x</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-[#D4AF37]">{leader.totalWon}</div>
                <div className="text-xs text-[#F8F9FA]/50">Выиграно</div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="bg-[#1A1F2C] border-[#D4AF37]/30 p-6 mt-6">
        <div className="grid grid-cols-3 gap-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Icon name="TrendingUp" className="text-[#FFD700]" size={24} />
            </div>
            <div className="text-2xl font-bold text-[#FFD700] mb-1">8.5M₽</div>
            <div className="text-xs text-[#F8F9FA]/50">Всего выиграно сегодня</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Icon name="Users" className="text-[#D4AF37]" size={24} />
            </div>
            <div className="text-2xl font-bold text-[#D4AF37] mb-1">247</div>
            <div className="text-xs text-[#F8F9FA]/50">Активных игроков</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Icon name="Zap" className="text-[#FFD700]" size={24} />
            </div>
            <div className="text-2xl font-bold text-[#FFD700] mb-1">342x</div>
            <div className="text-xs text-[#F8F9FA]/50">Средний множитель</div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Leaderboard;
