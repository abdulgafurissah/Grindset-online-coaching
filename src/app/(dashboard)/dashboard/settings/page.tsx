import { auth } from "@/auth";
import { SettingsView } from "@/components/SettingsView";

export default async function SettingsPage() {
    const session = await auth();
    const user = session?.user;

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white uppercase tracking-tight">
                    Account <span className="text-brand">Settings</span>
                </h1>
                <p className="text-white/60">Manage your profile, security, and preferences.</p>
            </div>

            <SettingsView user={user} />
        </div>
    );
}
