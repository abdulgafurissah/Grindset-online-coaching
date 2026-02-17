import { Sidebar } from "@/components/Sidebar";
export const dynamic = "force-dynamic";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-black-rich text-white">
            <Sidebar />
            <main className="pl-64">
                {children}
            </main>
        </div>
    );
}
