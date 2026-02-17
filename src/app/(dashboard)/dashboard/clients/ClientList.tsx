"use client";

import { useState } from "react";
import Image from "next/image";
import { Search, MoreVertical, X, Check } from "lucide-react";
import { assignProgram } from "@/app/actions/coach";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface Client {
    id: string;
    name: string | null;
    program: string;
    status: string;
    lastCheckIn: string;
    email: string | null;
    image: string | null;
}

interface Program {
    id: string;
    title: string;
}

export default function ClientList({ clients, programs }: { clients: Client[], programs: Program[] }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);
    const [selectedProgramId, setSelectedProgramId] = useState("");
    const [isAssigning, setIsAssigning] = useState(false);

    const filteredClients = clients.filter(client =>
        client.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.program?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAssign = async () => {
        if (!selectedClient || !selectedProgramId) return;

        setIsAssigning(true);
        try {
            const result = await assignProgram(selectedClient.id, selectedProgramId);
            if (result.success) {
                toast.success(`Assigned program to ${selectedClient.name}`);
                setSelectedClient(null);
                setSelectedProgramId("");
            } else {
                toast.error("Failed to assign program");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setIsAssigning(false);
        }
    };

    return (
        <>
            <div className="mb-6">
                <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-white/40" />
                    <input
                        type="text"
                        placeholder="Search clients by name, program..."
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
                            <th className="px-6 py-4">Current Program</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Last Check-in</th>
                            <th className="px-6 py-4 text-right">Actions</th>
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
                                <td className="px-6 py-4 text-white/80 font-medium">{client.program}</td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${client.status === "Active" ? "bg-green-500/10 text-green-500" : "bg-yellow-500/10 text-yellow-500"
                                        }`}>
                                        {client.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-white/50">{client.lastCheckIn}</td>
                                <td className="px-6 py-4 text-right">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setSelectedClient(client)}
                                        className="text-white/40 hover:text-brand hover:bg-brand/10 transition-colors"
                                    >
                                        Assign Program
                                    </Button>
                                </td>
                            </tr>
                        ))}
                        {filteredClients.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-white/30">
                                    No clients found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Assignment Modal Overlay */}
            {selectedClient && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="w-full max-w-md bg-black-light border border-white/10 rounded-xl p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-xl font-bold text-white">Assign Program</h3>
                                <p className="text-white/60 text-sm mt-1">Select a program for {selectedClient.name}</p>
                            </div>
                            <button onClick={() => setSelectedClient(null)} className="text-white/40 hover:text-white">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="space-y-4 mb-6">
                            <label className="text-xs uppercase tracking-wider text-white/40 font-bold">Available Programs</label>
                            <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                                {programs.map(program => (
                                    <button
                                        key={program.id}
                                        onClick={() => setSelectedProgramId(program.id)}
                                        className={`w-full text-left p-3 rounded-lg border transition-all flex justify-between items-center ${selectedProgramId === program.id
                                            ? "bg-brand/10 border-brand text-white"
                                            : "bg-black-rich border-white/5 hover:border-white/20 text-white/70"
                                            }`}
                                    >
                                        <span className="font-medium">{program.title}</span>
                                        {selectedProgramId === program.id && <Check className="h-4 w-4 text-brand" />}
                                    </button>
                                ))}
                                {programs.length === 0 && (
                                    <div className="text-center py-4 text-white/30 text-sm">
                                        No programs available. Create one first.
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-end gap-3">
                            <Button variant="outline" onClick={() => setSelectedClient(null)}>Cancel</Button>
                            <Button
                                onClick={handleAssign}
                                disabled={!selectedProgramId || isAssigning}
                                className="bg-brand text-black-rich hover:bg-brand-600"
                            >
                                {isAssigning ? "Assigning..." : "Confirm Assignment"}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
