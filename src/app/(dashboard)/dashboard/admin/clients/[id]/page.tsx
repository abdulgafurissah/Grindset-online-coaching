import { getClientById, getPrograms } from "@/app/actions/admin";
import AssignProgramForm from "./AssignProgramForm";
import EditClientDialog from "./EditClientDialog";

export default async function ClientProfilePage({ params }: { params: { id: string } }) {
    const client = await getClientById(params.id);
    const programs = await getPrograms();

    if (!client) {
        return (
            <div className="p-6 md:p-8 max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-black-rich">Client not found</h1>
            </div>
        );
    }

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-black-rich mb-2 uppercase tracking-tight">{client.name}</h1>
                    <p className="text-slate-500">{client.email}</p>
                </div>
                <EditClientDialog client={client} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-8">
                    <div className="bg-white border border-slate-200 rounded-xl shadow-sm">
                        <div className="p-6 border-b border-slate-100">
                            <h2 className="text-xl font-bold text-black-rich">Personal Information</h2>
                        </div>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <p className="text-sm text-slate-500">Gender</p>
                                <p className="font-medium text-black-rich">{client.profile?.gender || "N/A"}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">Date of Birth</p>
                                <p className="font-medium text-black-rich">{client.profile?.dob ? new Date(client.profile.dob).toLocaleDateString() : "N/A"}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">Phone Number</p>
                                <p className="font-medium text-black-rich">{client.profile?.phoneNumber || "N/A"}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">WhatsApp Number</p>
                                <p className="font-medium text-black-rich">{client.profile?.whatsappNumber || "N/A"}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">Nationality</p>
                                <p className="font-medium text-black-rich">{client.profile?.nationality || "N/A"}</p>
                            </div>
                            <div className="md:col-span-2">
                                <p className="text-sm text-slate-500">Emergency Contact</p>
                                <p className="font-medium text-black-rich">{client.profile?.emergencyContact || "N/A"}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-xl shadow-sm">
                        <div className="p-6 border-b border-slate-100">
                            <h2 className="text-xl font-bold text-black-rich">Health & Fitness Data</h2>
                        </div>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <p className="text-sm text-slate-500">Weight</p>
                                <p className="font-medium text-black-rich">{client.profile?.weight ? `${client.profile.weight} kg` : "N/A"}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">Height</p>
                                <p className="font-medium text-black-rich">{client.profile?.height ? `${client.profile.height} cm` : "N/A"}</p>
                            </div>
                            <div className="md:col-span-2">
                                <p className="text-sm text-slate-500">Medical Conditions</p>
                                <p className="font-medium text-black-rich bg-slate-50 p-3 rounded-lg mt-1 whitespace-pre-wrap">{client.profile?.medicalConditions || "None reported."}</p>
                            </div>
                            <div className="md:col-span-2">
                                <p className="text-sm text-slate-500">Allergies</p>
                                <p className="font-medium text-black-rich bg-slate-50 p-3 rounded-lg mt-1 whitespace-pre-wrap">{client.profile?.allergies || "None reported."}</p>
                            </div>
                            <div className="md:col-span-2">
                                <p className="text-sm text-slate-500">Fitness Goals</p>
                                <p className="font-medium text-black-rich bg-slate-50 p-3 rounded-lg mt-1 whitespace-pre-wrap">{client.profile?.goals || "No goals stated."}</p>
                            </div>
                            <div className="md:col-span-2">
                                <p className="text-sm text-slate-500">Lifestyle Habits</p>
                                <p className="font-medium text-black-rich bg-slate-50 p-3 rounded-lg mt-1 whitespace-pre-wrap">{client.profile?.lifestyleHabits || "Not provided."}</p>
                            </div>
                            <div className="md:col-span-2">
                                <p className="text-sm text-slate-500">Other Relevant Health Info</p>
                                <p className="font-medium text-black-rich bg-slate-50 p-3 rounded-lg mt-1 whitespace-pre-wrap">{client.profile?.anyRelevantHealthInfo || "Not provided."}</p>
                            </div>
                        </div>
                    </div>
                    <AssignProgramForm client={client} programs={programs} />
                </div>
                <div className="space-y-8">
                    <div className="bg-white border border-slate-200 rounded-xl shadow-sm">
                        <div className="p-6 border-b border-slate-100">
                            <h2 className="text-xl font-bold text-black-rich">Coach</h2>
                        </div>
                        <div className="p-6">
                            <p className="text-sm text-slate-500">Assigned Coach</p>
                            <p className="font-medium text-black-rich">{client.coach?.name || "Not Assigned"}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
