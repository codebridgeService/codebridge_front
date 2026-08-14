import { prisma } from "./lib/prisma.js";

async function check() {
  console.log("Models in Prisma Client:", Object.keys(prisma).filter(k => !k.startsWith('_')));
  process.exit(0);
}

check();
