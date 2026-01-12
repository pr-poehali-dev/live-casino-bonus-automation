import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { PaymentButton } from '@/components/extensions/robokassa/PaymentButton';
import { toast } from 'sonner';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
}

interface CartItem extends Product {
  quantity: number;
}

const products: Product[] = [
  {
    id: '1',
    name: 'VIP Статус (1 месяц)',
    price: 500,
    image: '👑',
    description: 'Эксклюзивный статус с бонусами'
  },
  {
    id: '2',
    name: 'Игровая валюта 1000',
    price: 300,
    image: '💎',
    description: '1000 кристаллов для игр'
  },
  {
    id: '3',
    name: 'Бонус-пакет',
    price: 150,
    image: '🎁',
    description: 'Набор бонусов и множителей'
  },
  {
    id: '4',
    name: 'Premium доступ',
    price: 1000,
    image: '⭐',
    description: 'Безлимитный доступ ко всем функциям'
  }
];

const Shop = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    toast.success(`${product.name} добавлен в корзину`);
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const cartItems = cart.map(item => ({
    id: item.id,
    name: item.name,
    price: item.price,
    quantity: item.quantity
  }));

  return (
    <div className="min-h-screen bg-[#0A0E1A] text-[#F8F9FA]">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-[#D4AF37] gold-text-glow mb-2">
            🛒 Магазин
          </h1>
          <p className="text-[#F8F9FA]/70">
            Покупайте игровую валюту и бонусы
          </p>
        </header>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-[#D4AF37] mb-4">Товары</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {products.map(product => (
                <Card key={product.id} className="bg-[#1A1F2C] border-[#D4AF37]/30 p-6 hover:border-[#D4AF37] transition-all">
                  <div className="text-6xl mb-4 text-center">{product.image}</div>
                  <h3 className="text-xl font-bold text-[#D4AF37] mb-2">{product.name}</h3>
                  <p className="text-sm text-[#F8F9FA]/60 mb-4">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-[#FFD700]">{product.price} ₽</div>
                    <Button
                      onClick={() => addToCart(product)}
                      className="bg-[#D4AF37] hover:bg-[#FFD700] text-[#0A0E1A]"
                    >
                      <Icon name="Plus" size={16} className="mr-2" />
                      В корзину
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <div className="sticky top-4">
              <Card className="bg-[#1A1F2C] border-[#D4AF37]/30 p-6">
                <h2 className="text-2xl font-bold text-[#D4AF37] mb-4 flex items-center gap-2">
                  <Icon name="ShoppingCart" size={24} />
                  Корзина
                </h2>

                {cart.length === 0 ? (
                  <div className="text-center py-8 text-[#F8F9FA]/50">
                    Корзина пуста
                  </div>
                ) : (
                  <>
                    <div className="space-y-3 mb-6">
                      {cart.map(item => (
                        <div key={item.id} className="bg-[#0A0E1A]/50 rounded-lg p-3">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <div className="font-semibold text-[#F8F9FA]">{item.name}</div>
                              <div className="text-sm text-[#D4AF37]">{item.price} ₽</div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFromCart(item.id)}
                              className="text-red-400 hover:text-red-300"
                            >
                              <Icon name="Trash2" size={16} />
                            </Button>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="h-8 w-8 p-0"
                            >
                              <Icon name="Minus" size={14} />
                            </Button>
                            <Input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 0)}
                              className="h-8 w-16 text-center bg-[#0A0E1A] border-[#D4AF37]/30"
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="h-8 w-8 p-0"
                            >
                              <Icon name="Plus" size={14} />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-[#D4AF37]/30 pt-4 mb-6">
                      <div className="flex justify-between text-2xl font-bold">
                        <span className="text-[#F8F9FA]">Итого:</span>
                        <span className="text-[#FFD700]">{totalAmount} ₽</span>
                      </div>
                    </div>

                    <div className="space-y-3 mb-6">
                      <Input
                        placeholder="Ваше имя"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="bg-[#0A0E1A] border-[#D4AF37]/30"
                      />
                      <Input
                        placeholder="Email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="bg-[#0A0E1A] border-[#D4AF37]/30"
                      />
                      <Input
                        placeholder="Телефон"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="bg-[#0A0E1A] border-[#D4AF37]/30"
                      />
                    </div>

                    <PaymentButton
                      apiUrl="https://functions.poehali.dev/ef72f557-88a1-4e45-8502-835ec6486308"
                      amount={totalAmount}
                      userName={formData.name}
                      userEmail={formData.email}
                      userPhone={formData.phone}
                      cartItems={cartItems}
                      onSuccess={(orderNumber) => {
                        toast.success(`Заказ ${orderNumber} оформлен!`);
                        setCart([]);
                        setFormData({ name: '', email: '', phone: '' });
                      }}
                      onError={(error) => toast.error(error.message)}
                      className="w-full bg-[#D4AF37] hover:bg-[#FFD700] text-[#0A0E1A] font-bold py-4 text-lg"
                    >
                      <Icon name="CreditCard" size={20} className="mr-2" />
                      Оплатить {totalAmount} ₽
                    </PaymentButton>
                  </>
                )}
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
