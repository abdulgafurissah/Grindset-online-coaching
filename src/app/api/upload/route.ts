import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { r2 } from "@/lib/r2";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { auth } from "@/auth";

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { filename, contentType } = await req.json();
        const uniqueFilename = `${session.user.id}/${Date.now()}-${filename}`;

        const signedUrl = await getSignedUrl(
            r2,
            new PutObjectCommand({
                Bucket: process.env.R2_BUCKET_NAME,
                Key: uniqueFilename,
                ContentType: contentType,
            }),
            { expiresIn: 3600 }
        );

        return NextResponse.json({
            uploadUrl: signedUrl,
            fileUrl: `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${uniqueFilename}`
        });
    } catch (error) {
        console.error("[UPLOAD_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
