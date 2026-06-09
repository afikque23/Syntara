const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

prisma.adminPricing.findMany()
  .then(r => console.log(JSON.stringify(r, null, 2)))
  .catch(console.error)
  .finally(() => prisma.$disconnect());
