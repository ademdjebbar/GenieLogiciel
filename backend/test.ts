import { prisma } from './src/lib/db';
async function test() {
  try {
    const users = await prisma.user.findMany();
    console.log("SUCCESS:", users.length);
  } catch (e) {
    console.error("PRISMA ERROR:", e);
  }
}
test();
