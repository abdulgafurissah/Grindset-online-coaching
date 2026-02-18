"use client";

import { useState } from "react";
import Image from "next/image";
import { Search } from "lucide-react";

interface Client {
    id: string;
    name: string | null;
    status: string;
    joinedAt: string;
    email: string | null;
    image: string | null;
}

export default function ClientList({ clients }: { clients: Client[] }) {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredClients = clients.filter(client =>
        client.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <div className="mb-6">
                <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-white/40" />
                    <input
                        type="text"
                        placeholder="Search clients by name, email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-black-light border border-white/10 rounded-md py-2.5 pl-10 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:border-brand/50 transition-all font-medium"
                    />
                </div>
            </div>

            <div className="rounded-xl border border-white/10 overflow-hidden bg-black-light">
                <table className="w-full text-left text-sm">
                    <thead className="bg-white/5 text-white/60 font-medium uppercase text-xs tracking-wider">
                        <tr>
                            <th className="px-6 py-4">Client</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Joined At</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {filteredClients.map((client) => (
                            <tr key={client.id} className="hover:bg-white/5 transition-colors group cursor-pointer">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-12 w-12 rounded-full overflow-hidden bg-white/10 relative">
                                            {client.image ? (
                                                <Image
                                                    src={client.image}
                                                    alt={client.name || "Client"}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <Image
                                                    src={`https://ui-avatars.com/api/?name=${client.name || "U"}&background=random&color=fff`}
                                                    alt={client.name || "Client"}
                                                    fill
                                                    className="object-cover"
                                                />
                                            )}
                                        </div>
                                        <div>
                                            <div className="font-bold text-white">{client.name || "Unnamed"}</div>
                                            <div className="text-xs text-white/40">{client.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${client.status === "Active" ? "bg-green-500/10 text-green-500" : "bg-yellow-500/10 text-yellow-500"
                                        }`}>
                                        {client.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-white/50">{client.joinedAt}</td>
                            </tr>
                        ))}
                        {filteredClients.length === 0 && (
                            <tr>
                                <td colSpan={3} className="px-6 py-12 text-center text-white/30">
                                    No clients found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </>
    );
}
