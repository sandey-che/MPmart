import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import type { ProductWithCategory } from "@shared/schema";

interface ProductCardProps {
  product: ProductWithCategory;
  onView: () => void;
  compact?: boolean;
}

export default function ProductCard({ product, onView, compact = false }: ProductCardProps) {
  const { user } = useAuth();
  const { toast } = useToast();

  const addToCartMutation = useMutation({
    mutationFn: async () => {
      if (!user) {
        throw new Error("Please log in to add items to cart");
      }
      
      await apiRequest("POST", "/api/cart", {
        productId: product.id,
        quantity: 1,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add item to cart",
        variant: "destructive",
      });
    },
  });

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCartMutation.mutate();
  };

  return (
    <Card 
      className="bg-white hover:shadow-md transition-shadow cursor-pointer group"
      onClick={onView}
      data-testid={`card-product-${product.id}`}
    >
      <CardContent className="p-0">
        <img
          src={product.imageUrl || "https://images.unsplash.com/photo-1603833665858-e61d17a86224?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"}
          alt={product.name}
          className={`w-full object-cover rounded-t-lg ${compact ? 'h-32' : 'h-40'}`}
        />
        <div className={compact ? "p-3" : "p-4"}>
          <h3 className={`font-semibold text-gray-900 mb-1 group-hover:text-primary transition-colors ${compact ? 'text-sm' : ''}`}>
            {product.name}
          </h3>
          <p className={`text-gray-600 mb-2 ${compact ? 'text-xs' : 'text-sm'}`}>
            {product.unit}
          </p>
          {!compact && product.category && (
            <p className="text-xs text-gray-500 mb-2">{product.category.name}</p>
          )}
          <div className="flex items-center justify-between">
            <span className={`font-bold text-primary ${compact ? 'text-sm' : 'text-lg'}`}>
              ${parseFloat(product.price).toFixed(2)}
            </span>
            <Button
              size={compact ? "sm" : "default"}
              onClick={handleAddToCart}
              disabled={addToCartMutation.isPending || product.stock === 0}
              className="bg-primary text-white hover:bg-green-600 transition-colors"
              data-testid={`button-add-cart-${product.id}`}
            >
              {addToCartMutation.isPending ? (
                "Adding..."
              ) : product.stock === 0 ? (
                "Out of Stock"
              ) : (
                <Plus className={compact ? "h-3 w-3" : "h-4 w-4"} />
              )}
            </Button>
          </div>
          {product.stock > 0 && product.stock <= 10 && (
            <p className="text-xs text-orange-600 mt-1">Only {product.stock} left!</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
