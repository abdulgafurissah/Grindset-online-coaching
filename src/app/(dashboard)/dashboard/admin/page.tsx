import { getAdminStats, getApplications, getAdminUsers, getAvailableCoaches } from "@/app/actions/admin";
import { CheckCircle, Clock, DollarSign, Users } from "lucide-react";
import ApplicationsTable from "./ApplicationsTable";
import UsersTable from "./UsersTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function AdminPage() {
    const stats = await getAdminStats();
    const pendingApplications = await getApplications("PENDING");
    const adminUsers = await getAdminUsers();
    const coaches = await getAvailableCoaches();

    if (!stats) return <div className="p-8 text-white">Access Denied</div>;

    const items = [
        { title: "Total Revenue", value: `$${stats.revenue.toLocaleString()}`, icon: DollarSign, color: "text-green-500" },
        { title: "Active Users", value: stats.userCount, icon: Users, color: "text-blue-500" },
        { title: "Active Subscriptions", value: stats.activeSubs, icon: CheckCircle, color: "text-brand" },
        { title: "Pending Applications", value: stats.pendingApps, icon: Clock, color: "text-yellow-500" },
    ];

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-2 uppercase tracking-tight">Admin Dashboard</h1>
            <p className="text-white/60 mb-8">Manage your platform, users, and revenue.</p>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {items.map((item, index) => (
                    <div key={index} className="bg-black-light border border-white/10 p-6 rounded-xl">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-medium text-white/50 uppercase tracking-wider">{item.title}</h3>
                            <item.icon className={`h-5 w-5 ${item.color}`} />
                        </div>
                        <div className="text-3xl font-bold text-white">{item.value}</div>
                    </div>
                ))}
            </div>

            <Tabs defaultValue="applications" className="w-full">
                <TabsList className="bg-black-light border border-white/10 p-1 mb-8">
                    <TabsTrigger value="applications" className="data-[state=active]:bg-brand data-[state=active]:text-black-rich text-white/60">
                        Applications ({stats.pendingApps})
                    </TabsTrigger>
                    <TabsTrigger value="users" className="data-[state=active]:bg-brand data-[state=active]:text-black-rich text-white/60">
                        User Management
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="applications">
                    <ApplicationsTable applications={pendingApplications} />
                </TabsContent>

                <TabsContent value="users">
                    <UsersTable users={adminUsers} coaches={coaches} />
                </TabsContent>
            </Tabs>
        </div>
    );
}
