import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import CustomerHeader from "@/components/CustomerHeader";
import ProductCard from "@/components/ProductCard";
import ShoppingCart from "@/components/ShoppingCart";
import ChatBot from "@/components/ChatBot";
import ProductModal from "@/components/ProductModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import type { ProductWithCategory, Category } from "@shared/schema";

export default function Home() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductWithCategory | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const { data: products = [], isLoading } = useQuery<ProductWithCategory[]>({
    queryKey: ["/api/products", { search: searchQuery, category: selectedCategory }],
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is automatically triggered by the query key dependency
  };

  const featuredProducts = products.slice(0, 6);
  const categoryProducts = selectedCategory 
    ? products 
    : products.slice(6, 12);

  return (
    <div className="min-h-screen bg-gray-50">
      <CustomerHeader 
        onCartToggle={() => setIsCartOpen(!isCartOpen)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearch={handleSearch}
      />

      <main className="pb-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary to-green-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  Fresh Groceries Delivered to Your Door
                </h1>
                <p className="text-xl mb-6 text-green-100">
                  Shop from our wide selection of fresh produce, pantry staples, and household essentials.
                </p>
                <Button 
                  className="bg-white text-primary hover:bg-gray-100 px-8 py-3 text-lg font-semibold"
                  onClick={() => document.getElementById('featured-products')?.scrollIntoView({ behavior: 'smooth' })}
                  data-testid="button-start-shopping"
                >
                  Start Shopping
                </Button>
              </div>
              <div className="hidden md:block">
                <img
                  src="https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
                  alt="Fresh grocery products"
                  className="rounded-xl shadow-2xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Category Navigation */}
        <section className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex overflow-x-auto py-4 space-x-6">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`flex-shrink-0 text-center cursor-pointer group ${
                  selectedCategory === null ? 'text-primary' : 'text-gray-700'
                }`}
                data-testid="category-all"
              >
                <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors ${
                  selectedCategory === null 
                    ? 'bg-primary text-white' 
                    : 'bg-gray-100 group-hover:bg-primary group-hover:text-white'
                }`}>
                  <i className="fas fa-th-large text-2xl"></i>
                </div>
                <span className="block mt-2 text-sm font-medium">All</span>
              </button>
              
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex-shrink-0 text-center cursor-pointer group ${
                    selectedCategory === category.id ? 'text-primary' : 'text-gray-700'
                  }`}
                  data-testid={`category-${category.name.toLowerCase()}`}
                >
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors ${
                    selectedCategory === category.id 
                      ? 'bg-primary text-white' 
                      : 'bg-gray-100 group-hover:bg-primary group-hover:text-white'
                  }`}>
                    <i className={`${category.icon || 'fas fa-box'} text-2xl`}></i>
                  </div>
                  <span className="block mt-2 text-sm font-medium">{category.name}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Search Results / Featured Products */}
        <section className="py-12" id="featured-products">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-900">
                {searchQuery ? `Search Results for "${searchQuery}"` : 
                 selectedCategory ? `${categories.find(c => c.id === selectedCategory)?.name} Products` : 
                 'Featured Products'}
              </h2>
              {!searchQuery && !selectedCategory && (
                <Button 
                  variant="ghost" 
                  className="text-primary hover:text-green-600"
                  data-testid="button-view-all"
                >
                  View All
                </Button>
              )}
            </div>

            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg shadow-sm border animate-pulse">
                    <div className="w-full h-40 bg-gray-200 rounded-t-lg"></div>
                    <div className="p-4 space-y-2">
                      <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                      <div className="h-5 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <Search className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-xl text-gray-600 mb-2">No products found</p>
                <p className="text-gray-500">Try adjusting your search or browse our categories</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {(searchQuery || selectedCategory ? products : featuredProducts).map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onView={() => setSelectedProduct(product)}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Promotional Banner */}
        {!searchQuery && !selectedCategory && (
          <section className="bg-gradient-to-r from-orange-400 to-red-500 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <div className="text-center">
                <h2 className="text-3xl font-bold mb-4">Limited Time Offer!</h2>
                <p className="text-xl mb-6">Get 20% off on all organic products this week</p>
                <Button 
                  className="bg-white text-orange-500 hover:bg-gray-100 px-8 py-3 font-semibold"
                  onClick={() => setSelectedCategory(categories.find(c => c.name.toLowerCase().includes('organic'))?.id || null)}
                  data-testid="button-shop-organic"
                >
                  Shop Organic
                </Button>
              </div>
            </div>
          </section>
        )}

        {/* Recently Viewed - if not searching */}
        {!searchQuery && !selectedCategory && categoryProducts.length > 0 && (
          <section className="py-12 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">More Products</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {categoryProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onView={() => setSelectedProduct(product)}
                    compact
                  />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Shopping Cart */}
      <ShoppingCart 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
      />

      {/* Product Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      {/* Chatbot */}
      <ChatBot />
    </div>
  );
}
