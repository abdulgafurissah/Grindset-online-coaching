
"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function sendMessage(receiverId: string, content: string) {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    // Verify sender and receiver are a matched coach-client pair
    const sender = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { role: true, coachId: true }
    });
    const receiver = await prisma.user.findUnique({
        where: { id: receiverId },
        select: { role: true, coachId: true }
    });

    if (!sender || !receiver) return { error: "Invalid user" };

    const isPaired =
        (sender.role === "CLIENT" && sender.coachId === receiverId) ||
        (sender.role === "COACH" && receiver.coachId === session.user.id);

    if (!isPaired) return { error: "You are not authorized to message this user." };

    try {
        await prisma.message.create({
            data: {
                content,
                senderId: session.user.id,
                receiverId
            }
        });

        revalidatePath("/dashboard/messages");
        return { success: true };
    } catch (error) {
        console.error("Failed to send message:", error);
        return { error: "Failed to send message" };
    }
}

export async function getConversations() {
    const session = await auth();
    if (!session?.user?.id) return [];

    // Complex query to get unique conversation partners
    // For MVP, just get all messages and aggregate in JS
    const messages = await prisma.message.findMany({
        where: {
            OR: [
                { senderId: session.user.id },
                { receiverId: session.user.id }
            ]
        },
        include: {
            sender: true,
            receiver: true
        },
        orderBy: { createdAt: 'desc' }
    });

    const partners = new Map();

    messages.forEach((msg: any) => {
        const partner = msg.senderId === session.user.id ? msg.receiver : msg.sender;
        if (!partners.has(partner.id)) {
            partners.set(partner.id, {
                id: partner.id,
                name: partner.name || "Unknown",
                image: partner.image,
                lastMessage: msg.content,
                time: msg.createdAt, // We'll client-side format
                unread: 0 // logic for unread count would go here
            });
        }
    });

    return Array.from(partners.values());
}

export async function getMessages(partnerId: string) {
    const session = await auth();
    if (!session?.user?.id) return [];

    return await prisma.message.findMany({
        where: {
            OR: [
                { senderId: session.user.id, receiverId: partnerId },
                { senderId: partnerId, receiverId: session.user.id }
            ]
        },
        orderBy: { createdAt: 'asc' }
    });
}

// New function to get contacts for starting new chats
export async function getContacts() {
    const session = await auth();
    if (!session?.user?.id) return [];

    const currentUser = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { role: true, coachId: true }
    });

    if (currentUser?.role === "COACH") {
        // Coach only sees their assigned clients
        return await prisma.user.findMany({
            where: { coachId: session.user.id },
            select: { id: true, name: true, image: true, email: true }
        });
    } else if (currentUser?.role === "CLIENT") {
        // Client only sees their assigned coach
        if (!currentUser.coachId) return [];
        const coach = await prisma.user.findUnique({
            where: { id: currentUser.coachId },
            select: { id: true, name: true, image: true, email: true }
        });
        return coach ? [coach] : [];
    }

    return [];
}
