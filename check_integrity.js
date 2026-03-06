const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("Checking for data integrity issues...");

    const users = await prisma.user.findMany();
    console.log(`Total users: ${users.length}`);
    users.forEach(u => console.log(`- ${u.email} (${u.role})`));

    const payments = await prisma.payment.findMany({
        include: { user: true, coach: true }
    });
    console.log(`Total payments: ${payments.length}`);
    const orphanedPayments = payments.filter(p => !p.user);
    if (orphanedPayments.length > 0) {
        console.log(`Found ${orphanedPayments.length} orphaned payments (no user).`);
    }

    const subs = await prisma.subscription.findMany({
        include: { user: true }
    });
    console.log(`Total subscriptions: ${subs.length}`);
    const orphanedSubs = subs.filter(s => !s.user);
    if (orphanedSubs.length > 0) {
        console.log(`Found ${orphanedSubs.length} orphaned subscriptions (no user).`);
    }

    const consultations = await prisma.consultation.findMany({
        include: { client: true, coach: true }
    });
    console.log(`Total consultations: ${consultations.length}`);
    const orphanedConsultations = consultations.filter(c => !c.client || !c.coach);
    if (orphanedConsultations.length > 0) {
        console.log(`Found ${orphanedConsultations.length} orphaned consultations.`);
    }

    const programs = await prisma.program.findMany({
        include: { creator: true }
    });
    console.log(`Total programs: ${programs.length}`);
    const orphanedPrograms = programs.filter(p => !p.creator);
    if (orphanedPrograms.length > 0) {
        console.log(`Found ${orphanedPrograms.length} orphaned programs (no creator).`);
    }
}

main().catch(e => console.error(e)).finally(() => prisma.$disconnect());
