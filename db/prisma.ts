// // import { PrismaClient

// //  } from "@/app/generated/prisma/client";

// import { PrismaClient } from "@prisma/client"

// import { PrismaNeonHttp } from "@prisma/adapter-neon";
// import { neon } from "@neondatabase/serverless";

//  const prismaClientSingleton = () => {
//     return new PrismaClient();
//  }

//  type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

//  const globalForPrisma = globalThis as unknown as {
//     prisma: PrismaClientSingleton | undefined
//  };

//  const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

//  export default prisma;

//  if (process.env.NODE_ENV!=='production') globalForPrisma.prisma = prisma;

import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });
export default prisma;
