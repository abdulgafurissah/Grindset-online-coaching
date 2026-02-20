"use client";

import { useState } from "react";
import Image from "next/image";
import { Search } from "lucide-react";
import { Program } from "@prisma/client";
import AssignCoachProgramDialog from "./AssignCoachProgramDialog";

interface Client {
    id: string;
    name: string | null;
    status: string;
    joinedAt: string;
    email: string | null;
    image: string | null;
    program: { id: string, title: string } | null;
}

export default function ClientList({ clients, programs }: { clients: Client[], programs: Program[] }) {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredClients = clients.filter(client =>
        client.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input
                    type="text"
                    placeholder="Search clients by name, email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg py-2.5 pl-10 pr-4 text-black-rich placeholder:text-slate-400 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all font-medium shadow-sm"
                />
            </div>

            <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-xs tracking-wider border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4">Client</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Program</th>
                            <th className="px-6 py-4">Joined At</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredClients.map((client) => (
                            <tr key={client.id} className="hover:bg-slate-50 transition-colors group cursor-pointer">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full overflow-hidden bg-slate-100 relative border border-slate-200">
                                            {client.image ? (
                                                <Image
                                                    src={client.image}
                                                    alt={client.name || "Client"}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-slate-200 text-slate-500 font-bold">
                                                    {client.name?.[0] || "?"}
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <div className="font-bold text-black-rich">{client.name || "Unnamed"}</div>
                                            <div className="text-xs text-slate-500">{client.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wide border ${client.status === "Active"
                                        ? "bg-green-100 text-green-700 border-green-200"
                                        : "bg-yellow-100 text-yellow-700 border-yellow-200"
                                        }`}>
                                        {client.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    {client.program ? (
                                        <span className="font-medium text-black-rich">{client.program.title}</span>
                                    ) : (
                                        <span className="text-slate-400 italic text-xs">Unassigned</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-slate-500 font-medium">{client.joinedAt}</td>
                                <td className="px-6 py-4 text-right">
                                    <AssignCoachProgramDialog client={client} programs={programs} />
                                </td>
                            </tr>
                        ))}
                        {filteredClients.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                                    No clients found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
