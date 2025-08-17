import {
  users,
  categories,
  products,
  orders,
  orderItems,
  cartItems,
  type User,
  type UpsertUser,
  type Category,
  type InsertCategory,
  type Product,
  type InsertProduct,
  type ProductWithCategory,
  type Order,
  type InsertOrder,
  type OrderItem,
  type InsertOrderItem,
  type CartItem,
  type InsertCartItem,
  type CartItemWithProduct,
  type OrderWithItems,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Category operations
  getCategories(): Promise<Category[]>;
  createCategory(category: InsertCategory): Promise<Category>;
  
  // Product operations
  getProducts(): Promise<ProductWithCategory[]>;
  getProductById(id: string): Promise<ProductWithCategory | undefined>;
  getProductsByCategory(categoryId: string): Promise<ProductWithCategory[]>;
  searchProducts(query: string): Promise<ProductWithCategory[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: string): Promise<boolean>;
  
  // Order operations
  getOrders(): Promise<OrderWithItems[]>;
  getOrdersByUser(userId: string): Promise<OrderWithItems[]>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrderStatus(id: string, status: string): Promise<Order | undefined>;
  
  // Order items operations
  createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem>;
  
  // Cart operations
  getCartItems(userId: string): Promise<CartItemWithProduct[]>;
  addToCart(cartItem: InsertCartItem): Promise<CartItem>;
  updateCartItem(id: string, quantity: number): Promise<CartItem | undefined>;
  removeFromCart(id: string): Promise<boolean>;
  clearCart(userId: string): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Category operations
  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories);
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const [newCategory] = await db.insert(categories).values(category).returning();
    return newCategory;
  }

  // Product operations
  async getProducts(): Promise<ProductWithCategory[]> {
    return await db
      .select()
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(eq(products.isActive, true))
      .then(rows => 
        rows.map(row => ({
          ...row.products,
          category: row.categories,
        }))
      );
  }

  async getProductById(id: string): Promise<ProductWithCategory | undefined> {
    const [result] = await db
      .select()
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(and(eq(products.id, id), eq(products.isActive, true)));
    
    if (!result) return undefined;
    
    return {
      ...result.products,
      category: result.categories,
    };
  }

  async getProductsByCategory(categoryId: string): Promise<ProductWithCategory[]> {
    return await db
      .select()
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(and(eq(products.categoryId, categoryId), eq(products.isActive, true)))
      .then(rows => 
        rows.map(row => ({
          ...row.products,
          category: row.categories,
        }))
      );
  }

  async searchProducts(query: string): Promise<ProductWithCategory[]> {
    return await db
      .select()
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(and(
        eq(products.isActive, true),
        // Simple search implementation - in production would use full-text search
      ))
      .then(rows => 
        rows.filter(row => 
          row.products.name.toLowerCase().includes(query.toLowerCase()) ||
          (row.products.description && row.products.description.toLowerCase().includes(query.toLowerCase()))
        ).map(row => ({
          ...row.products,
          category: row.categories,
        }))
      );
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const [newProduct] = await db.insert(products).values(product).returning();
    return newProduct;
  }

  async updateProduct(id: string, productData: Partial<InsertProduct>): Promise<Product | undefined> {
    const [updatedProduct] = await db
      .update(products)
      .set({ ...productData, updatedAt: new Date() })
      .where(eq(products.id, id))
      .returning();
    return updatedProduct;
  }

  async deleteProduct(id: string): Promise<boolean> {
    const result = await db
      .update(products)
      .set({ isActive: false, updatedAt: new Date() })
      .where(eq(products.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Order operations
  async getOrders(): Promise<OrderWithItems[]> {
    const ordersWithUsers = await db
      .select()
      .from(orders)
      .leftJoin(users, eq(orders.userId, users.id))
      .orderBy(desc(orders.createdAt));

    const ordersWithItems = await Promise.all(
      ordersWithUsers.map(async (orderWithUser) => {
        const items = await db
          .select()
          .from(orderItems)
          .leftJoin(products, eq(orderItems.productId, products.id))
          .where(eq(orderItems.orderId, orderWithUser.orders.id));

        return {
          ...orderWithUser.orders,
          user: orderWithUser.users!,
          orderItems: items.map(item => ({
            ...item.order_items,
            product: item.products!,
          })),
        };
      })
    );

    return ordersWithItems;
  }

  async getOrdersByUser(userId: string): Promise<OrderWithItems[]> {
    const userOrders = await db
      .select()
      .from(orders)
      .leftJoin(users, eq(orders.userId, users.id))
      .where(eq(orders.userId, userId))
      .orderBy(desc(orders.createdAt));

    const ordersWithItems = await Promise.all(
      userOrders.map(async (orderWithUser) => {
        const items = await db
          .select()
          .from(orderItems)
          .leftJoin(products, eq(orderItems.productId, products.id))
          .where(eq(orderItems.orderId, orderWithUser.orders.id));

        return {
          ...orderWithUser.orders,
          user: orderWithUser.users!,
          orderItems: items.map(item => ({
            ...item.order_items,
            product: item.products!,
          })),
        };
      })
    );

    return ordersWithItems;
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const [newOrder] = await db.insert(orders).values(order).returning();
    return newOrder;
  }

  async updateOrderStatus(id: string, status: string): Promise<Order | undefined> {
    const [updatedOrder] = await db
      .update(orders)
      .set({ status, updatedAt: new Date() })
      .where(eq(orders.id, id))
      .returning();
    return updatedOrder;
  }

  // Order items operations
  async createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem> {
    const [newOrderItem] = await db.insert(orderItems).values(orderItem).returning();
    return newOrderItem;
  }

  // Cart operations
  async getCartItems(userId: string): Promise<CartItemWithProduct[]> {
    const items = await db
      .select()
      .from(cartItems)
      .leftJoin(products, eq(cartItems.productId, products.id))
      .where(eq(cartItems.userId, userId));

    return items.map(item => ({
      ...item.cart_items,
      product: item.products!,
    }));
  }

  async addToCart(cartItem: InsertCartItem): Promise<CartItem> {
    // Check if item already exists in cart
    const [existingItem] = await db
      .select()
      .from(cartItems)
      .where(
        and(
          eq(cartItems.userId, cartItem.userId),
          eq(cartItems.productId, cartItem.productId)
        )
      );

    if (existingItem) {
      // Update quantity
      const [updatedItem] = await db
        .update(cartItems)
        .set({ quantity: existingItem.quantity + cartItem.quantity })
        .where(eq(cartItems.id, existingItem.id))
        .returning();
      return updatedItem;
    } else {
      // Add new item
      const [newItem] = await db.insert(cartItems).values(cartItem).returning();
      return newItem;
    }
  }

  async updateCartItem(id: string, quantity: number): Promise<CartItem | undefined> {
    const [updatedItem] = await db
      .update(cartItems)
      .set({ quantity })
      .where(eq(cartItems.id, id))
      .returning();
    return updatedItem;
  }

  async removeFromCart(id: string): Promise<boolean> {
    const result = await db.delete(cartItems).where(eq(cartItems.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async clearCart(userId: string): Promise<boolean> {
    const result = await db.delete(cartItems).where(eq(cartItems.userId, userId));
    return (result.rowCount ?? 0) > 0;
  }
}

export const storage = new DatabaseStorage();
