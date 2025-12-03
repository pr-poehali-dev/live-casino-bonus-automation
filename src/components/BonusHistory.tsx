import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

const mockBonuses = [
  { id: 1, player: 'Игрок #4521', game: 'Coin Flip', multiplier: 125, amount: '12,500₽', time: '2 мин назад', status: 'issued' },
  { id: 2, player: 'Игрок #8932', game: 'Crazy Wheel', multiplier: 750, amount: '75,000₽', time: '5 мин назад', status: 'issued' },
  { id: 3, player: 'Игрок #2341', game: 'Pachinko', multiplier: 50, amount: '5,000₽', time: '8 мин назад', status: 'issued' },
  { id: 4, player: 'Игрок #7654', game: 'Coin Flip', multiplier: 10, amount: '1,000₽', time: '12 мин назад', status: 'issued' },
  { id: 5, player: 'Игрок #9876', game: 'Crazy Wheel', multiplier: 1000, amount: '100,000₽', time: '15 мин назад', status: 'issued' },
  { id: 6, player: 'Игрок #3456', game: 'Pachinko', multiplier: 250, amount: '25,000₽', time: '18 мин назад', status: 'issued' },
];

const BonusHistory = () => {
  const issueBonus = (bonusId: number) => {
    toast.success('Бонус выдан игроку!', {
      duration: 3000,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-[#D4AF37]">История бонусов</h2>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            className="border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37]/10"
          >
            <Icon name="Filter" className="mr-2" size={18} />
            Фильтры
          </Button>
          <Button
            className="bg-[#D4AF37] hover:bg-[#FFD700] text-[#0A0E1A] font-semibold"
          >
            <Icon name="Download" className="mr-2" size={18} />
            Экспорт
          </Button>
        </div>
      </div>

      <div className="grid gap-3">
        {mockBonuses.map((bonus) => (
          <Card
            key={bonus.id}
            className="bg-[#1A1F2C] border-[#D4AF37]/30 p-4 hover:border-[#D4AF37] transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#FFD700] flex items-center justify-center font-bold text-[#0A0E1A]">
                  {bonus.multiplier}x
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-[#F8F9FA]">{bonus.player}</span>
                    <span className="text-xs text-[#F8F9FA]/50">•</span>
                    <span className="text-sm text-[#D4AF37]">{bonus.game}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-[#F8F9FA]/60">
                    <span className="flex items-center gap-1">
                      <Icon name="Clock" size={14} />
                      {bonus.time}
                    </span>
                    <span className="flex items-center gap-1">
                      <Icon name="Coins" size={14} />
                      {bonus.amount}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="px-3 py-1 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] text-xs font-medium">
                  Выдан
                </div>
                <Button
                  onClick={() => issueBonus(bonus.id)}
                  size="sm"
                  variant="ghost"
                  className="text-[#F8F9FA]/50 hover:text-[#D4AF37]"
                >
                  <Icon name="MoreVertical" size={18} />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="bg-[#1A1F2C] border-[#D4AF37]/30 p-6 mt-6">
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-[#FFD700] mb-1">156</div>
            <div className="text-xs text-[#F8F9FA]/50">Всего сегодня</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-[#D4AF37] mb-1">1.2M₽</div>
            <div className="text-xs text-[#F8F9FA]/50">Сумма выдано</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-[#FFD700] mb-1">145x</div>
            <div className="text-xs text-[#F8F9FA]/50">Средний множитель</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-[#D4AF37] mb-1">24</div>
            <div className="text-xs text-[#F8F9FA]/50">Активных игроков</div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default BonusHistory;
