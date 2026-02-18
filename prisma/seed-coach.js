const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const email = 'coach@grindset.com';

    // Upsert user to ensure they exist and have COACH role
    const user = await prisma.user.upsert({
        where: { email },
        update: { role: 'COACH', name: 'Sarah Jenkins', image: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=3387&auto=format&fit=crop' },
        create: {
            email,
            name: 'Sarah Jenkins',
            role: 'COACH',
            image: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=3387&auto=format&fit=crop',
            password: 'hashedpassword123', // In real app, hash this
        },
    });

    // Upsert profile with new fields
    await prisma.profile.upsert({
        where: { userId: user.id },
        update: {
            bio: 'Helping high-performers break through mental barriers.',
            specialty: 'Mindset & Performance',
            qualification: 'PhD in Sports Psychology',
            rating: 4.9,
            experience: '10+ Years',
        },
        create: {
            userId: user.id,
            bio: 'Helping high-performers break through mental barriers.',
            specialty: 'Mindset & Performance',
            qualification: 'PhD in Sports Psychology',
            rating: 4.9,
            experience: '10+ Years',
        },
    });

    console.log('Seeded Coach:', user.email);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
