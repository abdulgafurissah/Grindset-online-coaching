import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NutritionTracker } from "@/components/NutritionTracker";
import { startOfDay, endOfDay } from "date-fns";

export default async function NutritionPage() {
    const session = await auth();
    const user = session?.user;

    if (!user || !user.id) return null;

    const today = new Date();

    const nutritionLogs = await prisma.nutritionLog.findMany({
        where: {
            userId: user.id,
            createdAt: {
                gte: startOfDay(today),
                lte: endOfDay(today)
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    const hydrationLogs = await prisma.hydrationLog.findMany({
        where: {
            userId: user.id,
            createdAt: {
                gte: startOfDay(today),
                lte: endOfDay(today)
            }
        }
    });

    return <NutritionTracker nutritionLogs={nutritionLogs} hydrationLogs={hydrationLogs} />;
}
