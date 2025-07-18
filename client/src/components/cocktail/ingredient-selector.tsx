import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Minus } from "lucide-react";
import { useCocktailStore } from "@/store/cocktail-store";

export default function IngredientSelector() {
  const { ingredients, updateIngredient, removeIngredient } = useCocktailStore();

  const handleUpdateAmount = (index: number, value: string) => {
    const amount = parseFloat(value) || 0;
    updateIngredient(index, amount);
  };

  return (
    <div className="flex flex-col h-full">
      <h3 className="text-lg font-semibold mb-4 text-foreground">
        Добавленные ингредиенты
      </h3>
      
      <div className="flex-1">
        {ingredients.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">Пока нет добавленных ингредиентов</p>
        ) : (
          <div className="space-y-2">
            {ingredients.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-muted rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: item.ingredient.color }}
                  ></div>
                  <div>
                    <p className="font-semibold text-foreground">{item.ingredient.name}</p>
                    <Badge variant="outline" className="text-xs">
                      {item.ingredient.category}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Input
                    type="number"
                    value={item.amount}
                    onChange={(e) => handleUpdateAmount(index, e.target.value)}
                    className="w-16 h-8 text-center"
                    min="0"
                    step="0.1"
                  />
                  <span className="text-sm text-muted-foreground">{item.unit}</span>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => removeIngredient(index)}
                    className="h-8 w-8 p-0"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}