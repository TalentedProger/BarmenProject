import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Wine,
  Filter,
  MoreHorizontal
} from "lucide-react";
import type { Ingredient } from "@shared/schema";

interface IngredientsResponse {
  ingredients: Ingredient[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const CATEGORIES = [
  { value: '', label: 'Все категории' },
  { value: 'alcohol', label: 'Алкоголь' },
  { value: 'juice', label: 'Соки' },
  { value: 'syrup', label: 'Сиропы' },
  { value: 'mixer', label: 'Миксеры' },
  { value: 'soda', label: 'Газировка' },
  { value: 'energy_drink', label: 'Энергетики' },
  { value: 'fruit', label: 'Фрукты' },
  { value: 'bitter', label: 'Биттеры' },
  { value: 'garnish', label: 'Декор' },
  { value: 'ice', label: 'Лёд' }
];

interface IngredientFormData {
  name: string;
  category: string;
  color: string;
  abv: number;
  pricePerLiter: number;
  tasteProfile: {
    sweet: number;
    sour: number;
    bitter: number;
    alcohol: number;
  };
  unit: string;
}

export default function IngredientsManager() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Состояние фильтров и пагинации
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingIngredient, setEditingIngredient] = useState<Ingredient | null>(null);

  // Состояние формы
  const [formData, setFormData] = useState<IngredientFormData>({
    name: '',
    category: 'alcohol',
    color: '#FFFFFF',
    abv: 0,
    pricePerLiter: 0,
    tasteProfile: {
      sweet: 5,
      sour: 5,
      bitter: 5,
      alcohol: 5
    },
    unit: 'ml'
  });

  // Загрузка ингредиентов
  const { data: ingredientsData, isLoading, error } = useQuery<IngredientsResponse>({
    queryKey: ['/api/admin/ingredients', { page, category, search }],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20'
      });
      if (category) params.append('category', category);
      if (search) params.append('search', search);

