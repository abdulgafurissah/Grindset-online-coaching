import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
    try {
        return new PrismaClient()
    } catch (e) {
        console.error("Failed to initialize Prisma Client. Check your DATABASE_URL.", e);
        throw e;
    }
}

const prisma = new Proxy({} as any, {
    get: (target, prop) => {
        const g = globalThis as any;
        if (!g.prismaGlobal) {
            g.prismaGlobal = prismaClientSingleton();
        }
        return g.prismaGlobal[prop];
    }
});

export default prisma;

if (process.env.NODE_ENV !== 'production') (globalThis as any).prismaGlobal = undefined;
