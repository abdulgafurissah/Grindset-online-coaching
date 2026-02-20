
"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function sendMessage(receiverId: string, content: string) {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    const sender = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { role: true, coachId: true }
    });
    const receiver = await prisma.user.findUnique({
        where: { id: receiverId },
        select: { role: true, coachId: true }
    });

    if (!sender || !receiver) return { error: "Invalid user" };

    // Admins can message anyone.
    // Coaches can message admins, or their assigned clients.
    // Clients can message admins, or their assigned coach.
    const isSenderAdmin = sender.role === "ADMIN";
    const isReceiverAdmin = receiver.role === "ADMIN";

    let isAuthorized = false;

    if (isSenderAdmin) {
        isAuthorized = true; // Admin can message anyone
    } else if (sender.role === "COACH") {
        if (isReceiverAdmin) {
            isAuthorized = true; // Coach can message Admin
        } else if (receiver.role === "CLIENT" && receiver.coachId === session.user.id) {
            isAuthorized = true; // Coach can message their own client
        }
    } else if (sender.role === "CLIENT") {
        if (isReceiverAdmin) {
            isAuthorized = true; // Client can message Admin
        } else if (receiver.role === "COACH" && sender.coachId === receiverId) {
            isAuthorized = true; // Client can message their own coach
        }
    }

    if (!isAuthorized) return { error: "You are not authorized to message this user according to your role." };

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

    if (!currentUser) return [];

    if (currentUser.role === "ADMIN") {
        // Admin sees everyone (Coaches and Clients) exception themselves
        return await prisma.user.findMany({
            where: { id: { not: session.user.id } },
            select: { id: true, name: true, image: true, email: true, role: true }
        });
    } else if (currentUser.role === "COACH") {
        // Coach sees Admins and their assigned clients
        return await prisma.user.findMany({
            where: {
                OR: [
                    { role: "ADMIN" },
                    { coachId: session.user.id }
                ]
            },
            select: { id: true, name: true, image: true, email: true, role: true }
        });
    } else if (currentUser.role === "CLIENT") {
        // Client sees Admins and their assigned coach
        const conditions: any[] = [{ role: "ADMIN" }];
        if (currentUser.coachId) {
            conditions.push({ id: currentUser.coachId });
        }

        return await prisma.user.findMany({
            where: {
                OR: conditions
            },
            select: { id: true, name: true, image: true, email: true, role: true }
        });
    }

    return [];
}
