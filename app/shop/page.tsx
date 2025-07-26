'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ShoppingCart,
  Coins,
  Package,
  Star,
  Filter,
  Search,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GameLayout } from '@/components/layout/game-layout';
import { useGameStore, useAuthStore } from '@/lib/store';
import { api } from '@/lib/api';
import { ShopItem } from '@/types/api';
import { formatXP, getRarityColor } from '@/lib/utils';

export default function ShopPage() {
  const { user } = useAuthStore();
  const { shopItems, setShopItems, inventory, setInventory, addNotification } = useGameStore();
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('name');

  useEffect(() => {
    const fetchShopData = async () => {
      try {
        setIsLoading(true);
        
        const [shopResponse, inventoryResponse] = await Promise.all([
          api.shop.items(),
          api.inventory.get(),
        ]);
        
        setShopItems(shopResponse.data.data);
        setInventory(inventoryResponse.data.data);
        
      } catch (error) {
        console.error('Failed to fetch shop data:', error);
        addNotification({
          id: Date.now().toString(),
          type: 'error',
          title: 'Error',
          message: 'Gagal memuat data shop',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchShopData();
  }, [setShopItems, setInventory, addNotification]);

  const handleBuyItem = async (item: ShopItem, quantity: number = 1) => {
    if (!user || user.coins < item.price * quantity) {
      addNotification({
        id: Date.now().toString(),
        type: 'error',
        title: 'Insufficient Coins',
        message: `You need ${item.price * quantity} coins to buy this item`,
      });
      return;
    }

    try {
      await api.shop.buy(item.id, quantity);
      
      // Update user coins (this would typically come from the API response)
      // For now, we'll update locally
      
      addNotification({
        id: Date.now().toString(),
        type: 'success',
        title: 'Purchase Successful!',
        message: `You bought ${quantity}x ${item.name}`,
      });
      
      // Refresh inventory
      const inventoryResponse = await api.inventory.get();
      setInventory(inventoryResponse.data.data);
      
    } catch (error: any) {
      addNotification({
        id: Date.now().toString(),
        type: 'error',
        title: 'Purchase Failed',
        message: error.response?.data?.message || 'Gagal membeli item',
      });
    }
  };

  const handleSellItem = async (item: any, quantity: number = 1) => {
    try {
      await api.shop.sell(item.id, quantity);
      
      addNotification({
        id: Date.now().toString(),
        type: 'success',
        title: 'Item Sold!',
        message: `You sold ${quantity}x ${item.name} for ${item.price * quantity} coins`,
      });
      
      // Refresh inventory
      const inventoryResponse = await api.inventory.get();
      setInventory(inventoryResponse.data.data);
      
    } catch (error: any) {
      addNotification({
        id: Date.now().toString(),
        type: 'error',
        title: 'Sale Failed',
        message: error.response?.data?.message || 'Gagal menjual item',
      });
    }
  };

  const filteredItems = shopItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    
    return matchesSearch && matchesCategory && item.is_available;
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case 'price_low':
        return a.price - b.price;
      case 'price_high':
        return b.price - a.price;
      case 'name':
      default:
        return a.name.localeCompare(b.name);
    }
  });

  const categories = ['all', 'tools', 'resources', 'consumables', 'equipment', 'cosmetics'];

  if (isLoading) {
    return (
      <GameLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading shop...</p>
          </div>
        </div>
      </GameLayout>
    );
  }

  return (
    <GameLayout>
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Code Valley Shop</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Upgrade your coding arsenal with tools, resources, and equipment!
          </p>
        </motion.div>

        {/* User Coins */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-center gap-3">
                <Coins className="w-8 h-8" />
                <div className="text-center">
                  <p className="text-yellow-100">Your Balance</p>
                  <p className="text-3xl font-bold">{formatXP(user?.coins || 0)} Coins</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Shop Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Tabs defaultValue="buy" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="buy">Buy Items</TabsTrigger>
              <TabsTrigger value="sell">Sell Items</TabsTrigger>
            </TabsList>

            <TabsContent value="buy" className="space-y-6">
              {/* Filters */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        placeholder="Search items..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category} value={category}>
                            {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="name">Name</SelectItem>
                        <SelectItem value="price_low">Price: Low to High</SelectItem>
                        <SelectItem value="price_high">Price: High to Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Items Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {sortedItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.05 }}
                  >
                    <Card className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1 h-full">
                      <CardContent className="p-6">
                        <div className="text-center mb-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
                            <Package className="w-8 h-8 text-white" />
                          </div>
                          <h3 className="font-bold text-lg text-gray-900 mb-2">{item.name}</h3>
                          <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                          
                          <div className="flex items-center justify-center gap-2 mb-4">
                            <Badge variant="outline">{item.category}</Badge>
                            {item.discount && (
                              <Badge className="bg-red-100 text-red-800">
                                -{item.discount}%
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Coins className="w-5 h-5 text-yellow-500" />
                              <span className="font-bold text-lg">
                                {item.discount ? (
                                  <>
                                    <span className="line-through text-gray-400 text-sm mr-2">
                                      {item.price}
                                    </span>
                                    {Math.floor(item.price * (1 - item.discount / 100))}
                                  </>
                                ) : (
                                  item.price
                                )}
                              </span>
                            </div>
                            <Badge variant="secondary">
                              Stock: {item.stock}
                            </Badge>
                          </div>

                          <Button 
                            className="w-full"
                            onClick={() => handleBuyItem(item)}
                            disabled={item.stock === 0 || (user?.coins || 0) < item.price}
                          >
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            {item.stock === 0 ? 'Out of Stock' : 'Buy Now'}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {sortedItems.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShoppingCart className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No items found</h3>
                  <p className="text-gray-600">
                    {searchTerm ? 'Try a different search term' : 'No items available in this category'}
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="sell" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {inventory.filter(item => item.quantity > 0).map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="hover:shadow-lg transition-shadow h-full">
                      <CardContent className="p-6">
                        <div className="text-center mb-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
                            <Package className="w-8 h-8 text-white" />
                          </div>
                          <h3 className="font-bold text-lg text-gray-900 mb-2">{item.name}</h3>
                          <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                          
                          <div className="flex items-center justify-center gap-2 mb-4">
                            <Badge variant="outline">{item.type}</Badge>
                            <Badge className={getRarityColor(item.rarity)}>
                              {item.rarity}
                            </Badge>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Coins className="w-5 h-5 text-yellow-500" />
                              <span className="font-bold text-lg">
                                {Math.floor((item.price || 100) * 0.7)} {/* 70% of buy price */}
                              </span>
                            </div>
                            <Badge variant="secondary">
                              Owned: {item.quantity}
                            </Badge>
                          </div>

                          <Button 
                            className="w-full"
                            variant="outline"
                            onClick={() => handleSellItem(item)}
                            disabled={item.quantity === 0}
                          >
                            <Coins className="w-4 h-4 mr-2" />
                            Sell Item
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {inventory.filter(item => item.quantity > 0).length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Package className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No items to sell</h3>
                  <p className="text-gray-600">
                    Complete quests and challenges to earn items you can sell
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </GameLayout>
  );
}