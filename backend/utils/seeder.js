const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const User = require('../models/User');
const PetCategory = require('../models/PetCategory');
const Pet = require('../models/Pet');
const Product = require('../models/Product');
const Service = require('../models/Service');

const connectDB = require('../config/db');
connectDB();

const seed = async () => {
  try {
    await Promise.all([User.deleteMany(), PetCategory.deleteMany(), Pet.deleteMany(), Product.deleteMany(), Service.deleteMany()]);

    const admin = await User.create({ name: 'Admin User', email: 'admin@petstore.com', password: 'admin123', role: 'admin', phone: '555-0001' });
    const staff = await User.create({ name: 'Staff Member', email: 'staff@petstore.com', password: 'staff123', role: 'staff', phone: '555-0002' });
    const customer = await User.create({ name: 'John Doe', email: 'customer@petstore.com', password: 'customer123', role: 'customer', phone: '555-0003' });

    const categories = await PetCategory.insertMany([
      { name: 'Dogs', description: 'Loyal companions', image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400' },
      { name: 'Cats', description: 'Independent and elegant', image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400' },
      { name: 'Birds', description: 'Colorful and melodious', image: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=400' },
      { name: 'Fish', description: 'Aquatic wonders', image: 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?w=400' },
      { name: 'Rabbits', description: 'Fluffy and playful', image: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=400' }
    ]);

    const [dogs, cats, birds, fish, rabbits] = categories;

    await Pet.insertMany([
      { name: 'Max', category: dogs._id, breed: 'Golden Retriever', age: '2 years', gender: 'male', color: 'Golden', weight: '30 kg', price: 25000, description: 'Friendly and playful Golden Retriever, fully vaccinated and trained.', images: ['https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600'], status: 'available', isVaccinated: true, isMicrochipped: true, healthCertificate: true, addedBy: staff._id },
      { name: 'Bella', category: cats._id, breed: 'Persian', age: '1 year', gender: 'female', color: 'White', weight: '4 kg', price: 15000, description: 'Beautiful Persian cat with silky fur.', images: ['https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600'], status: 'available', isVaccinated: true, addedBy: staff._id },
      { name: 'Charlie', category: dogs._id, breed: 'Labrador', age: '3 months', gender: 'male', color: 'Black', weight: '8 kg', price: 18000, description: 'Adorable Labrador puppy, playful and energetic.', images: ['https://images.unsplash.com/photo-1586671267731-da2cf3ceeb80?w=600'], status: 'available', isVaccinated: true, addedBy: staff._id },
      { name: 'Luna', category: cats._id, breed: 'Siamese', age: '6 months', gender: 'female', color: 'Cream', weight: '3 kg', price: 12000, description: 'Elegant Siamese kitten.', images: ['https://images.unsplash.com/photo-1529778873920-4da4926a72c2?w=600'], status: 'available', addedBy: staff._id },
      { name: 'Tweety', category: birds._id, breed: 'Canary', age: '1 year', gender: 'male', color: 'Yellow', weight: '20g', price: 1500, description: 'Beautiful singing canary.', images: ['https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=600'], status: 'available', addedBy: staff._id },
      { name: 'Nemo', category: fish._id, breed: 'Clownfish', age: '6 months', gender: 'male', color: 'Orange/White', weight: '50g', price: 500, description: 'Vibrant clownfish for your aquarium.', images: ['https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?w=600'], status: 'available', addedBy: staff._id },
      { name: 'Fluffy', category: rabbits._id, breed: 'Holland Lop', age: '4 months', gender: 'female', color: 'Gray', weight: '1.5 kg', price: 2000, description: 'Adorable Holland Lop rabbit.', images: ['https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=600'], status: 'available', addedBy: staff._id },
      { name: 'Rocky', category: dogs._id, breed: 'German Shepherd', age: '1 year', gender: 'male', color: 'Brown/Black', weight: '25 kg', price: 30000, description: 'Intelligent German Shepherd, great guard dog.', images: ['https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=600'], status: 'adoption', isAdoption: true, addedBy: staff._id }
    ]);

    await Product.insertMany([
      { name: 'Premium Dog Food', category: 'food', petType: ['dogs'], brand: 'PetNutrition', price: 3999, stock: 100, description: 'High protein dry dog food, 10kg bag.', images: ['https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=600'], addedBy: staff._id },
      { name: 'Cat Litter Box', category: 'accessories', petType: ['cats'], brand: 'CleanPet', price: 1499, stock: 50, description: 'Self-cleaning litter box for cats.', images: ['https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=600'], addedBy: staff._id },
      { name: 'Dog Chew Toys Set', category: 'toys', petType: ['dogs'], brand: 'PlayPet', price: 599, stock: 75, description: 'Set of 5 durable chew toys.', images: ['https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=600'], addedBy: staff._id },
      { name: 'Bird Cage Deluxe', category: 'accessories', petType: ['birds'], brand: 'BirdHome', price: 2499, stock: 20, description: 'Spacious cage with perches and feeders.', images: ['https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=600'], addedBy: staff._id },
      { name: 'Fish Tank 30L', category: 'accessories', petType: ['fish'], brand: 'AquaWorld', price: 4999, stock: 15, description: 'Complete aquarium starter kit.', images: ['https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?w=600'], addedBy: staff._id },
      { name: 'Pet Shampoo', category: 'grooming', petType: ['dogs', 'cats'], brand: 'FreshPet', price: 399, stock: 120, description: 'Natural ingredients, gentle formula.', images: ['https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=600'], addedBy: staff._id }
    ]);

    await Service.insertMany([
      { name: 'Basic Grooming', type: 'grooming', description: 'Bath, dry, brush, and nail trim.', price: 999, duration: 60, petTypes: ['dogs', 'cats'], features: ['Bath & Dry', 'Brush Out', 'Nail Trim', 'Ear Cleaning'] },
      { name: 'Full Grooming Package', type: 'grooming', description: 'Complete grooming with haircut and styling.', price: 1999, duration: 120, petTypes: ['dogs', 'cats'], features: ['Full Bath', 'Haircut & Styling', 'Teeth Brushing', 'Cologne'] },
      { name: 'General Checkup', type: 'veterinary', description: 'Comprehensive health examination.', price: 799, duration: 30, petTypes: ['dogs', 'cats', 'birds', 'rabbits'], features: ['Physical Exam', 'Weight Check', 'Health Report', 'Parasite Check'] },
      { name: 'Vaccination', type: 'veterinary', description: 'Core and non-core vaccines available.', price: 599, duration: 20, petTypes: ['dogs', 'cats'], features: ['Core Vaccines', 'Health Certificate', 'Medical Records'] },
      { name: 'Pet Training', type: 'training', description: 'Basic obedience training sessions.', price: 4999, duration: 60, petTypes: ['dogs'], features: ['Obedience Training', 'Behavior Correction', 'Socialization'] },
      { name: 'Pet Boarding', type: 'boarding', description: 'Safe and comfortable overnight stay.', price: 999, duration: 1440, petTypes: ['dogs', 'cats'], features: ['Cozy Accommodation', '3 Meals/Day', 'Playtime', 'Daily Updates'] }
    ]);

    console.log('✅ Seed data inserted successfully');
    console.log('Admin: admin@petstore.com / admin123');
    console.log('Staff: staff@petstore.com / staff123');
    console.log('Customer: customer@petstore.com / customer123');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seed();
