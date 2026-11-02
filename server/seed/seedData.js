import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

// ── Models ────────────────────────────────────────────────────────────────────
import User from '../models/User.js';
import Category from '../models/Category.js';
import Restaurant from '../models/Restaurant.js';
import Food from '../models/Food.js';
import Coupon from '../models/Coupon.js';

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/foodhub';

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('🔗 Connected to MongoDB');

  // Clear existing data
  await Promise.all([
    User.deleteMany({}),
    Category.deleteMany({}),
    Restaurant.deleteMany({}),
    Food.deleteMany({}),
    Coupon.deleteMany({}),
  ]);
  console.log('🗑  Cleared existing data');

  // ── Admin user ─────────────────────────────────────────────────────────────
  await User.create({
    name: 'Admin',
    email: process.env.ADMIN_EMAIL || 'admin@foodhub.com',
    password: process.env.ADMIN_PASSWORD || 'Admin@123456',
    role: 'admin',
    isEmailVerified: true,
  });
  console.log('👤 Admin user created');

  // ── Categories ─────────────────────────────────────────────────────────────
  const categoryData = [
    { name: 'Pizza', slug: 'pizza', description: 'Delicious wood-fired and pan pizzas', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400' },
    { name: 'Burgers', slug: 'burgers', description: 'Juicy hand-crafted burgers', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400' },
    { name: 'Sushi', slug: 'sushi', description: 'Fresh Japanese sushi and rolls', image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400' },
    { name: 'Indian', slug: 'indian', description: 'Authentic Indian curries and biryani', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400' },
    { name: 'Chinese', slug: 'chinese', description: 'Traditional Chinese noodles and dim sum', image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400' },
    { name: 'Desserts', slug: 'desserts', description: 'Sweet treats and ice creams', image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400' },
    { name: 'Salads', slug: 'salads', description: 'Fresh healthy salads', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400' },
    { name: 'Drinks', slug: 'drinks', description: 'Refreshing beverages and smoothies', image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400' },
  ];
  const categories = await Category.insertMany(categoryData);
  const catMap = Object.fromEntries(categories.map(c => [c.slug, c._id]));
  console.log('📂 Categories created');

  // ── Restaurants ────────────────────────────────────────────────────────────
  const restaurantData = [
    {
      name: 'Bella Napoli',
      description: 'Authentic Neapolitan pizza from Naples, Italy. Wood-fired ovens, imported ingredients.',
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600',
      cuisine: ['Italian', 'Pizza'],
      address: { street: '12 Margherita Lane', city: 'Mumbai', state: 'MH', zipCode: '400001' },
      rating: 4.7, reviewCount: 348, deliveryTime: '25-35 min', minOrder: 199, isFeatured: true,
    },
    {
      name: 'Burger Republic',
      description: 'Hand-smashed patties, brioche buns, and secret sauces. The ultimate burger experience.',
      image: 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=600',
      cuisine: ['American', 'Burgers'],
      address: { street: '45 Grill Street', city: 'Mumbai', state: 'MH', zipCode: '400002' },
      rating: 4.5, reviewCount: 512, deliveryTime: '20-30 min', minOrder: 149, isFeatured: true,
    },
    {
      name: 'Tokyo Garden',
      description: 'Premium Japanese cuisine — sushi, ramen, and omakase experiences brought to your door.',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600',
      cuisine: ['Japanese', 'Sushi'],
      address: { street: '8 Sakura Road', city: 'Mumbai', state: 'MH', zipCode: '400003' },
      rating: 4.8, reviewCount: 267, deliveryTime: '30-45 min', minOrder: 299, isFeatured: true,
    },
    {
      name: 'Spice Garden',
      description: 'Family recipes passed down for generations. The best biryani and curries in town.',
      image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600',
      cuisine: ['Indian', 'Mughlai'],
      address: { street: '22 Curry Lane', city: 'Mumbai', state: 'MH', zipCode: '400004' },
      rating: 4.6, reviewCount: 891, deliveryTime: '30-40 min', minOrder: 149, isFeatured: false,
    },
    {
      name: 'Dragon Palace',
      description: 'Authentic Cantonese and Szechuan cuisine. From dim sum brunch to late-night noodles.',
      image: 'https://images.unsplash.com/photo-1552566626-52f8b828329d?w=600',
      cuisine: ['Chinese', 'Asian'],
      address: { street: '3 Dragon Street', city: 'Mumbai', state: 'MH', zipCode: '400005' },
      rating: 4.3, reviewCount: 423, deliveryTime: '25-40 min', minOrder: 199, isFeatured: false,
    },
  ];
  const restaurants = await Restaurant.insertMany(restaurantData);
  const [bellaNapoli, burgerRep, tokyoGarden, spiceGarden, dragonPalace] = restaurants;
  console.log('🏪 Restaurants created');

  // ── Foods ──────────────────────────────────────────────────────────────────
  const foodData = [
    // Bella Napoli - Pizza
    { name: 'Margherita Classic', description: 'San Marzano tomatoes, fresh mozzarella, basil', price: 349, category: catMap['pizza'], restaurant: bellaNapoli._id, isPopular: true, isFeatured: true, rating: 4.8, reviewCount: 124, tags: ['veg', 'classic'], image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=500' },
    { name: 'Pepperoni Fire', description: 'Double pepperoni, mozzarella, tomato, chilli flakes', price: 449, category: catMap['pizza'], restaurant: bellaNapoli._id, isPopular: true, rating: 4.7, reviewCount: 98, tags: ['non-veg', 'spicy'], image: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=500' },
    { name: 'BBQ Chicken Pizza', description: 'Smoky BBQ sauce, grilled chicken, red onion, mozzarella', price: 499, category: catMap['pizza'], restaurant: bellaNapoli._id, rating: 4.6, reviewCount: 76, tags: ['non-veg'], image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500' },
    { name: 'Truffle Mushroom', description: 'White truffle oil, wild mushrooms, parmesan, arugula', price: 549, category: catMap['pizza'], restaurant: bellaNapoli._id, isFeatured: true, rating: 4.9, reviewCount: 45, tags: ['veg', 'premium'], image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500' },

    // Burger Republic
    { name: 'Classic Smash Burger', description: 'Double smash patty, American cheese, pickles, special sauce', price: 249, category: catMap['burgers'], restaurant: burgerRep._id, isPopular: true, isFeatured: true, rating: 4.7, reviewCount: 203, tags: ['non-veg', 'bestseller'], image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500' },
    { name: 'Crispy Chicken Burger', description: 'Fried chicken thigh, coleslaw, honey mustard, brioche bun', price: 279, category: catMap['burgers'], restaurant: burgerRep._id, isPopular: true, rating: 4.6, reviewCount: 167, tags: ['non-veg'], image: 'https://images.unsplash.com/photo-1615297928064-24977384d0da?w=500' },
    { name: 'Veggie Supreme', description: 'Black bean patty, avocado, tomato, lettuce, chipotle mayo', price: 229, category: catMap['burgers'], restaurant: burgerRep._id, rating: 4.3, reviewCount: 89, tags: ['veg'], image: 'https://images.unsplash.com/photo-1520072959219-c595dc870360?w=500' },
    { name: 'Bacon Double Cheese', description: 'Two beef patties, crispy bacon, double cheddar, caramelised onion', price: 349, category: catMap['burgers'], restaurant: burgerRep._id, isFeatured: true, rating: 4.8, reviewCount: 134, tags: ['non-veg', 'indulgent'], image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=500' },

    // Tokyo Garden - Sushi
    { name: 'Salmon Nigiri (8 pcs)', description: 'Fresh Atlantic salmon over hand-pressed shari rice', price: 449, category: catMap['sushi'], restaurant: tokyoGarden._id, isPopular: true, isFeatured: true, rating: 4.9, reviewCount: 87, tags: ['non-veg', 'premium'], image: 'https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=500' },
    { name: 'Dragon Roll (8 pcs)', description: 'Shrimp tempura inside, avocado and eel sauce on top', price: 549, category: catMap['sushi'], restaurant: tokyoGarden._id, isPopular: true, rating: 4.8, reviewCount: 63, tags: ['non-veg'], image: 'https://images.unsplash.com/photo-1559410545-0bdcd187e0a6?w=500' },
    { name: 'Vegetable Maki (6 pcs)', description: 'Cucumber, avocado, pickled daikon, sesame, nori', price: 299, category: catMap['sushi'], restaurant: tokyoGarden._id, rating: 4.5, reviewCount: 41, tags: ['veg'], image: 'https://images.unsplash.com/photo-1576132559776-f47a04aeea5b?w=500' },
    { name: 'Tuna Sashimi (6 pcs)', description: 'Premium bluefin tuna, wasabi, ginger, soy sauce', price: 649, category: catMap['sushi'], restaurant: tokyoGarden._id, isFeatured: true, rating: 4.9, reviewCount: 52, tags: ['non-veg', 'premium'], image: 'https://images.unsplash.com/photo-1534482421-64566f976cfa?w=500' },

    // Spice Garden - Indian
    { name: 'Chicken Biryani', description: 'Fragrant basmati rice layered with succulent chicken and whole spices', price: 299, category: catMap['indian'], restaurant: spiceGarden._id, isPopular: true, isFeatured: true, rating: 4.8, reviewCount: 312, tags: ['non-veg', 'bestseller'], image: 'https://images.unsplash.com/photo-1563379091339-03246963d96c?w=500' },
    { name: 'Paneer Butter Masala', description: 'Soft cottage cheese in rich tomato cream gravy', price: 249, category: catMap['indian'], restaurant: spiceGarden._id, isPopular: true, rating: 4.6, reviewCount: 198, tags: ['veg'], image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500' },
    { name: 'Dal Makhani', description: 'Slow-cooked black lentils in butter and cream sauce', price: 199, category: catMap['indian'], restaurant: spiceGarden._id, rating: 4.7, reviewCount: 156, tags: ['veg'], image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500' },
    { name: 'Butter Naan (4 pcs)', description: 'Soft leavened bread baked in tandoor with butter', price: 79, category: catMap['indian'], restaurant: spiceGarden._id, rating: 4.5, reviewCount: 245, tags: ['veg', 'bread'], image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500' },

    // Dragon Palace - Chinese
    { name: 'Hakka Noodles', description: 'Wok-tossed noodles with vegetables and soy sauce', price: 199, category: catMap['chinese'], restaurant: dragonPalace._id, isPopular: true, rating: 4.4, reviewCount: 178, tags: ['veg'], image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=500' },
    { name: 'Kung Pao Chicken', description: 'Stir-fried chicken with peanuts, chillies, and Szechuan pepper', price: 299, category: catMap['chinese'], restaurant: dragonPalace._id, isPopular: true, isFeatured: true, rating: 4.6, reviewCount: 134, tags: ['non-veg', 'spicy'], image: 'https://images.unsplash.com/photo-1626804475297-41608ea09aeb?w=500' },
    { name: 'Dim Sum Basket (6 pcs)', description: 'Steamed prawn har gow and pork siu mai', price: 349, category: catMap['chinese'], restaurant: dragonPalace._id, rating: 4.5, reviewCount: 89, tags: ['non-veg'], image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=500' },
    { name: 'Vegetable Fried Rice', description: 'Wok-fried jasmine rice with seasonal vegetables and egg', price: 179, category: catMap['chinese'], restaurant: dragonPalace._id, rating: 4.3, reviewCount: 112, tags: ['veg'], image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=500' },

    // Desserts - from multiple places
    { name: 'Tiramisu', description: 'Classic Italian coffee dessert with mascarpone and ladyfingers', price: 199, category: catMap['desserts'], restaurant: bellaNapoli._id, rating: 4.8, reviewCount: 67, tags: ['veg', 'sweet'], image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=500' },
    { name: 'Mango Sorbet', description: 'Refreshing Alphonso mango sorbet, dairy-free', price: 149, category: catMap['desserts'], restaurant: spiceGarden._id, rating: 4.6, reviewCount: 88, tags: ['veg', 'vegan'], image: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=500' },
    { name: 'Chocolate Lava Cake', description: 'Warm dark chocolate cake with molten center, vanilla gelato', price: 229, category: catMap['desserts'], restaurant: burgerRep._id, isFeatured: true, rating: 4.9, reviewCount: 143, tags: ['veg', 'indulgent'], image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=500' },

    // Drinks
    { name: 'Mango Lassi', description: 'Creamy yogurt blended with Alphonso mangoes and cardamom', price: 99, category: catMap['drinks'], restaurant: spiceGarden._id, isPopular: true, rating: 4.7, reviewCount: 201, tags: ['veg'], image: 'https://images.unsplash.com/photo-1571006682760-0f1e7f4c2cb0?w=500' },
    { name: 'Matcha Latte', description: 'Ceremonial grade matcha with oat milk, lightly sweetened', price: 149, category: catMap['drinks'], restaurant: tokyoGarden._id, rating: 4.6, reviewCount: 78, tags: ['veg'], image: 'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=500' },
    { name: 'Craft Lemonade', description: 'Fresh squeezed lemonade with mint and a hint of chilli', price: 89, category: catMap['drinks'], restaurant: burgerRep._id, rating: 4.4, reviewCount: 93, tags: ['veg'], image: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=500' },
  ];
  await Food.insertMany(foodData);
  console.log(`🍕 ${foodData.length} food items created`);

  // ── Coupons ────────────────────────────────────────────────────────────────
  await Coupon.insertMany([
    {
      code: 'WELCOME50',
      description: 'Get 50% off your first order',
      discountType: 'percentage',
      discountValue: 50,
      minOrderAmount: 199,
      maxDiscount: 150,
      usageLimit: 1000,
      expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      isActive: true,
    },
    {
      code: 'FLAT100',
      description: 'Flat ₹100 off on orders above ₹499',
      discountType: 'fixed',
      discountValue: 100,
      minOrderAmount: 499,
      usageLimit: 500,
      expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      isActive: true,
    },
  ]);
  console.log('🎟  Coupons created');

  console.log('\n✅ Seed completed successfully!');
  console.log('   Admin email:', process.env.ADMIN_EMAIL || 'admin@foodhub.com');
  console.log('   Admin password:', process.env.ADMIN_PASSWORD || 'Admin@123456');
  await mongoose.disconnect();
}

seed().catch(err => {
  console.error('❌ Seed failed:', err.message);
  process.exit(1);
});
