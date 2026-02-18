"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

export async function registerCoach(formData: FormData) {
    try {
        const name = formData.get("name") as string;
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        const phoneNumber = formData.get("phoneNumber") as string;
        const gender = formData.get("gender") as string;
        const dob = formData.get("dob") as string ? new Date(formData.get("dob") as string) : null;
        const nationality = formData.get("nationality") as string;

        // Specialized fields (JSON or Array parsing)
        const specializations = JSON.parse(formData.get("specializations") as string || "[]");
        const experienceYears = parseInt(formData.get("experienceYears") as string || "0");
        const bio = formData.get("bio") as string;
        const languages = formData.get("languages") as string ? (formData.get("languages") as string).split(",") : [];

        const coachingTypes = JSON.parse(formData.get("coachingTypes") as string || "[]");
        const pricingModel = formData.get("pricingModel") as string;
        const priceAmount = parseFloat(formData.get("priceAmount") as string || "0");
        const availability = formData.get("availability") as string;

        const instagram = formData.get("instagram") as string;
        const youtube = formData.get("youtube") as string;
        const website = formData.get("website") as string;

        // File handling (Mocking URL generation for now)
        // In production, upload to S3/Blob storage and get URL
        const imageFile = formData.get("image") as File;
        const idDocFile = formData.get("idDocument") as File;

        const imagePath = imageFile && imageFile.size > 0 ? `/uploads/profiles/${imageFile.name}` : null;
        const idDocPath = idDocFile && idDocFile.size > 0 ? `/uploads/docs/${idDocFile.name}` : null;

        // Check if user exists
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return { success: false, error: "User with this email already exists." };
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: "COACH",
                approvalStatus: "PENDING",
                profile: {
                    create: {
                        bio,
                        phoneNumber,
                        gender,
                        dob,
                        nationality,
                        specializations,
                        experienceYears,
                        languages,
                        coachingTypes,
                        pricingModel,
                        priceAmount,
                        availability: availability ? { desc: availability } : null,
                        socialLinks: { instagram, youtube, website },
                        idDocument: idDocPath,
                        specialty: specializations[0] || "General", // Compatibility
                        qualification: "Pending Verification", // Compatibility
                    }
                }
            }
        });

        return { success: true };

    } catch (error) {
        console.error("Coach Registration Error:", error);
        return { success: false, error: "Failed to submit application. Please try again." };
    }
}
