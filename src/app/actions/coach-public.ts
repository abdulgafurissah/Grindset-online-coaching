"use server";

import prisma from "@/lib/prisma";

export async function getCoaches() {
    try {
        const coaches = await prisma.user.findMany({
            where: {
                role: "COACH",
                approvalStatus: "APPROVED" // Only show approved coaches
            },
            select: {
                id: true,
                name: true,
                image: true,
                profile: {
                    select: {
                        specialty: true, // Keeping for compatibility, though we added specializations
                        specializations: true,
                        rating: true,
                        bio: true,
                        priceAmount: true,
                        pricingModel: true,
                        qualification: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'asc' // Or any other ordering
            }
        });
        return coaches;
    } catch (error) {
        console.error("Error fetching coaches:", error);
        return [];
    }
}
