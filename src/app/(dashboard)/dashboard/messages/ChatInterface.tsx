"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Send, Phone, Video, MoreVertical, Search, Paperclip, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { sendMessage, getMessages } from "@/app/actions/message";
import { toast } from "sonner";

interface User {
    id: string;
    name: string | null;
    image: string | null;
}

interface Message {
    id: string;
    content: string;
    senderId: string;
    createdAt: Date;
}

interface Conversation {
    id: string; // partnerId
    name: string | null;
    image: string | null;
    lastMessage: string;
    time: Date;
    unread: number;
}

export default function ChatInterface({
    currentUser,
    initialConversations
}: {
    currentUser: User,
    initialConversations: Conversation[]
}) {
    const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
    const [activeChat, setActiveChat] = useState<Conversation | null>(initialConversations[0] || null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [isLoadingMessages, setIsLoadingMessages] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Fetch messages when active chat changes
    useEffect(() => {
        if (!activeChat) return;

        const fetchMessages = async () => {
            setIsLoadingMessages(true);
            try {
                const fetchedMessages = await getMessages(activeChat.id);
                setMessages(fetchedMessages);
            } catch (error) {
                toast.error("Failed to load messages");
            } finally {
                setIsLoadingMessages(false);
            }
        };

        fetchMessages();

        // Polling for new messages (MVP only)
        const interval = setInterval(async () => {
            const fetchedMessages = await getMessages(activeChat.id);
            setMessages(fetchedMessages);
        }, 5000);

        return () => clearInterval(interval);
    }, [activeChat]);

    // Scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !activeChat) return;

        const tempMessage: Message = {
            id: "temp-" + Date.now(),
            content: newMessage,
            senderId: currentUser.id,
            createdAt: new Date()
        };

        // Optimistic update
        setMessages([...messages, tempMessage]);
        setNewMessage("");

        try {
            const result = await sendMessage(activeChat.id, tempMessage.content);
            if (!result.success) {
                toast.error("Failed to send message");
                // Rollback? For MVP just show error
            } else {
                // Refresh messages to get real ID
                const fetchedMessages = await getMessages(activeChat.id);
                setMessages(fetchedMessages);
            }
        } catch (error) {
            toast.error("Failed to send message");
        }
    };

    return (
        <div className="h-[calc(100vh-2rem)] flex overflow-hidden border border-white/10 rounded-xl bg-black-rich mx-8 my-4">
            {/* Sidebar / Contact List */}
            <div className="w-80 border-r border-white/10 flex flex-col bg-black-light">
                <div className="p-4 border-b border-white/10">
                    <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-white/40" />
                        <input
                            type="text"
                            placeholder="Search messages..."
                            className="w-full bg-black-rich border border-white/10 rounded-md py-2.5 pl-10 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:border-brand/50 text-sm"
                        />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {conversations.map((contact) => (
                        <button
                            key={contact.id}
                            onClick={() => setActiveChat(contact)}
                            className={cn(
                                "w-full text-left p-4 flex items-center gap-3 hover:bg-white/5 transition-colors border-b border-white/5",
                                activeChat?.id === contact.id ? "bg-brand/10 border-brand/20" : ""
                            )}
                        >
                            <div className="relative">
                                <div className="h-12 w-12 rounded-full bg-white/10 overflow-hidden relative">
                                    {contact.image ? (
                                        <Image
                                            src={contact.image}
                                            alt={contact.name || "User"}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center text-white/50 font-bold">
                                            {contact.name?.charAt(0) || "U"}
                                        </div>
                                    )}
                                </div>
                                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-black-rich" />
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <div className="flex justify-between items-center mb-1">
                                    <span className={cn("font-bold truncate", activeChat?.id === contact.id ? "text-brand" : "text-white")}>
                                        {contact.name || "Unknown"}
                                    </span>
                                    {/* <span className="text-xs text-white/40">{new Date(contact.time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span> */}
                                </div>
                                <p className="text-xs text-white/50 truncate pr-2">{contact.lastMessage}</p>
                            </div>
                        </button>
                    ))}
                    {conversations.length === 0 && (
                        <div className="p-8 text-center text-white/30 text-sm">
                            No conversations yet.
                        </div>
                    )}
                </div>
            </div>

            {/* Chat Area */}
            {activeChat ? (
                <div className="flex-1 flex flex-col bg-black-rich">
                    {/* Chat Header */}
                    <div className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-black-light/50 backdrop-blur-sm">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-white/10 overflow-hidden relative">
                                {activeChat.image ? (
                                    <Image
                                        src={activeChat.image}
                                        alt={activeChat.name || "User"}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="h-full w-full flex items-center justify-center text-white/50 font-bold">
                                        {activeChat.name?.charAt(0) || "U"}
                                    </div>
                                )}
                            </div>
                            <div>
                                <h2 className="font-bold text-white">{activeChat.name || "Unknown"}</h2>
                                <span className="text-xs text-green-500 flex items-center gap-1">
                                    <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                                    Online
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 text-white/60">
                            <button className="hover:text-brand transition-colors"><Phone className="h-5 w-5" /></button>
                            <button className="hover:text-brand transition-colors"><Video className="h-5 w-5" /></button>
                            <button className="hover:text-brand transition-colors"><MoreVertical className="h-5 w-5" /></button>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        {isLoadingMessages && messages.length === 0 ? (
                            <div className="flex items-center justify-center h-full">
                                <Loader2 className="h-8 w-8 text-white/20 animate-spin" />
                            </div>
                        ) : (
                            messages.map((msg) => {
                                const isMe = msg.senderId === currentUser.id;
                                return (
                                    <div key={msg.id} className={cn("flex", isMe ? "justify-end" : "justify-start")}>
                                        <div className={cn(
                                            "max-w-[70%] rounded-2xl px-5 py-3 text-sm leading-relaxed",
                                            isMe
                                                ? "bg-brand text-black-rich rounded-br-none"
                                                : "bg-white/10 text-white rounded-bl-none"
                                        )}>
                                            <p>{msg.content}</p>
                                            <p className={cn("text-[10px] mt-1 opacity-50", isMe ? "text-black" : "text-white")}>
                                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                )
                            })
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-4 border-t border-white/10 bg-black-light">
                        <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                            <button type="button" className="p-2 text-white/40 hover:text-white transition-colors">
                                <Paperclip className="h-5 w-5" />
                            </button>
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Type a message..."
                                className="flex-1 bg-black-rich border border-white/10 rounded-full px-4 py-3 text-white focus:outline-none focus:border-brand/50"
                            />
                            <button
                                type="submit"
                                disabled={!newMessage.trim()}
                                className="p-3 bg-brand rounded-full text-black-rich hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                <Send className="h-5 w-5" />
                            </button>
                        </form>
                    </div>
                </div>
            ) : (
                <div className="flex-1 flex items-center justify-center bg-black-rich text-white/30">
                    <p>Select a conversation to start messaging</p>
                </div>
            )}
        </div>
    );
}
