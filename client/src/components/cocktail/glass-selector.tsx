import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wine, GlassWater, Circle } from "lucide-react";
import { useCocktailStore } from "@/store/cocktail-store";
import { useQuery } from "@tanstack/react-query";
import type { GlassType } from "@shared/schema";

const GlassIcon = ({ shape }: { shape: string }) => {
  switch (shape) {
    case 'martini':
      return <Wine className="text-3xl" />;
    case 'highball':
      return <GlassWater className="text-3xl" />;
    case 'shot':
      return <Circle className="text-3xl" />;
    default:
      return <GlassWater className="text-3xl" />;
  }
};

export default function GlassSelector() {
  const { selectedGlass, setSelectedGlass } = useCocktailStore();
  
  const { data: glassTypes = [], isLoading } = useQuery<GlassType[]>({
    queryKey: ['/api/glass-types'],
  });

  if (isLoading) {
    return (
      <Card className="glass-effect border-none">
        <CardContent className="p-6">
          <h3 className="text-2xl font-semibold mb-4 text-neon-turquoise">
            Выбор стакана
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="border-2 border-gray-600 rounded-lg p-4 text-center animate-pulse">
                <div className="h-12 w-12 bg-gray-600 rounded mx-auto mb-2"></div>
                <div className="h-4 bg-gray-600 rounded mb-1"></div>
                <div className="h-3 bg-gray-600 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-effect border-none">
      <CardContent className="p-6">
        <h3 className="text-2xl font-semibold mb-4 text-neon-turquoise">
          Выбор стакана
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {glassTypes.map((glass) => (
            <Button
              key={glass.id}
              variant="outline"
              className={`p-4 h-auto flex flex-col items-center space-y-2 ${
                selectedGlass?.id === glass.id 
                  ? 'neon-border bg-neon-turquoise/20 text-neon-turquoise' 
                  : 'border-gray-600 hover:border-neon-turquoise'
              }`}
              onClick={() => setSelectedGlass(glass)}
            >
              <GlassIcon shape={glass.shape} />
              <div className="text-center">
                <p className="font-semibold">{glass.name}</p>
                <p className="text-sm text-cream">{glass.capacity}ml</p>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
