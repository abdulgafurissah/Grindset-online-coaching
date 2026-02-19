"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Send, Phone, Video, MoreVertical, Search, Paperclip, Loader2, Plus, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { sendMessage, getMessages } from "@/app/actions/message";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

interface User {
    id: string;
    name: string | null;
    image: string | null;
    email?: string | null;
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
    initialConversations,
    allContacts = []
}: {
    currentUser: User,
    initialConversations: Conversation[],
    allContacts?: User[]
}) {
    const [conversations, setConversations] = useState<Conversation[]>(
        initialConversations.map(c => ({
            ...c,
            lastMessage: c.lastMessage || "Start a conversation" // Handle empty lastMessage
        }))
    );
    const [activeChat, setActiveChat] = useState<Conversation | null>(initialConversations[0] || null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [isLoadingMessages, setIsLoadingMessages] = useState(false);
    const [isNewChatOpen, setIsNewChatOpen] = useState(false);
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

        // Update conversation list last message
        setConversations(prev => prev.map(c =>
            c.id === activeChat.id ? { ...c, lastMessage: tempMessage.content, time: new Date() } : c
        ));

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

    const startNewChat = (contact: User) => {
        // Check if conversation already exists
        const existingConvo = conversations.find(c => c.id === contact.id);

        if (existingConvo) {
            setActiveChat(existingConvo);
        } else {
            // Create temporary new conversation
            const newConvo: Conversation = {
                id: contact.id,
                name: contact.name,
                image: contact.image,
                lastMessage: "Start a conversation",
                time: new Date(),
                unread: 0
            };
            setConversations([newConvo, ...conversations]);
            setActiveChat(newConvo);
        }
        setIsNewChatOpen(false);
    };

    return (
        <div className="h-[calc(100vh-2rem)] flex overflow-hidden border border-slate-200 rounded-xl bg-white mx-8 my-4 shadow-sm">
            {/* Sidebar / Contact List */}
            <div className="w-80 border-r border-slate-200 flex flex-col bg-slate-50">
                <div className="p-4 border-b border-slate-200 flex items-center gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search messages..."
                            className="w-full bg-white border border-slate-200 rounded-md py-2.5 pl-10 pr-4 text-black-rich placeholder:text-slate-400 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand text-sm transition-all"
                        />
                    </div>
                    <Dialog open={isNewChatOpen} onOpenChange={setIsNewChatOpen}>
                        <DialogTrigger asChild>
                            <button className="p-2.5 bg-brand text-white rounded-md hover:bg-brand-600 transition-colors shadow-sm" title="New Message">
                                <Plus className="h-5 w-5" />
                            </button>
                        </DialogTrigger>
                        <DialogContent className="bg-white text-black-rich border-slate-200 sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>New Message</DialogTitle>
                            </DialogHeader>
                            <div className="mt-4 max-h-[300px] overflow-y-auto space-y-2">
                                {allContacts.length === 0 ? (
                                    <p className="text-center text-slate-500 py-4">No contacts found.</p>
                                ) : (
                                    allContacts.map(contact => (
                                        <button
                                            key={contact.id}
                                            onClick={() => startNewChat(contact)}
                                            className="w-full flex items-center gap-3 p-3 hover:bg-slate-100 rounded-lg transition-colors text-left"
                                        >
                                            <div className="h-10 w-10 rounded-full bg-slate-200 overflow-hidden relative border border-slate-200 flex-shrink-0">
                                                {contact.image ? (
                                                    <Image src={contact.image} alt={contact.name || "User"} fill className="object-cover" />
                                                ) : (
                                                    <div className="h-full w-full flex items-center justify-center text-slate-500 font-bold">
                                                        {contact.name?.charAt(0) || "U"}
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <div className="font-bold text-black-rich">{contact.name}</div>
                                                <div className="text-xs text-slate-500">{contact.email}</div>
                                            </div>
                                        </button>
                                    ))
                                )}
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {conversations.map((contact) => (
                        <button
                            key={contact.id}
                            onClick={() => setActiveChat(contact)}
                            className={cn(
                                "w-full text-left p-4 flex items-center gap-3 hover:bg-slate-100 transition-colors border-b border-slate-100",
                                activeChat?.id === contact.id ? "bg-white border-l-4 border-l-brand shadow-sm" : ""
                            )}
                        >
                            <div className="relative">
                                <div className="h-12 w-12 rounded-full bg-slate-200 overflow-hidden relative border border-slate-200">
                                    {contact.image ? (
                                        <Image
                                            src={contact.image}
                                            alt={contact.name || "User"}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center text-slate-500 font-bold">
                                            {contact.name?.charAt(0) || "U"}
                                        </div>
                                    )}
                                </div>
                                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white" />
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <div className="flex justify-between items-center mb-1">
                                    <span className={cn("font-bold truncate", activeChat?.id === contact.id ? "text-brand" : "text-black-rich")}>
                                        {contact.name || "Unknown"}
                                    </span>
                                    {/* <span className="text-xs text-slate-400">{new Date(contact.time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span> */}
                                </div>
                                <p className="text-xs text-slate-500 truncate pr-2">{contact.lastMessage}</p>
                            </div>
                        </button>
                    ))}
                    {conversations.length === 0 && (
                        <div className="p-8 text-center text-slate-400 text-sm flex flex-col items-center gap-3">
                            <MessageCircle className="h-12 w-12 text-slate-300" />
                            <p>No conversations yet.</p>
                            <p className="text-xs text-slate-400">Click the + button to start a chat.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Chat Area */}
            {activeChat ? (
                <div className="flex-1 flex flex-col bg-white">
                    {/* Chat Header */}
                    <div className="h-16 border-b border-slate-200 flex items-center justify-between px-6 bg-white/80 backdrop-blur-sm">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-slate-200 overflow-hidden relative border border-slate-200">
                                {activeChat.image ? (
                                    <Image
                                        src={activeChat.image}
                                        alt={activeChat.name || "User"}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="h-full w-full flex items-center justify-center text-slate-500 font-bold">
                                        {activeChat.name?.charAt(0) || "U"}
                                    </div>
                                )}
                            </div>
                            <div>
                                <h2 className="font-bold text-black-rich">{activeChat.name || "Unknown"}</h2>
                                <span className="text-xs text-green-600 flex items-center gap-1">
                                    <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                                    Online
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 text-slate-400">
                            <button className="hover:text-brand transition-colors"><Phone className="h-5 w-5" /></button>
                            <button className="hover:text-brand transition-colors"><Video className="h-5 w-5" /></button>
                            <button className="hover:text-brand transition-colors"><MoreVertical className="h-5 w-5" /></button>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
                        {isLoadingMessages && messages.length === 0 ? (
                            <div className="flex items-center justify-center h-full">
                                <Loader2 className="h-8 w-8 text-slate-300 animate-spin" />
                            </div>
                        ) : (
                            messages.map((msg) => {
                                const isMe = msg.senderId === currentUser.id;
                                return (
                                    <div key={msg.id} className={cn("flex", isMe ? "justify-end" : "justify-start")}>
                                        <div className={cn(
                                            "max-w-[70%] rounded-2xl px-5 py-3 text-sm leading-relaxed shadow-sm",
                                            isMe
                                                ? "bg-brand text-black-rich rounded-br-none"
                                                : "bg-white text-black-rich border border-slate-200 rounded-bl-none"
                                        )}>
                                            <p>{msg.content}</p>
                                            <p className={cn("text-[10px] mt-1 opacity-50", isMe ? "text-black" : "text-slate-500")}>
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
                    <div className="p-4 border-t border-slate-200 bg-white">
                        <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                            <button type="button" className="p-2 text-slate-400 hover:text-black-rich transition-colors">
                                <Paperclip className="h-5 w-5" />
                            </button>
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Type a message..."
                                className="flex-1 bg-slate-50 border border-slate-200 rounded-full px-4 py-3 text-black-rich placeholder:text-slate-400 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all"
                            />
                            <button
                                type="submit"
                                disabled={!newMessage.trim()}
                                className="p-3 bg-brand rounded-full text-black-rich hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                            >
                                <Send className="h-5 w-5" />
                            </button>
                        </form>
                    </div>
                </div>
            ) : (
                <div className="flex-1 flex items-center justify-center bg-slate-50 text-slate-400">
                    <p>Select a conversation to start messaging</p>
                </div>
            )}
        </div>
    );
}
