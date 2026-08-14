const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  try {
    const services = await prisma.service.findMany({
      orderBy: { order: 'asc' },
      take: 1
    });
    console.log('✅ Service check successful');
    
    const projects = await prisma.project.findMany({
      orderBy: { order: 'asc' },
      take: 1
    });
    console.log('✅ Project check successful');
  } catch (error) {
    console.error('❌ Validation failed:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

check();
