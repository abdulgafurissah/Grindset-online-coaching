const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    console.log("Starting deletion process...");

    // The user wants ONLY the secured credentials from the database.
    // Based on NEW_TEST_ACCOUNTS.md, the secured admin is:
    const adminEmailToKeep = "admin@grindsetcoaching.com";

    console.log(`Keeping ONLY user: ${adminEmailToKeep}`);

    try {
        // Delete all users EXCEPT the secure admin account
        const deletedUsers = await prisma.user.deleteMany({
            where: {
                NOT: {
                    email: adminEmailToKeep
                }
            }
        });

        console.log(`Successfully deleted ${deletedUsers.count} test users.`);

        // Verify who is left
        const remainingUsers = await prisma.user.findMany({
            select: { email: true, role: true }
        });

        console.log("Remaining users in database:", remainingUsers);

    } catch (e) {
        console.error("Error deleting users:", e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
