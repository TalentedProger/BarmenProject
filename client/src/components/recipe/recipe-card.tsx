import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Heart, Clock, DollarSign } from "lucide-react";
import { useState } from "react";
import type { Recipe } from "@shared/schema";

interface RecipeCardProps {
  recipe: Recipe;
  onFavorite?: (recipeId: string) => void;
  onView?: (recipeId: string) => void;
  isFavorite?: boolean;
}

export default function RecipeCard({ recipe, onFavorite, onView, isFavorite = false }: RecipeCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFavorite?.(recipe.id);
  };

  const handleViewClick = () => {
    onView?.(recipe.id);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'hard': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'classic': return 'bg-neon-amber';
      case 'summer': return 'bg-neon-turquoise';
      case 'shot': return 'bg-neon-pink';
      case 'nonalcoholic': return 'bg-green-500';
      default: return 'bg-neon-purple';
    }
  };

  return (
    <Card 
      className="glass-effect border-none hover:scale-105 transition-transform cursor-pointer overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleViewClick}
    >
      {/* Recipe Image Placeholder */}
      <div className="w-full h-48 bg-gradient-to-br from-neon-purple/20 to-neon-turquoise/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent"></div>
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-center justify-between">
            <Badge className={`${getCategoryColor(recipe.category)} text-night-blue`}>
              {recipe.category}
            </Badge>
            <Badge className={`${getDifficultyColor(recipe.difficulty)} text-white`}>
              {recipe.difficulty}
            </Badge>
          </div>
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="mb-3">
          <h3 className="text-xl font-bold text-neon-turquoise mb-2 line-clamp-1">
            {recipe.name}
          </h3>
          <p className="text-cream text-sm mb-3 line-clamp-2">
            {recipe.description || 'Описание не указано'}
          </p>
        </div>
        
        {/* Stats */}
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4 text-neon-amber" />
              <span className="text-neon-amber font-semibold text-sm">
                {recipe.totalAbv}%
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <DollarSign className="h-4 w-4 text-neon-pink" />
              <span className="text-neon-pink font-semibold text-sm">
                ₽{recipe.totalCost}
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-cream">
              {recipe.totalVolume}ml
            </div>
          </div>
        </div>
        
        {/* Rating and Favorite */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <div className="flex items-center text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(parseFloat(recipe.rating?.toString() || '0')) 
                      ? 'fill-current' 
                      : 'stroke-current'
                  }`}
                />
              ))}
            </div>
            <span className="ml-2 text-cream text-sm">
              {recipe.rating || '0'} ({recipe.ratingCount || 0})
            </span>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleFavoriteClick}
            className={`${
              isFavorite 
                ? 'text-neon-pink' 
                : 'text-neon-turquoise hover:text-neon-pink'
            } transition-colors`}
          >
            <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
