import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Ingredient } from "@shared/schema";

interface IngredientCardProps {
  ingredient: Ingredient;
  onAdd: (ingredient: Ingredient, amount: number) => void;
  disabled?: boolean;
}

export default function IngredientCard({ ingredient, onAdd, disabled = false }: IngredientCardProps) {
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

  const formatPrice = (price: string, unit: string) => {
    const priceNum = parseFloat(price);
    const unitLabel = unit === 'kg' ? 'кг' : unit === 'ml' ? 'л' : unit;
    return `${priceNum.toFixed(0)} ₽/${unitLabel}`;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-3 hover:shadow-lg transition-all duration-200 hover:border-primary/50">
      {/* Top row - Name and info */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div 
            className="w-3 h-3 rounded-full flex-shrink-0"
            style={{ backgroundColor: ingredient.color }}
          ></div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground text-sm truncate">
              {ingredient.name}
            </h3>
            <p className="text-xs text-muted-foreground capitalize">
              {ingredient.category}
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
          <span className="text-xs font-medium min-w-[40px] text-center text-blue-500">
            {ingredient.unit === 'kg' ? 
              `${Math.round(amount * 1000)} г` : 
              `${Math.round(amount)} ml`
            }
          </span>
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
            className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 h-6 text-xs"
          >
            Добавить
          </Button>
        </div>
      </div>
    </div>
  );
}