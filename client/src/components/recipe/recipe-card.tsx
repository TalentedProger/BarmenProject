import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Heart, Droplet, Percent, Coins } from "lucide-react";
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
      className="glass-effect border-none hover:scale-[1.02] transition-all duration-500 cursor-pointer overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleViewClick}
    >
      {/* Recipe Image with Gradient Background */}
      <div className="w-full h-48 bg-gradient-to-br from-purple-900 to-blue-900 relative overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-black/20"></div>
        <h3 className="text-3xl font-bold text-white text-center px-6 relative z-10 drop-shadow-lg">
          {recipe.name}
        </h3>
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
          <p className="text-cream text-sm mb-3 line-clamp-2">
            {recipe.description || 'Описание не указано'}
          </p>
        </div>
        
        {/* Stats */}
        <div className="flex justify-between items-center mb-3 gap-3">
          <span className="inline-flex items-center gap-2 text-cream font-semibold text-sm">
            <span
              className="inline-flex items-center justify-center w-6 h-6 rounded-full shadow-md"
              style={{
                background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.35) 0%, rgba(236, 72, 153, 0.35) 100%)',
                backdropFilter: 'blur(6px)',
                border: '1px solid rgba(255,255,255,0.18)'
              }}
            >
              <Percent className="w-3.5 h-3.5 text-white" />
            </span>
            {recipe.totalAbv}%
          </span>
          <span className="inline-flex items-center gap-2 text-cream font-semibold text-sm">
            <span
              className="inline-flex items-center justify-center w-6 h-6 rounded-full shadow-md"
              style={{
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.35) 0%, rgba(5, 150, 105, 0.35) 100%)',
                backdropFilter: 'blur(6px)',
                border: '1px solid rgba(255,255,255,0.18)'
              }}
            >
              <Coins className="w-3.5 h-3.5 text-white" />
            </span>
            ₽{recipe.totalCost}
          </span>
          <span className="inline-flex items-center gap-2 text-cream font-semibold text-sm">
            <span
              className="inline-flex items-center justify-center w-6 h-6 rounded-full shadow-md"
              style={{
                background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.35) 0%, rgba(59, 130, 246, 0.35) 100%)',
                backdropFilter: 'blur(6px)',
                border: '1px solid rgba(255,255,255,0.18)'
              }}
            >
              <Droplet className="w-3.5 h-3.5 text-white" />
            </span>
            {recipe.totalVolume}ml
          </span>
        </div>
        
        {/* Rating and Favorite */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <span
              className="inline-flex items-center justify-center w-6 h-6 rounded-full shadow-md"
              style={{
                background: 'linear-gradient(135deg, rgba(250, 204, 21, 0.35) 0%, rgba(251, 191, 36, 0.35) 100%)',
                backdropFilter: 'blur(6px)',
                border: '1px solid rgba(255,255,255,0.18)'
              }}
            >
              <Star className="w-3.5 h-3.5 text-yellow-300" />
            </span>
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
