import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Minus, Plus, X } from "lucide-react";
import { useCocktailStore } from "@/store/cocktail-store";

export default function IngredientSelector() {
  const { ingredients, updateIngredient, removeIngredient } = useCocktailStore();

  const handleUpdateAmount = (index: number, delta: number) => {
    const currentAmount = parseFloat(ingredients[index].amount) || 0;
    const unit = ingredients[index].ingredient.unit;
    
    // For fruits (kg), work in grams with 5g increments, minimum 10g
    if (unit === 'kg') {
      const gramsAmount = Math.round(currentAmount * 1000); // Convert to grams
      const newGrams = Math.max(10, gramsAmount + delta * 5); // 5g increments, min 10g
      const newKgAmount = newGrams / 1000; // Convert back to kg
      updateIngredient(index, newKgAmount);
    } else {
      // For liquids (ml), use direct amount with 5ml increments, minimum 5ml
      const newAmount = Math.max(5, currentAmount + delta * 5);
      updateIngredient(index, newAmount);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <h3 className="text-lg font-semibold mb-4 text-foreground text-center">
        Добавленные ингредиенты
      </h3>
      
      <div className="flex-1">
        {ingredients.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">Пока нет добавленных ингредиентов</p>
        ) : (
          <div className="space-y-2">
            {ingredients.map((item, index) => {
              const numericAmount = parseFloat(item.amount) || 0;
              const displayAmount = item.ingredient.unit === 'kg' ? 
                Math.round(numericAmount * 1000) : // Show in grams for fruits
                Math.round(numericAmount); // Show in ml for liquids
              const displayUnit = item.ingredient.unit === 'kg' ? 'г' : item.unit;
              
              return (
                <div
                  key={index}
                  className="relative flex items-center justify-between p-3 bg-muted rounded-lg"
                >
                  {/* Remove button in top-right corner */}
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => removeIngredient(index)}
                    className="absolute top-2 right-2 h-6 w-6 p-0 rounded-full"
                  >
                    <X className="h-3 w-3" />
                  </Button>

                  <div className="flex items-center space-x-3 flex-1 pr-12">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: item.ingredient.color }}
                    ></div>
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">{item.ingredient.name}</p>
                      <Badge variant="outline" className="text-xs">
                        {item.ingredient.category}
                      </Badge>
                    </div>
                  </div>

                  {/* Amount controls */}
                  <div className="flex items-center space-x-2 mr-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleUpdateAmount(index, -1)}
                      className="h-7 w-7 p-0"
                      disabled={displayAmount <= (item.ingredient.unit === 'kg' ? 10 : 5)}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    
                    <span className="text-sm font-medium min-w-[50px] text-center">
                      {displayAmount} {displayUnit}
                    </span>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleUpdateAmount(index, 1)}
                      className="h-7 w-7 p-0"
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}