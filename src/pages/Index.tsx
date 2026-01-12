import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import CoinFlipGame from '@/components/CoinFlipGame';
import PachinkoGame from '@/components/PachinkoGame';
import CrazyWheel from '@/components/CrazyWheel';
import BonusHistory from '@/components/BonusHistory';
import Leaderboard from '@/components/Leaderboard';
import MoscowClock from '@/components/MoscowClock';
import { ChatGPTPlaygroundPage } from '@/components/extensions/chatgpt-polza/ChatGPTPlaygroundPage';

const Index = () => {
  const [activeGame, setActiveGame] = useState<string>('');

  return (
    <div className="min-h-screen bg-[#0A0E1A] text-[#F8F9FA]">
      <div className="container mx-auto px-4 py-6">
        <header className="mb-8 border-b border-[#D4AF37]/20 pb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-[#D4AF37] gold-text-glow mb-2">
                🎰 Casino Control Panel
              </h1>
              <p className="text-[#F8F9FA]/70 text-sm">
                Управление бонусами и игровыми механиками
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/shop">
                <Button className="bg-[#D4AF37] hover:bg-[#FFD700] text-[#0A0E1A] font-semibold">
                  <Icon name="ShoppingBag" size={18} className="mr-2" />
                  Магазин
                </Button>
              </Link>
              <div className="h-12 w-px bg-[#D4AF37]/30" />
              <div className="text-right">
                <div className="text-xs text-[#F8F9FA]/50 uppercase tracking-wide">
                  Активных сессий
                </div>
                <div className="text-2xl font-bold text-[#FFD700]">24</div>
              </div>
              <div className="h-12 w-px bg-[#D4AF37]/30" />
              <div className="text-right">
                <div className="text-xs text-[#F8F9FA]/50 uppercase tracking-wide">
                  Выдано сегодня
                </div>
                <div className="text-2xl font-bold text-[#FFD700]">156</div>
              </div>
            </div>
          </div>
        </header>

        <Tabs defaultValue="games" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8 bg-[#1A1F2C] border border-[#D4AF37]/20">
            <TabsTrigger 
              value="games" 
              className="data-[state=active]:bg-[#D4AF37] data-[state=active]:text-[#0A0E1A]"
            >
              <Icon name="Gamepad2" className="mr-2" size={18} />
              Игры
            </TabsTrigger>
            <TabsTrigger 
              value="bonuses"
              className="data-[state=active]:bg-[#D4AF37] data-[state=active]:text-[#0A0E1A]"
            >
              <Icon name="Gift" className="mr-2" size={18} />
              Бонусы
            </TabsTrigger>
            <TabsTrigger 
              value="leaderboard"
              className="data-[state=active]:bg-[#D4AF37] data-[state=active]:text-[#0A0E1A]"
            >
              <Icon name="Trophy" className="mr-2" size={18} />
              Лидерборд
            </TabsTrigger>
            <TabsTrigger 
              value="chatgpt"
              className="data-[state=active]:bg-[#D4AF37] data-[state=active]:text-[#0A0E1A]"
            >
              <Icon name="MessageSquare" className="mr-2" size={18} />
              ChatGPT
            </TabsTrigger>
          </TabsList>

          <TabsContent value="games" className="space-y-6">
            <MoscowClock />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="bg-[#1A1F2C] border-[#D4AF37]/30 p-6 hover:border-[#D4AF37] transition-all duration-300 gold-glow cursor-pointer group">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-[#D4AF37]">
                    Coin Flip
                  </h3>
                  <div className="text-3xl group-hover:scale-110 transition-transform">
                    🪙
                  </div>
                </div>
                <p className="text-sm text-[#F8F9FA]/60 mb-4">
                  Классическая игра с подбрасыванием монеты. Выигрыш 5-1000x.
                </p>
                <Button 
                  onClick={() => setActiveGame('coinflip')}
                  className="w-full bg-[#D4AF37] hover:bg-[#FFD700] text-[#0A0E1A] font-semibold"
                >
                  Запустить игру
                </Button>
              </Card>

              <Card className="bg-[#1A1F2C] border-[#D4AF37]/30 p-6 hover:border-[#D4AF37] transition-all duration-300 gold-glow cursor-pointer group">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-[#D4AF37]">
                    Pachinko
                  </h3>
                  <div className="text-3xl group-hover:scale-110 transition-transform">
                    🎯
                  </div>
                </div>
                <p className="text-sm text-[#F8F9FA]/60 mb-4">
                  Японская механика с падающими шариками. Множители до 1000x.
                </p>
                <Button 
                  onClick={() => setActiveGame('pachinko')}
                  className="w-full bg-[#D4AF37] hover:bg-[#FFD700] text-[#0A0E1A] font-semibold"
                >
                  Запустить игру
                </Button>
              </Card>

              <Card className="bg-[#1A1F2C] border-[#D4AF37]/30 p-6 hover:border-[#D4AF37] transition-all duration-300 gold-glow cursor-pointer group">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-[#D4AF37]">
                    Crazy Wheel
                  </h3>
                  <div className="text-3xl group-hover:scale-110 transition-transform">
                    🎡
                  </div>
                </div>
                <p className="text-sm text-[#F8F9FA]/60 mb-4">
                  Колесо фортуны с топ-слотами. Умножение для 1, 2, 5.
                </p>
                <Button 
                  onClick={() => setActiveGame('wheel')}
                  className="w-full bg-[#D4AF37] hover:bg-[#FFD700] text-[#0A0E1A] font-semibold"
                >
                  Запустить игру
                </Button>
              </Card>
            </div>

            {activeGame === 'coinflip' && (
              <div className="animate-fade-in">
                <CoinFlipGame onClose={() => setActiveGame('')} />
              </div>
            )}

            {activeGame === 'pachinko' && (
              <div className="animate-fade-in">
                <PachinkoGame onClose={() => setActiveGame('')} />
              </div>
            )}

            {activeGame === 'wheel' && (
              <div className="animate-fade-in">
                <CrazyWheel onClose={() => setActiveGame('')} />
              </div>
            )}
          </TabsContent>

          <TabsContent value="bonuses">
            <BonusHistory />
          </TabsContent>

          <TabsContent value="leaderboard">
            <Leaderboard />
          </TabsContent>

          <TabsContent value="chatgpt">
            <ChatGPTPlaygroundPage 
              apiUrl="https://functions.poehali.dev/b6e86dd6-897d-47ff-a729-7f5094b869ec"
              defaultModel="openai/gpt-4o-mini"
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;