import { getCoachClients, getCoachPrograms } from "@/app/actions/coach";
import ClientList from "./ClientList";

export default async function ClientsPage() {
    const clients = await getCoachClients();
    const programs = await getCoachPrograms();

    return (
        <div className="p-8">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-white uppercase tracking-tight">
                    My Clients <span className="text-brand text-lg align-top ml-2">{clients.length} Active</span>
                </h1>
                <button className="bg-brand hover:bg-brand-600 text-black-rich font-bold py-2 px-6 rounded-none uppercase text-xs tracking-widest transition-all">
                    Add New Client
                </button>
            </div>

            <ClientList clients={clients} programs={programs} />
        </div>
    );
}
