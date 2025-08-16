import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X, Minus, Plus, ShoppingCart } from "lucide-react";
import type { ProductWithCategory } from "@shared/schema";

interface ProductModalProps {
  product: ProductWithCategory;
  onClose: () => void;
}

export default function ProductModal({ product, onClose }: ProductModalProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);

  const addToCartMutation = useMutation({
    mutationFn: async () => {
      if (!user) {
        throw new Error("Please log in to add items to cart");
      }
      
      await apiRequest("POST", "/api/cart", {
        productId: product.id,
        quantity,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      onClose();
      toast({
        title: "Added to cart",
        description: `${quantity} x ${product.name} has been added to your cart`,
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

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= (product.stock || 1)) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    addToCartMutation.mutate();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0" data-testid="modal-product">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900" data-testid="text-product-name">
                {product.name}
              </h2>
              {product.category && (
                <Badge variant="secondary" className="mt-1">
                  {product.category.name}
                </Badge>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
              data-testid="button-close-modal"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Product Image */}
            <div>
              <img
                src={product.imageUrl || "https://images.unsplash.com/photo-1603833665858-e61d17a86224?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400"}
                alt={product.name}
                className="w-full h-64 object-cover rounded-lg"
                data-testid="img-product"
              />
            </div>
            
            {/* Product Details */}
            <div className="space-y-4">
              <div>
                <div className="flex items-baseline space-x-2 mb-2">
                  <span className="text-3xl font-bold text-primary" data-testid="text-product-price">
                    ${parseFloat(product.price).toFixed(2)}
                  </span>
                  <span className="text-gray-600">per {product.unit}</span>
                </div>
                
                {product.stock !== null && (
                  <div className="flex items-center space-x-2">
                    <Badge variant={product.stock > 10 ? "default" : product.stock > 0 ? "secondary" : "destructive"}>
                      {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                    </Badge>
                    {product.stock > 0 && product.stock <= 10 && (
                      <span className="text-orange-600 text-sm">Only {product.stock} left!</span>
                    )}
                  </div>
                )}
              </div>
              
              {product.description && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-700" data-testid="text-product-description">
                    {product.description}
                  </p>
                </div>
              )}
              
              {/* Quantity Selector */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity
                  </label>
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuantityChange(quantity - 1)}
                      disabled={quantity <= 1}
                      className="h-10 w-10 p-0"
                      data-testid="button-decrease-quantity"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="text-lg font-medium w-12 text-center" data-testid="text-quantity">
                      {quantity}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuantityChange(quantity + 1)}
                      disabled={quantity >= (product.stock || 1)}
                      className="h-10 w-10 p-0"
                      data-testid="button-increase-quantity"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {/* Total Price */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Total:</span>
                    <span className="text-2xl font-bold text-primary" data-testid="text-total-price">
                      ${(parseFloat(product.price) * quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
                
                {/* Add to Cart Button */}
                <Button
                  onClick={handleAddToCart}
                  disabled={addToCartMutation.isPending || product.stock === 0 || !user}
                  className="w-full bg-primary text-white hover:bg-green-600 py-3 text-lg font-semibold"
                  data-testid="button-add-to-cart"
                >
                  {addToCartMutation.isPending ? (
                    "Adding to Cart..."
                  ) : product.stock === 0 ? (
                    "Out of Stock"
                  ) : !user ? (
                    "Please Log In"
                  ) : (
                    <>
                      <ShoppingCart className="h-5 w-5 mr-2" />
                      Add to Cart
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
