import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingBasket, Truck, Clock, Shield } from "lucide-react";

export default function Landing() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-green-600">
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-white">
            <ShoppingBasket className="h-8 w-8" />
            <span className="text-2xl font-bold">Modern Pride Super Mart</span>
          </div>
          <Button 
            onClick={handleLogin}
            variant="secondary"
            size="lg"
            data-testid="button-login"
          >
            Sign In
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="text-center text-white mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Fresh Groceries Delivered to Your Door
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-green-100 max-w-3xl mx-auto">
            Shop from our wide selection of fresh produce, pantry staples, and household essentials. 
            Experience the convenience of online grocery shopping with Modern Pride.
          </p>
          <Button 
            onClick={handleLogin}
            size="lg"
            className="bg-white text-primary hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
            data-testid="button-start-shopping"
          >
            Start Shopping Now
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-6 text-center">
              <Truck className="h-12 w-12 text-white mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Fast Delivery</h3>
              <p className="text-green-100">Same-day delivery available in your area</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-6 text-center">
              <Shield className="h-12 w-12 text-white mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Quality Assured</h3>
              <p className="text-green-100">Fresh products with quality guarantee</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-6 text-center">
              <Clock className="h-12 w-12 text-white mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">24/7 Shopping</h3>
              <p className="text-green-100">Shop anytime, anywhere with our platform</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-6 text-center">
              <ShoppingBasket className="h-12 w-12 text-white mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Wide Selection</h3>
              <p className="text-green-100">Thousands of products at great prices</p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-8">Why Choose Modern Pride?</h2>
          <div className="grid md:grid-cols-3 gap-8 text-white">
            <div>
              <h3 className="text-xl font-semibold mb-4">Premium Quality</h3>
              <p className="text-green-100">We source the freshest produce and highest quality products from trusted suppliers.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Competitive Prices</h3>
              <p className="text-green-100">Enjoy great prices on all your favorite products with regular deals and discounts.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Excellent Service</h3>
              <p className="text-green-100">Our customer support team is here to help you with any questions or concerns.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
