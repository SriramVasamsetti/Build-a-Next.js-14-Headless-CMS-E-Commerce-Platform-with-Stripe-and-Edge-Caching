const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // Seed User
  const passwordHash = await bcrypt.hash('Password123!', 10);
  const testUser = await prisma.user.upsert({
    where: { email: 'test.user@example.com' },
    update: {},
    create: {
      email: 'test.user@example.com',
      passwordHash: passwordHash,
    },
  });
  console.log(`Created test user with ID: ${testUser.id}`);

  // Seed Products
  const productsData = [
    {
      name: 'Premium Noise-Cancelling Headphones',
      slug: 'premium-noise-cancelling-headphones',
      description: 'Immerse yourself in pure sound with advanced noise cancellation and superior comfort.',
      price: 299.99,
      stock: 50,
      image: 'https://images.pexels.com/photos/164781/pexels-photo-164781.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    },
    {
      name: 'Ultra-Thin Gaming Laptop',
      slug: 'ultra-thin-gaming-laptop',
      description: 'Experience unparalleled gaming performance in a sleek, portable design.',
      price: 1899.99,
      stock: 20,
      image: 'https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    },
    {
      name: 'Flagship Smartphone Pro',
      slug: 'flagship-smartphone-pro',
      description: 'Capture stunning photos and enjoy lightning-fast performance with our latest smartphone.',
      price: 999.00,
      stock: 100,
      image: 'https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    },
    {
      name: 'Ergonomic Mechanical Keyboard',
      slug: 'ergonomic-mechanical-keyboard',
      description: 'Designed for comfort and precision, perfect for long coding sessions or intense gaming.',
      price: 129.99,
      stock: 75,
      image: 'https://images.pexels.com/photos/1772123/pexels-photo-1772123.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    },
    {
      name: '4K Ultra HD Monitor',
      slug: '4k-ultra-hd-monitor',
      description: 'Vibrant colors and crisp details bring your work and entertainment to life.',
      price: 449.50,
      stock: 30,
      image: 'https://images.pexels.com/photos/1029757/pexels-photo-1029757.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    },
    {
      name: 'Smartwatch with Health Tracking',
      slug: 'smartwatch-health-tracking',
      description: 'Monitor your fitness, heart rate, and notifications on the go.',
      price: 199.00,
      stock: 120,
      image: 'https://images.pexels.com/photos/437038/pexels-photo-437038.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    },
    {
      name: 'Portable Bluetooth Speaker',
      slug: 'portable-bluetooth-speaker',
      description: 'Powerful sound in a compact, waterproof design. Perfect for any adventure.',
      price: 79.99,
      stock: 150,
      image: 'https://images.pexels.com/photos/3770380/pexels-photo-3770380.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    },
    {
      name: 'Wireless Charging Pad',
      slug: 'wireless-charging-pad',
      description: 'Charge your devices effortlessly with this sleek and fast wireless charger.',
      price: 39.99,
      stock: 200,
      image: 'https://images.pexels.com/photos/3999536/pexels-photo-3999536.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    },
    {
      name: 'High-Performance Gaming Mouse',
      slug: 'high-performance-gaming-mouse',
      description: 'Precision tracking and customizable buttons for competitive gaming.',
      price: 69.99,
      stock: 80,
      image: 'https://images.pexels.com/photos/1772124/pexels-photo-1772124.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    },
    {
      name: 'External SSD 1TB',
      slug: 'external-ssd-1tb',
      description: 'Blazing fast storage for all your files, games, and media.',
      price: 149.99,
      stock: 60,
      image: 'https://images.pexels.com/photos/3862632/pexels-photo-3862632.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    },
    {
      name: 'Professional DSLR Camera',
      slug: 'professional-dslr-camera',
      description: 'Capture breathtaking moments with stunning clarity and detail.',
      price: 1200.00,
      stock: 15,
      image: 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    },
    {
      name: 'Smart Home Hub',
      slug: 'smart-home-hub',
      description: 'Control all your smart devices from one central hub.',
      price: 179.00,
      stock: 40,
      image: 'https://images.pexels.com/photos/3935702/pexels-photo-3935702.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    },
    {
      name: 'Robot Vacuum Cleaner',
      slug: 'robot-vacuum-cleaner',
      description: 'Automate your cleaning with intelligent navigation and powerful suction.',
      price: 349.99,
      stock: 25,
      image: 'https://images.pexels.com/photos/3616794/pexels-photo-3616794.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    },
    {
      name: 'Electric Toothbrush',
      slug: 'electric-toothbrush',
      description: 'Achieve a superior clean with advanced sonic technology.',
      price: 89.99,
      stock: 90,
      image: 'https://images.pexels.com/photos/4210610/pexels-photo-4210610.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    },
    {
      name: 'Portable Projector',
      slug: 'portable-projector',
      description: 'Enjoy movies and presentations anywhere with this compact projector.',
      price: 249.00,
      stock: 35,
      image: 'https://images.pexels.com/photos/3935703/pexels-photo-3935703.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    },
    {
      name: 'Noise-Isolating Earbuds',
      slug: 'noise-isolating-earbuds',
      description: 'Crystal-clear audio and deep bass in a comfortable, secure fit.',
      price: 119.00,
      stock: 110,
      image: 'https://images.pexels.com/photos/3783471/pexels-photo-3783471.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    },
    {
      name: 'Gaming Headset with Mic',
      slug: 'gaming-headset-with-mic',
      description: 'Immersive sound and clear communication for your gaming sessions.',
      price: 89.99,
      stock: 70,
      image: 'https://images.pexels.com/photos/3935704/pexels-photo-3935704.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    },
    {
      name: 'E-Reader with Backlight',
      slug: 'e-reader-with-backlight',
      description: 'Read comfortably day or night with a glare-free screen and adjustable backlight.',
      price: 139.99,
      stock: 65,
      image: 'https://images.pexels.com/photos/3935705/pexels-photo-3935705.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    },
    {
      name: 'Action Camera 4K',
      slug: 'action-camera-4k',
      description: 'Capture your adventures in stunning 4K resolution, waterproof and durable.',
      price: 299.00,
      stock: 45,
      image: 'https://images.pexels.com/photos/3935706/pexels-photo-3935706.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    },
    {
      name: 'Drone with HD Camera',
      slug: 'drone-with-hd-camera',
      description: 'Explore the skies and capture aerial footage with ease.',
      price: 599.00,
      stock: 10,
      image: 'https://images.pexels.com/photos/3935707/pexels-photo-3935707.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    },
  ];

  for (const product of productsData) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product,
    });
  }
  console.log(`Seeded ${productsData.length} products.`);

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
