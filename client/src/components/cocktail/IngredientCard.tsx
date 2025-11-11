import { useState } from 'react';
import { Plus, Minus, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Ingredient } from "@shared/schema";
import { EditableAmount } from "@/components/ui/editable-amount";

const getCategoryLabel = (category: string) => {
  switch (category) {
    case 'alcohol': return 'Алкоголь';
    case 'juice': return 'Соки';
    case 'syrup': return 'Сиропы';
    case 'fruit': return 'Фрукты';
    case 'ice': return 'Лёд';
    case 'mixer': return 'Миксеры';
    case 'bitter': return 'Биттеры';
    case 'garnish': return 'Декор';
    case 'soda': return 'Газировка';
    case 'energy_drink': return 'Энергетики';
    default: return category;
  }
};

interface IngredientCardProps {
  ingredient: Ingredient;
  onAdd: (ingredient: Ingredient, amount: number) => void;
  disabled?: boolean;
  glassCapacity?: number; // Емкость выбранного стакана
  currentTotalVolume?: number; // Текущий общий объем всех ингредиентов
  ingredientIndex?: number; // Индекс для логики первого ингредиента
}

export default function IngredientCard({ 
  ingredient, 
  onAdd, 
  disabled = false, 
  glassCapacity,
  currentTotalVolume = 0,
  ingredientIndex
}: IngredientCardProps) {
  // Default amounts: 10g for fruits (kg), 30ml for liquids (ml)
  const defaultAmount = ingredient.unit === 'kg' ? 0.01 : 30; // 0.01 kg = 10g
  const [amount, setAmount] = useState(defaultAmount);

  // Generate placeholder images with gradients based on ingredient color
  const getIngredientImage = (ingredient: Ingredient) => {
    // Create SVG gradient placeholder based on ingredient color
    const color = ingredient.color || '#CCCCCC';
    // Use encodeURIComponent instead of btoa to handle cyrillic characters
    const svgContent = `<svg width="80" height="80" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="grad" cx="50%" cy="30%" r="60%">
            <stop offset="0%" style="stop-color:${color};stop-opacity:0.9" />
            <stop offset="100%" style="stop-color:${color};stop-opacity:0.6" />
          </radialGradient>
        </defs>
        <rect width="80" height="80" rx="12" fill="url(#grad)"/>
        <circle cx="40" cy="35" r="15" fill="white" opacity="0.3"/>
        <text x="40" y="65" text-anchor="middle" fill="white" font-size="8" font-weight="bold">${ingredient.name.slice(0, 6)}</text>
      </svg>`;
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgContent)}`;
  };

  const handleAmountChange = (delta: number) => {
    if (ingredient.unit === 'kg') {
      // For fruits: work in grams, 5g increments, minimum 10g
      const currentGrams = Math.round(amount * 1000);
      const newGrams = Math.max(10, currentGrams + delta * 5);
      setAmount(newGrams / 1000); // Convert back to kg
    } else {
      // For liquids: 5ml increments, minimum 5ml
      const newAmount = Math.max(5, amount + delta * 5);
      setAmount(newAmount);
    }
  };

  const formatPrice = (pricePerLiter: string | number, unit: string) => {
    // Convert to number if it's a string
    const priceValue = typeof pricePerLiter === 'string' ? parseFloat(pricePerLiter) : pricePerLiter;
    
    // For kg: price is in kopecks, divide by 100 to get rubles
    // For ml: price is already in rubles per liter
    const priceNum = unit === 'kg' ? priceValue / 100 : priceValue;
    const unitLabel = unit === 'kg' ? 'кг' : unit === 'ml' ? 'л' : unit;
    return `${priceNum.toFixed(0)} ₽/${unitLabel}`;
  };

  // Truncate name to 26 characters
  const displayName = ingredient.name.length > 26 
    ? ingredient.name.slice(0, 26) + '...' 
    : ingredient.name;

  // Show image for all categories - use real image if available, otherwise placeholder
  const showImage = true; // Always show images for all categories
  const imageUrl = ingredient.imageUrl || getIngredientImage(ingredient);

  return (
    <div className="bg-card border border-border rounded-lg p-3 hover:shadow-lg transition-all duration-200 hover:border-primary/50 flex gap-3">
      {/* Product image - shown for all categories */}
      {showImage && (
        <div className="flex-shrink-0 w-[60px] h-[60px] lg:w-[50px] lg:h-[50px] xl:w-[60px] xl:h-[60px] flex items-center justify-center overflow-hidden rounded">
          <img 
            src={imageUrl} 
            alt={ingredient.name}
            className="w-full h-full object-contain"
            loading="lazy"
            decoding="async"
            width="60"
            height="60"
            onError={(e) => {
              // Fallback to SVG placeholder if image fails to load
              e.currentTarget.src = getIngredientImage(ingredient);
            }}
          />
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 min-w-0">
        {/* Top row - Name and info */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {!showImage && (
              <div 
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: ingredient.color }}
              ></div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-foreground text-sm truncate">
                  {displayName}
                </h3>
              {ingredient.sourceUrl && ingredient.sourceName && (
                <a
                  href={ingredient.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 group"
                  title={`Открыть на ${ingredient.sourceName}`}
                  onClick={(e) => e.stopPropagation()}
                >
                  {ingredient.sourceIcon ? (
                    <img 
                      src={ingredient.sourceIcon} 
                      alt={ingredient.sourceName}
                      className="w-4 h-4 rounded opacity-70 group-hover:opacity-100 transition-opacity"
                    />
                  ) : (
                    <ExternalLink className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                  )}
                </a>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {getCategoryLabel(ingredient.category)}
              {ingredient.volume && ` • ${ingredient.volume}мл`}
            </p>
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-xs font-medium text-green-500">
            {formatPrice(ingredient.pricePerLiter, ingredient.unit)}
          </p>
          {ingredient.abv && parseFloat(ingredient.abv) > 0 && (
            <p className="text-xs text-yellow-500">
              {ingredient.abv}%
            </p>
          )}
        </div>
      </div>

      {/* Bottom section - always in one row */}
      <div className="flex items-center justify-between gap-2">
        {/* Amount controls */}
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleAmountChange(-1)}
            disabled={ingredient.unit === 'kg' ? 
              Math.round(amount * 1000) <= 10 : // 10g minimum for fruits
              amount <= 5 // 5ml minimum for liquids
            }
            className="h-6 w-6 p-0"
          >
            <Minus className="h-3 w-3" />
          </Button>
          <EditableAmount
            amount={amount}
            unit={ingredient.unit}
            minAmount={ingredient.unit === 'kg' ? 10 : 5}
            maxAmount={ingredient.unit === 'kg' ? 500 : 500}
            onAmountChange={setAmount}
            displayUnit={ingredient.unit === 'kg' ? 'г' : 'ml'}
            glassCapacity={glassCapacity}
            currentTotalVolume={currentTotalVolume}
            ingredientIndex={ingredientIndex}
            enableDynamicVolumeLimit={true}
          />
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleAmountChange(1)}
            className="h-6 w-6 p-0"
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>

        {/* Add button */}
        <div className="flex justify-center">
          <Button
            size="sm"
            onClick={() => onAdd(ingredient, amount)}
            disabled={disabled}
            className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 lg:px-2 xl:px-4 h-6 text-xs"
          >
            <span className="lg:hidden xl:inline">Добавить</span>
            <span className="hidden lg:inline xl:hidden">+</span>
          </Button>
        </div>
      </div>
      </div>
    </div>
  );
}