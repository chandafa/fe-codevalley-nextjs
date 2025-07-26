'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Package,
  Search,
  Filter,
  Star,
  Zap,
  Shield,
  Sword,
  Wrench,
  Gem,
  Coffee,
  Book,
  Cpu,
  Palette,
  Settings,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { GameLayout } from '@/components/layout/game-layout';
import { useGameStore } from '@/lib/store';
import { api } from '@/lib/api';
import { InventoryItem } from '@/types/api';
import { getRarityColor } from '@/lib/utils';

export default function InventoryPage() {
  const { inventory, setInventory, addNotification } = useGameStore();
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedRarity, setSelectedRarity] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [showItemDetails, setShowItemDetails] = useState(false);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        setIsLoading(true);
        const response = await api.inventory.get();
        setInventory(response.data.data);
      } catch (error) {
        console.error('Failed to fetch inventory:', error);
        addNotification({
          id: Date.now().toString(),
          type: 'error',
          title: 'Error',
          message: 'Gagal memuat inventory',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchInventory();
  }, [setInventory, addNotification]);

  const handleUseItem = async (item: InventoryItem) => {
    try {
      await api.inventory.use(item.id);
      
      // Refresh inventory
      const response = await api.inventory.get();
      setInventory(response.data.data);
      
      addNotification({
        id: Date.now().toString(),
        type: 'success',
        title: 'Item Used!',
        message: `You used ${item.name}`,
      });
      
      setShowItemDetails(false);
    } catch (error: any) {
      addNotification({
        id: Date.now().toString(),
        type: 'error',
        title: 'Error',
        message: error.response?.data?.message || 'Gagal menggunakan item',
      });
    }
  };

  const handleEquipItem = async (item: InventoryItem) => {
    try {
      if (item.is_equipped) {
        await api.inventory.unequip(item.id);
      } else {
        await api.inventory.equip(item.id);
      }
      
      // Refresh inventory
      const response = await api.inventory.get();
      setInventory(response.data.data);
      
      addNotification({
        id: Date.now().toString(),
        type: 'success',
        title: item.is_equipped ? 'Item Unequipped' : 'Item Equipped!',
        message: `${item.name} has been ${item.is_equipped ? 'unequipped' : 'equipped'}`,
      });
      
      setShowItemDetails(false);
    } catch (error: any) {
      addNotification({
        id: Date.now().toString(),
        type: 'error',
        title: 'Error',
        message: error.response?.data?.message || 'Gagal equip/unequip item',
      });
    }
  };

  const getItemIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'tool':
        return Wrench;
      case 'resource':
        return Gem;
      case 'consumable':
        return Coffee;
      case 'equipment':
        return Shield;
      case 'weapon':
        return Sword;
      case 'book':
        return Book;
      case 'component':
        return Cpu;
      case 'design':
        return Palette;
      default:
        return Package;
    }
  };

  const getItemColor = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case 'common':
        return 'from-gray-500 to-gray-600';
      case 'uncommon':
        return 'from-green-500 to-green-600';
      case 'rare':
        return 'from-blue-500 to-blue-600';
      case 'epic':
        return 'from-purple-500 to-purple-600';
      case 'legendary':
        return 'from-yellow-500 to-orange-500';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const filteredItems = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || item.type === selectedType;
    const matchesRarity = selectedRarity === 'all' || item.rarity === selectedRarity;
    
    return matchesSearch && matchesType && matchesRarity && item.quantity > 0;
  });

  const groupedItems = {
    equipped: filteredItems.filter(item => item.is_equipped),
    tools: filteredItems.filter(item => item.type === 'tool' && !item.is_equipped),
    resources: filteredItems.filter(item => item.type === 'resource'),
    consumables: filteredItems.filter(item => item.type === 'consumable'),
    equipment: filteredItems.filter(item => item.type === 'equipment' && !item.is_equipped),
  };

  if (isLoading) {
    return (
      <GameLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading inventory...</p>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Inventory</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Manage your tools, resources, and equipment. Use items to boost your coding abilities!
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
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
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="tool">Tools</SelectItem>
                  <SelectItem value="resource">Resources</SelectItem>
                  <SelectItem value="consumable">Consumables</SelectItem>
                  <SelectItem value="equipment">Equipment</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedRarity} onValueChange={setSelectedRarity}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Rarity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Rarities</SelectItem>
                  <SelectItem value="common">Common</SelectItem>
                  <SelectItem value="uncommon">Uncommon</SelectItem>
                  <SelectItem value="rare">Rare</SelectItem>
                  <SelectItem value="epic">Epic</SelectItem>
                  <SelectItem value="legendary">Legendary</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </motion.div>

        {/* Inventory Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="all">All ({filteredItems.length})</TabsTrigger>
              <TabsTrigger value="equipped">Equipped ({groupedItems.equipped.length})</TabsTrigger>
              <TabsTrigger value="tools">Tools ({groupedItems.tools.length})</TabsTrigger>
              <TabsTrigger value="resources">Resources ({groupedItems.resources.length})</TabsTrigger>
              <TabsTrigger value="consumables">Consumables ({groupedItems.consumables.length})</TabsTrigger>
              <TabsTrigger value="equipment">Equipment ({groupedItems.equipment.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-6">
              <ItemGrid items={filteredItems} onItemClick={(item) => {
                setSelectedItem(item);
                setShowItemDetails(true);
              }} />
            </TabsContent>

            <TabsContent value="equipped" className="space-y-6">
              <ItemGrid items={groupedItems.equipped} onItemClick={(item) => {
                setSelectedItem(item);
                setShowItemDetails(true);
              }} />
            </TabsContent>

            <TabsContent value="tools" className="space-y-6">
              <ItemGrid items={groupedItems.tools} onItemClick={(item) => {
                setSelectedItem(item);
                setShowItemDetails(true);
              }} />
            </TabsContent>

            <TabsContent value="resources" className="space-y-6">
              <ItemGrid items={groupedItems.resources} onItemClick={(item) => {
                setSelectedItem(item);
                setShowItemDetails(true);
              }} />
            </TabsContent>

            <TabsContent value="consumables" className="space-y-6">
              <ItemGrid items={groupedItems.consumables} onItemClick={(item) => {
                setSelectedItem(item);
                setShowItemDetails(true);
              }} />
            </TabsContent>

            <TabsContent value="equipment" className="space-y-6">
              <ItemGrid items={groupedItems.equipment} onItemClick={(item) => {
                setSelectedItem(item);
                setShowItemDetails(true);
              }} />
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Item Details Modal */}
        <Dialog open={showItemDetails} onOpenChange={setShowItemDetails}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                {selectedItem && (
                  <>
                    <div className={`w-10 h-10 bg-gradient-to-r ${getItemColor(selectedItem.rarity)} rounded-xl flex items-center justify-center`}>
                      {(() => {
                        const ItemIcon = getItemIcon(selectedItem.type);
                        return <ItemIcon className="w-5 h-5 text-white" />;
                      })()}
                    </div>
                    <div>
                      <span>{selectedItem.name}</span>
                      <Badge className={`ml-2 ${getRarityColor(selectedItem.rarity)}`}>
                        {selectedItem.rarity}
                      </Badge>
                    </div>
                  </>
                )}
              </DialogTitle>
            </DialogHeader>

            {selectedItem && (
              <div className="space-y-6">
                <div>
                  <p className="text-gray-600 mb-4">{selectedItem.description}</p>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Type:</span>
                    <Badge variant="outline">{selectedItem.type}</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm mt-2">
                    <span className="text-gray-500">Quantity:</span>
                    <span className="font-semibold">{selectedItem.quantity}</span>
                  </div>

                  {selectedItem.price && (
                    <div className="flex items-center justify-between text-sm mt-2">
                      <span className="text-gray-500">Value:</span>
                      <span className="font-semibold">{selectedItem.price} coins</span>
                    </div>
                  )}
                </div>

                {/* Item Stats */}
                {selectedItem.stats && Object.keys(selectedItem.stats).length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Stats:</h4>
                    <div className="space-y-2">
                      {Object.entries(selectedItem.stats).map(([stat, value]) => (
                        <div key={stat} className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 capitalize">{stat.replace('_', ' ')}:</span>
                          <span className="font-semibold text-green-600">+{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3">
                  {selectedItem.type === 'consumable' && (
                    <Button
                      className="flex-1"
                      onClick={() => handleUseItem(selectedItem)}
                    >
                      <Zap className="w-4 h-4 mr-2" />
                      Use Item
                    </Button>
                  )}

                  {(selectedItem.type === 'equipment' || selectedItem.type === 'tool') && (
                    <Button
                      className="flex-1"
                      variant={selectedItem.is_equipped ? 'outline' : 'default'}
                      onClick={() => handleEquipItem(selectedItem)}
                    >
                      <Shield className="w-4 h-4 mr-2" />
                      {selectedItem.is_equipped ? 'Unequip' : 'Equip'}
                    </Button>
                  )}

                  <Button
                    variant="outline"
                    onClick={() => setShowItemDetails(false)}
                  >
                    Close
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </GameLayout>
  );
}

// Item Grid Component
function ItemGrid({ items, onItemClick }: { items: InventoryItem[], onItemClick: (item: InventoryItem) => void }) {
  const getItemIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'tool':
        return Wrench;
      case 'resource':
        return Gem;
      case 'consumable':
        return Coffee;
      case 'equipment':
        return Shield;
      default:
        return Package;
    }
  };

  const getItemColor = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case 'common':
        return 'from-gray-500 to-gray-600';
      case 'uncommon':
        return 'from-green-500 to-green-600';
      case 'rare':
        return 'from-blue-500 to-blue-600';
      case 'epic':
        return 'from-purple-500 to-purple-600';
      case 'legendary':
        return 'from-yellow-500 to-orange-500';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Package className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No items found</h3>
        <p className="text-gray-600">Complete quests and challenges to earn items</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {items.map((item, index) => {
        const ItemIcon = getItemIcon(item.type);
        const itemColor = getItemColor(item.rarity);
        
        return (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className="relative"
          >
            <Card 
              className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:-translate-y-1 aspect-square"
              onClick={() => onItemClick(item)}
            >
              <CardContent className="p-4 flex flex-col items-center justify-center h-full">
                <div className={`w-12 h-12 bg-gradient-to-r ${itemColor} rounded-xl flex items-center justify-center mb-3`}>
                  <ItemIcon className="w-6 h-6 text-white" />
                </div>
                
                <h4 className="font-semibold text-sm text-gray-900 text-center mb-1 line-clamp-2">
                  {item.name}
                </h4>
                
                <Badge className={`text-xs ${getRarityColor(item.rarity)} mb-2`}>
                  {item.rarity}
                </Badge>
                
                <div className="text-xs text-gray-500">
                  Qty: {item.quantity}
                </div>
                
                {item.is_equipped && (
                  <div className="absolute top-2 right-2">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <Settings className="w-3 h-3 text-white" />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}