      const response = await apiRequest('GET', `/api/admin/ingredients?${params}`);
      return response.json();
    },
  });

  // Мутация создания ингредиента
  const createIngredientMutation = useMutation({
    mutationFn: async (data: IngredientFormData) => {
      const response = await apiRequest('POST', '/api/admin/ingredients', data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Успех",
        description: "Ингредиент создан успешно",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/ingredients'] });
      setIsCreateDialogOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      toast({
        title: "Ошибка",
        description: error.message || "Не удалось создать ингредиент",
        variant: "destructive",
      });
    },
  });

  // Мутация обновления ингредиента
  const updateIngredientMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<IngredientFormData> }) => {
      const response = await apiRequest('PUT', `/api/admin/ingredients/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Успех",
        description: "Ингредиент обновлен успешно",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/ingredients'] });
      setEditingIngredient(null);
      resetForm();
    },
    onError: (error: any) => {
      toast({
        title: "Ошибка",
        description: error.message || "Не удалось обновить ингредиент",
        variant: "destructive",
      });
    },
  });

  // Мутация удаления ингредиента
  const deleteIngredientMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest('DELETE', `/api/admin/ingredients/${id}`);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Успех",
        description: "Ингредиент удален успешно",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/ingredients'] });
    },
    onError: (error: any) => {
      toast({
        title: "Ошибка",
        description: error.message || "Не удалось удалить ингредиент",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      name: '',
      category: 'alcohol',
      color: '#FFFFFF',
      abv: 0,
      pricePerLiter: 0,
      tasteProfile: {
        sweet: 5,
        sour: 5,
        bitter: 5,
        alcohol: 5
      },
      unit: 'ml'
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingIngredient) {
      updateIngredientMutation.mutate({
        id: editingIngredient.id,
        data: formData
      });
    } else {
      createIngredientMutation.mutate(formData);
    }
  };

  const handleEdit = (ingredient: Ingredient) => {
    setEditingIngredient(ingredient);
    setFormData({
      name: ingredient.name,
      category: ingredient.category,
      color: ingredient.color,
      abv: parseFloat(ingredient.abv.toString()),
      pricePerLiter: parseFloat(ingredient.pricePerLiter.toString()),
      tasteProfile: ingredient.tasteProfile,
      unit: ingredient.unit
    });
  };

  const handleDelete = (id: number) => {
    if (confirm('Вы уверены, что хотите удалить этот ингредиент?')) {
      deleteIngredientMutation.mutate(id);
    }
  };

  const getCategoryLabel = (categoryValue: string) => {
    const category = CATEGORIES.find(cat => cat.value === categoryValue);
    return category?.label || categoryValue;
  };

  return (
    <div className="space-y-6">
      {/* Заголовок и кнопки */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-neon-pink">
            <Wine className="inline mr-2 h-6 w-6" />
            Управление ингредиентами
          </h2>
          <p className="text-cream">
            Всего ингредиентов: {ingredientsData?.pagination.total || 0}
          </p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-neon-pink text-night-blue">
              <Plus className="mr-2 h-4 w-4" />
              Добавить ингредиент
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingIngredient ? 'Редактировать ингредиент' : 'Создать ингредиент'}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Название</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="category">Категория</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))} modal={false}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent
                      position="popper"
                      side="bottom"
                      align="start"
                      sideOffset={4}
                      className="max-h-[300px] overflow-y-auto"
                    >
                      {CATEGORIES.slice(1).map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="color">Цвет</Label>
                  <div className="flex gap-2">
                    <Input
                      id="color"
                      type="color"
                      value={formData.color}
                      onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                      className="w-16 h-10 p-1"
                    />
                    <Input
                      value={formData.color}
                      onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                      placeholder="#FFFFFF"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="abv">Крепость (%)</Label>
                  <Input
                    id="abv"
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={formData.abv}
                    onChange={(e) => setFormData(prev => ({ ...prev, abv: parseFloat(e.target.value) || 0 }))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="price">Цена за литр (₽)</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.pricePerLiter}
                    onChange={(e) => setFormData(prev => ({ ...prev, pricePerLiter: parseFloat(e.target.value) || 0 }))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="unit">Единица измерения</Label>
                <Select value={formData.unit} onValueChange={(value) => setFormData(prev => ({ ...prev, unit: value }))} modal={false}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent
                    position="popper"
                    side="bottom"
                    align="start"
                    sideOffset={4}
                    avoidCollisions={false}
                    className="max-h-[300px] overflow-y-auto"
                  >
                    <SelectItem value="ml">мл</SelectItem>
                    <SelectItem value="g">г</SelectItem>
                    <SelectItem value="piece">шт</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Вкусовой профиль (0-10)</Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  {Object.entries(formData.tasteProfile).map(([key, value]) => (
                    <div key={key}>
                      <Label htmlFor={key} className="text-sm">
                        {key === 'sweet' ? 'Сладость' : 
                         key === 'sour' ? 'Кислотность' :
                         key === 'bitter' ? 'Горечь' : 'Алкогольность'}: {value}
                      </Label>
                      <Input
                        id={key}
                        type="range"
                        min="0"
                        max="10"
                        value={value}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          tasteProfile: {
                            ...prev.tasteProfile,
                            [key]: parseInt(e.target.value)
                          }
                        }))}
                        className="w-full"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setIsCreateDialogOpen(false);
                    setEditingIngredient(null);
                    resetForm();
                  }}
                >
                  Отмена
                </Button>
                <Button 
                  type="submit" 
                  className="bg-neon-pink text-night-blue"
                  disabled={createIngredientMutation.isPending || updateIngredientMutation.isPending}
                >
                  {editingIngredient ? 'Обновить' : 'Создать'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Фильтры */}
      <Card className="glass-effect border-none">
        <CardContent className="p-4">
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <Label htmlFor="search">Поиск</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Поиск по названию..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="category-filter">Категория</Label>
              <Select value={category} onValueChange={setCategory} modal={false}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent
                  position="popper"
                  side="bottom"
                  align="start"
                  sideOffset={4}
                  avoidCollisions={false}
                  className="max-h-[300px] overflow-y-auto"
                >
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              variant="outline"
              onClick={() => {
                setSearch('');
                setCategory('');
                setPage(1);
              }}
            >
              <Filter className="mr-2 h-4 w-4" />
              Сбросить
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Список ингредиентов */}
      <Card className="glass-effect border-none">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neon-pink mx-auto"></div>
              <p className="mt-2 text-cream">Загрузка ингредиентов...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center text-red-400">
              Ошибка загрузки ингредиентов
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-gray-600">
                    <tr>
                      <th className="text-left p-4 text-cream">Ингредиент</th>
                      <th className="text-left p-4 text-cream">Категория</th>
                      <th className="text-left p-4 text-cream">Крепость</th>
                      <th className="text-left p-4 text-cream">Цена</th>
                      <th className="text-left p-4 text-cream">Единица</th>
                      <th className="text-right p-4 text-cream">Действия</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ingredientsData?.ingredients.map((ingredient) => (
                      <tr key={ingredient.id} className="border-b border-gray-700 hover:bg-gray-800/50">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-4 h-4 rounded-full"
                              style={{ backgroundColor: ingredient.color }}
                            />
                            <span className="font-medium text-cream">{ingredient.name}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge variant="outline">
                            {getCategoryLabel(ingredient.category)}
                          </Badge>
                        </td>
                        <td className="p-4 text-cream">
                          {parseFloat(ingredient.abv.toString())}%
                        </td>
                        <td className="p-4 text-cream">
                          {parseFloat(ingredient.pricePerLiter.toString())}₽
                        </td>
                        <td className="p-4 text-cream">
                          {ingredient.unit}
                        </td>
                        <td className="p-4">
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(ingredient)}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDelete(ingredient.id)}
                              disabled={deleteIngredientMutation.isPending}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Пагинация */}
              {ingredientsData && ingredientsData.pagination.totalPages > 1 && (
                <div className="p-4 border-t border-gray-600 flex justify-between items-center">
                  <p className="text-sm text-cream">
                    Страница {ingredientsData.pagination.page} из {ingredientsData.pagination.totalPages}
                    ({ingredientsData.pagination.total} всего)
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page <= 1}
                      onClick={() => setPage(page - 1)}
                    >
                      Назад
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page >= ingredientsData.pagination.totalPages}
                      onClick={() => setPage(page + 1)}
                    >
                      Вперед
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Диалог редактирования */}
      <Dialog open={!!editingIngredient} onOpenChange={(open) => {
        if (!open) {
          setEditingIngredient(null);
          resetForm();
        }
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Редактировать ингредиент</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Та же форма, что и для создания */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-name">Название</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="edit-category">Категория</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))} modal={false}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent
                    position="popper"
                    side="bottom"
                    align="start"
                    sideOffset={4}
                    avoidCollisions={false}
                    className="max-h-[300px] overflow-y-auto"
                  >
                    {CATEGORIES.slice(1).map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setEditingIngredient(null);
                  resetForm();
                }}
              >
                Отмена
              </Button>
              <Button 
                type="submit" 
                className="bg-neon-pink text-night-blue"
                disabled={updateIngredientMutation.isPending}
              >
                Обновить
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
