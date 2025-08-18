import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ShoppingBasket, Search, ShoppingCart, User, Settings, History, LogOut } from "lucide-react";
import type { CartItemWithProduct } from "@shared/schema";

interface CustomerHeaderProps {
  onCartToggle: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearch: (e: React.FormEvent) => void;
}

export default function CustomerHeader({ 
  onCartToggle, 
  searchQuery, 
  onSearchChange, 
  onSearch 
}: CustomerHeaderProps) {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const { data: cartItems = [] } = useQuery<CartItemWithProduct[]>({
    queryKey: ["/api/cart"],
  });

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  const handleAdminPanel = () => {
    window.location.href = "/admin";
  };

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <ShoppingBasket className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold text-gray-900">Modern Pride</span>
            </div>
            
            {/* Desktop Search */}
            <form onSubmit={onSearch} className="hidden md:block relative ml-8">
              <Input
                type="text"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-96 pl-10 pr-4 py-2"
                data-testid="input-search-desktop"
              />
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            </form>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Cart Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onCartToggle}
              className="relative p-2 hover:text-primary"
              data-testid="button-cart"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                  data-testid="text-cart-count"
                >
                  {cartItemCount}
                </Badge>
              )}
            </Button>
            
            {/* Admin Panel Button */}
{/*             <Button
              variant="ghost"
              size="sm"
              disabled={true} // Disable for now, can be enabled later
              onClick={handleAdminPanel}
              hidden={true} // Hide for now, can be enabled later
              className="hidden sm:flex items-center space-x-2 hover:text-primary"
              data-testid="button-admin-panel"
            >
              <Settings className="h-4 w-4" />
              <span>Admin</span>
            </Button> */}
          </div>
        </div>
        
        {/* Mobile Search */}
        <form onSubmit={onSearch} className="md:hidden pb-3">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search for products..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2"
              data-testid="input-search-mobile"
            />
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          </div>
        </form>
      </div>
    </header>
  );
}
