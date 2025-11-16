import React, { useCallback, useTransition, memo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Minus, Plus, X } from "lucide-react";
import { useCocktailStore } from "@/store/cocktail-store";
import { EditableAmount } from "@/components/ui/editable-amount";

const getCategoryLabel = (category: string) => {
  switch (category) {
    case 'alcohol': return 'Алкоголь';
    case 'juice': return 'Соки';
    case 'syrup': return 'Сиропы';
    case 'fruit': return 'Фрукты';
    case 'ice': return 'Лёд';
    case 'bitter': return 'Биттеры';
    case 'garnish': return 'Декор';
    case 'soda': return 'Газировка';
    case 'energy_drink': return 'Энергетики';
    default: return category;
  }
};

// Мемоизированный компонент карточки ингредиента
const IngredientItem = memo(({ 
  item, 
  index, 
  onUpdateAmount, 
  onRemove,
  onDirectChange 
}: {
  item: any;
  index: number;
  onUpdateAmount: (index: number, delta: number) => void;
  onRemove: (index: number) => void;
  onDirectChange: (index: number, amount: number) => void;
}) => {
  const numericAmount = parseFloat(item.amount) || 0;
  // Используем единицу элемента рецепта, а не исходного ингредиента
  const isKgUnit = item.unit === 'kg';
  const isGramUnit = item.unit === 'g';
  const displayAmount = isKgUnit ? Math.round(numericAmount * 1000) : Math.round(numericAmount);
  const displayUnit = isKgUnit ? 'г' : item.unit;
  
  return (
    <div className="relative p-3 bg-muted rounded-lg">
      <Button
        size="sm"
        variant="destructive"
        onClick={() => onRemove(index)}
        className="absolute top-2 right-2 h-5 w-5 p-0 rounded-full z-10"
      >
        <X className="h-2.5 w-2.5" />
      </Button>

      <div className="flex items-center space-x-3 pr-8 mb-3 sm:mb-0 sm:pr-8">
        <div 
          className="w-4 h-4 rounded-full flex-shrink-0"
          style={{ backgroundColor: item.ingredient.color }}
        />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-foreground truncate text-sm">{item.ingredient.name}</p>
          <Badge variant="outline" className="text-xs">
            {getCategoryLabel(item.ingredient.category)}
          </Badge>
        </div>
        
        <div className="hidden sm:flex items-center space-x-2 flex-shrink-0">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onUpdateAmount(index, -1)}
            className="h-6 w-6 p-0"
            disabled={displayAmount <= (isKgUnit ? 10 : 5)}
          >
            <Minus className="h-3 w-3" />
          </Button>
          
          <EditableAmount
            amount={numericAmount}
            unit={item.unit}
            minAmount={isKgUnit ? 10 : 5}
            maxAmount={isKgUnit ? 500 : 500}
            onAmountChange={(newAmount) => onDirectChange(index, newAmount)}
            displayUnit={displayUnit}
            className="min-w-[50px]"
            enableDynamicVolumeLimit={false}
          />
          
          <Button
            size="sm"
            variant="outline"
            onClick={() => onUpdateAmount(index, 1)}
            className="h-6 w-6 p-0"
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-center space-x-2 sm:hidden">
        <Button
          size="sm"
          variant="outline"
          onClick={() => onUpdateAmount(index, -1)}
          className="h-7 w-7 p-0"
          disabled={displayAmount <= (isKgUnit ? 10 : 5)}
        >
          <Minus className="h-3 w-3" />
        </Button>
        
        <EditableAmount
          amount={numericAmount}
          unit={item.unit}
          minAmount={isKgUnit ? 10 : 5}
          maxAmount={isKgUnit ? 500 : 500}
          onAmountChange={(newAmount) => onDirectChange(index, newAmount)}
          displayUnit={displayUnit}
          className="min-w-[60px]"
          enableDynamicVolumeLimit={false}
        />
        
        <Button
          size="sm"
          variant="outline"
          onClick={() => onUpdateAmount(index, 1)}
          className="h-7 w-7 p-0"
        >
          <Plus className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
});

IngredientItem.displayName = 'IngredientItem';

function IngredientSelector() {
  const { ingredients, updateIngredient, removeIngredient } = useCocktailStore();
  const [isPending, startTransition] = useTransition();

  const handleUpdateAmount = useCallback((index: number, delta: number) => {
    startTransition(() => {
      const currentAmount = parseFloat(ingredients[index].amount) || 0;
      // Используем единицу самого элемента рецепта
      const unit = ingredients[index].unit;
      
      if (unit === 'kg') {
        // Храним кг во внутреннем состоянии, шаги в граммах (±5 г)
        const gramsAmount = Math.round(currentAmount * 1000);
        const newGrams = Math.max(10, gramsAmount + delta * 5);
        const newKgAmount = newGrams / 1000;
        updateIngredient(index, newKgAmount);
      } else if (unit === 'g') {
        // Прямые граммы (±5 г)
        const gramsAmount = Math.round(currentAmount);
        const newGrams = Math.max(10, gramsAmount + delta * 5);
        updateIngredient(index, newGrams);
      } else if (unit === 'piece') {
        const newPieces = Math.max(1, Math.round(currentAmount + delta * 1));
        updateIngredient(index, newPieces);
      } else {
        // ml и прочие: шаг 5 мл
        const newAmount = Math.max(5, currentAmount + delta * 5);
        updateIngredient(index, newAmount);
      }
    });
  }, [ingredients, updateIngredient]);

  const handleDirectAmountChange = useCallback((index: number, newAmount: number) => {
    startTransition(() => {
      updateIngredient(index, newAmount);
    });
  }, [updateIngredient]);
  
  const handleRemove = useCallback((index: number) => {
    startTransition(() => {
      removeIngredient(index);
    });
  }, [removeIngredient]);

  return (
    <div className="flex flex-col h-full">
      <h3 className="text-lg font-semibold mb-4 text-foreground text-center">
        Добавленные ингредиенты
      </h3>
      
      <div className="flex-1">
        {ingredients.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">Пока нет добавленных ингредиентов</p>
        ) : (
          <div className="space-y-2" style={{ opacity: isPending ? 0.7 : 1 }}>
            {ingredients.map((item, index) => (
              <IngredientItem
                key={`${item.ingredient.id}-${index}`}
                item={item}
                index={index}
                onUpdateAmount={handleUpdateAmount}
                onRemove={handleRemove}
                onDirectChange={handleDirectAmountChange}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default IngredientSelector;