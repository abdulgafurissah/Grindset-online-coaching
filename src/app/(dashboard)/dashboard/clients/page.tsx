import { getCoachClients } from "@/app/actions/coach";
import ClientList from "./ClientList";

export default async function ClientsPage() {
    const clients = await getCoachClients();

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-black-rich uppercase tracking-tight">
                    My Clients <span className="text-brand text-lg align-top ml-2">{clients.length} Active</span>
                </h1>
            </div>

            <ClientList clients={clients} />
        </div>
    );
}
