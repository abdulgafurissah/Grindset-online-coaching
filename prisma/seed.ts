
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    const password = await bcrypt.hash('password123', 10)

    // Create Admin
    const admin = await prisma.user.upsert({
        where: { email: 'admin@grindset.com' },
        update: {},
        create: {
            email: 'admin@grindset.com',
            name: 'Admin User',
            password,
            role: 'ADMIN',
            emailVerified: new Date(),
        },
    })

    // Create Coach
    const coach = await prisma.user.upsert({
        where: { email: 'coach@grindset.com' },
        update: {},
        create: {
            email: 'coach@grindset.com',
            name: 'Coach Carter',
            password,
            role: 'COACH',
            emailVerified: new Date(),
        },
    })

    // Create Client
    const client = await prisma.user.upsert({
        where: { email: 'client@grindset.com' },
        update: {},
        create: {
            email: 'client@grindset.com',
            name: 'Client John',
            password,
            role: 'CLIENT',
            emailVerified: new Date(),
            coachId: coach.id, // Assign to coach
        },
    })

    console.log({ admin, coach, client })
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
