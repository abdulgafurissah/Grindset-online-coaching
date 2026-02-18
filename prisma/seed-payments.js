const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const adminEmail = "admin@grindset.com";
    const coachEmail = "coach@grindset.com"; // Ensure this coach exists from previous seeds

    const coach = await prisma.user.findUnique({ where: { email: coachEmail } });

    if (!coach) {
        console.log("Coach not found. Please run seed-coach.js first or create a coach.");
        return;
    }

    // Create a client if needed
    let client = await prisma.user.findFirst({ where: { role: 'CLIENT' } });
    if (!client) {
        client = await prisma.user.create({
            data: {
                name: "Test Client",
                email: "client@test.com",
                role: "CLIENT",
            }
        });
    }

    // Create some dummy payments
    const payments = [
        { amount: 100.00, coachShare: 80.00, platformShare: 20.00, status: "COMPLETED" },
        { amount: 250.00, coachShare: 200.00, platformShare: 50.00, status: "COMPLETED" },
        { amount: 50.00, coachShare: 40.00, platformShare: 10.00, status: "COMPLETED" },
        { amount: 120.00, coachShare: 96.00, platformShare: 24.00, status: "PENDING" },
    ];

    for (const p of payments) {
        await prisma.payment.create({
            data: {
                amount: p.amount,
                status: p.status,
                userId: client.id,
                coachId: coach.id,
                coachShare: p.coachShare,
                platformShare: p.platformShare,
            }
        });
    }

    console.log("Seeded payments!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
