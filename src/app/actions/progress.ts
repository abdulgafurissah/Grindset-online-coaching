"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { r2 } from "@/lib/r2";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export async function logProgress(formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) {
        return { error: "Not authenticated" };
    }

    const weight = formData.get("weight") as string;
    const bodyFat = formData.get("bodyFat") as string;
    const measurements = formData.get("measurements") as string;

    try {
        await prisma.progressLog.create({
            data: {
                userId: session.user.id,
                date: new Date(),
                metrics: {
                    weight: weight ? parseFloat(weight) : undefined,
                    bodyFat: bodyFat ? parseFloat(bodyFat) : undefined,
                    measurements: measurements ? JSON.parse(measurements) : undefined,
                }
            }
        });

        revalidatePath("/dashboard/progress");
        return { success: true };
    } catch (error) {
        console.error("Failed to log progress:", error);
        return { error: "Failed to log progress" };
    }
}

export async function getPresignedUploadUrl(fileName: string, contentType: string) {
    const session = await auth();
    if (!session?.user?.id) {
        return { error: "Not authenticated" };
    }

    const key = `progress-photos/${session.user.id}/${Date.now()}-${fileName}`;

    try {
        const command = new PutObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME,
            Key: key,
            ContentType: contentType,
        });

        const url = await getSignedUrl(r2, command, { expiresIn: 3600 });
        return { url, key };
    } catch (error) {
        console.error("Failed to generate presigned URL:", error);
        return { error: "Failed to generate upload URL" };
    }
}

export async function saveProgressPhoto(key: string) {
    const session = await auth();
    if (!session?.user?.id) {
        return { error: "Not authenticated" };
    }

    const photoUrl = `https://${process.env.R2_PUBLIC_DOMAIN}/${key}`;

    try {
        await prisma.progressLog.create({
            data: {
                userId: session.user.id,
                date: new Date(),
                photos: [photoUrl],
            }
        });

        revalidatePath("/dashboard/progress");
        return { success: true, photoUrl };
    } catch (error) {
        console.error("Failed to save progress photo:", error);
        return { error: "Failed to save progress photo" };
    }
}
