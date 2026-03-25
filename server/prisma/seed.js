import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

function slugify(text, id) {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '')
    + '-' + id;
}

async function main() {
  console.log('Start seeding products, users, reviews, and banners...');

  // Read the original file
  const productsFilePath = new URL('../../client/data/products.js', import.meta.url);
  const content = fs.readFileSync(productsFilePath, 'utf-8');
  
  // Transform ES modules exports to local consts to be able to evaluate
  const scriptContent = content.replace(/export const /g, 'const ');
  
  // Evaluate and extract arrays
  const { products, users: rawUsers, reviews: rawReviews } = eval(`(() => {
    ${scriptContent}
    return { products: products || [], users: users || [], reviews: reviews || [] };
  })()`);

  // 1. Create categories and subcategories
  console.log('--- Seeding Categories ---');
  const categoriesMap = new Map(); // name -> id
  const subCategoriesMap = new Map(); // name -> id

  for (const p of products) {
    if (!categoriesMap.has(p.category)) {
      const cat = await prisma.category.upsert({
        where: { name: p.category },
        update: {},
        create: { name: p.category },
      });
      categoriesMap.set(p.category, cat.id);
      console.log(`Upserted category: ${p.category}`);
    }
    
    if (p.subcategory && !subCategoriesMap.has(p.subcategory)) {
      const parentId = categoriesMap.get(p.category);
      const subCat = await prisma.category.upsert({
        where: { name: p.subcategory },
        update: {},
        create: { name: p.subcategory, parentId },
      });
      subCategoriesMap.set(p.subcategory, subCat.id);
      console.log(`Upserted subcategory: ${p.subcategory}`);
    }
  }

  // 2. Insert Products
  console.log('--- Seeding Products ---');
  for (const p of products) {
    const slug = slugify(p.name, p.id);
    const categoryId = p.subcategory 
      ? subCategoriesMap.get(p.subcategory) 
      : categoriesMap.get(p.category);

    await prisma.product.upsert({
      where: { id: p.id },
      update: {
        slug,
        name: p.name,
        description: p.description,
        priceCents: p.priceCents,
        categoryId,
        image: p.image,
        images: p.images,
        variants: p.variants || [],
        characteristics: p.characteristics || [],
      },
      create: {
        id: p.id,
        slug,
        name: p.name,
        description: p.description,
        priceCents: p.priceCents,
        categoryId,
        image: p.image,
        images: p.images,
        variants: p.variants || [],
        characteristics: p.characteristics || [],
      },
    });
    console.log(`Upserted product: ${p.name}`);
  }

  // 3. Insert Users
  console.log('--- Seeding Users ---');
  const userMap = new Map(); // original id (e.g. 'u1') -> db id (Int)
  
  for (const u of rawUsers) {
    // Generate dummy data since schema requires email, password, etc.
    const parts = u.name.split(' ');
    const firstName = parts[0] || 'Unknown';
    const lastName = parts.slice(1).join(' ') || '';
    const email = `${firstName.toLowerCase()}.${u.id}@example.com`;

    const user = await prisma.user.upsert({
      where: { email },
      update: {
        name: firstName,
        surname: lastName,
        avatar: u.avatar
      },
      create: {
        email,
        password: 'hashedpassword123', // Dummy password
        name: firstName,
        surname: lastName,
        avatar: u.avatar,
        role: 'USER'
      }
    });
    userMap.set(u.id, user.id);
    console.log(`Upserted user: ${u.name}`);
  }

  // 4. Insert Reviews
  console.log('--- Seeding Reviews ---');
  // Since review has no unique criteria naturally, we'll clear them first or just create them if they don't exist.
  // Actually, let's just create them. If we re-run, it might duplicate unless we check.
  // We can delete all reviews and re-insert them to be idempotent.
  await prisma.review.deleteMany({});
  
  for (const r of rawReviews) {
    const dbUserId = userMap.get(r.userId);
    // Be sure the product exists
    const productExists = products.find(p => p.id === r.itemId);

    if (dbUserId && productExists) {
      await prisma.review.create({
        data: {
          productId: r.itemId,
          userId: dbUserId,
          stars: r.stars,
          text: r.reviewText,
          created_at: new Date(r.date)
        }
      });
      console.log(`Created review for product ${r.itemId}`);
    }
  }

  // 5. Insert Banners
  console.log('--- Seeding Banners ---');
  const dummyBanners = [
    {
      title: 'Promo 20% sur les MacBooks',
      imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=1200',
      link: '/product.html?id=101',
      isActive: true
    },
    {
      title: 'Nouveaux Macarons Artisanaux',
      imageUrl: 'https://images.unsplash.com/photo-1569864358642-9d1684040f43?auto=format&fit=crop&q=80&w=1200',
      link: '/product.html?id=201',
      isActive: true
    }
  ];

  await prisma.banner.deleteMany({});
  for (const banner of dummyBanners) {
    await prisma.banner.create({
      data: banner
    });
    console.log(`Created banner: ${banner.title}`);
  }

  console.log('Seeding finished successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
