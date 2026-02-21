import { getAdminStats, getApplications, getAdminUsers, getAvailableCoaches, getClients, getPrograms, getAdminConsultations } from "@/app/actions/admin";
import { getAdminPayments, getSubscriptions, getPaymentPlans } from "@/app/actions/finance";
import { CheckCircle, Clock, DollarSign, Users } from "lucide-react";
import ApplicationsTable from "./ApplicationsTable";
import UsersTable from "./UsersTable";
import ClientsTable from "./ClientsTable";
import ProgramsTable from "./ProgramsTable";
import PaymentsTable from "./finances/PaymentsTable";
import SubscriptionsTable from "./finances/SubscriptionsTable";
import PaymentPlansTable from "./finances/PaymentPlansTable";
import ConsultationsTable from "./ConsultationsTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function AdminPage() {
    const stats = await getAdminStats();
    const pendingApplications = await getApplications("PENDING");
    const adminUsers = await getAdminUsers();
    const coaches = await getAvailableCoaches();
    const clients = await getClients();
    const programs = await getPrograms();
    const { payments, revenuePerCoach, revenuePerProgram } = await getAdminPayments();
    const subscriptions = await getSubscriptions();
    const plans = await getPaymentPlans(true);
    const consultations = await getAdminConsultations();

    if (!stats) return <div className="p-8 text-black-rich">Access Denied</div>;

    const items = [
        { title: "Total Revenue", value: `$${stats.revenue.toLocaleString()}`, icon: DollarSign, color: "text-green-600 bg-green-100" },
        { title: "Active Users", value: stats.userCount, icon: Users, color: "text-blue-600 bg-blue-100" },
        { title: "Active Subscriptions", value: stats.activeSubs, icon: CheckCircle, color: "text-brand bg-brand/10" },
        { title: "Pending Applications", value: stats.pendingApps, icon: Clock, color: "text-yellow-600 bg-yellow-100" },
    ];

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-black-rich mb-2 uppercase tracking-tight">Admin Dashboard</h1>
                <p className="text-slate-500">Manage your platform, users, and revenue.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {items.map((item, index) => (
                    <div key={index} className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">{item.title}</h3>
                            <div className={`p-2 rounded-lg ${item.color}`}>
                                <item.icon className="h-5 w-5" />
                            </div>
                        </div>
                        <div className="text-3xl font-bold text-black-rich">{item.value}</div>
                    </div>
                ))}
            </div>

            <Tabs defaultValue="applications" className="w-full">
                <TabsList className="bg-white border border-slate-200 p-1 mb-8 rounded-lg">
                    <TabsTrigger value="applications" className="data-[state=active]:bg-brand data-[state=active]:text-white text-slate-600 rounded-md px-6">
                        Applications ({stats.pendingApps})
                    </TabsTrigger>
                    <TabsTrigger value="users" className="data-[state=active]:bg-brand data-[state=active]:text-white text-slate-600 rounded-md px-6">
                        User Management
                    </TabsTrigger>
                    <TabsTrigger value="consultations" className="data-[state=active]:bg-brand data-[state=active]:text-white text-slate-600 rounded-md px-6">
                        Consultations {consultations.filter((c: any) => c.status === "PENDING").length > 0 && `(${consultations.filter((c: any) => c.status === "PENDING").length})`}
                    </TabsTrigger>
                    <TabsTrigger value="clients" className="data-[state=active]:bg-brand data-[state=active]:text-white text-slate-600 rounded-md px-6">
                        Client Management
                    </TabsTrigger>
                    <TabsTrigger value="programs" className="data-[state=active]:bg-brand data-[state=active]:text-white text-slate-600 rounded-md px-6">
                        Program Management
                    </TabsTrigger>
                    <TabsTrigger value="finances" className="data-[state=active]:bg-brand data-[state=active]:text-white text-slate-600 rounded-md px-6 font-bold">
                        Finances
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="applications">
                    <ApplicationsTable applications={pendingApplications} />
                </TabsContent>

                <TabsContent value="users">
                    <UsersTable users={adminUsers} coaches={coaches} />
                </TabsContent>

                <TabsContent value="consultations">
                    <ConsultationsTable consultations={consultations as any} />
                </TabsContent>

                <TabsContent value="clients">
                    <ClientsTable clients={clients} coaches={coaches} />
                </TabsContent>

                <TabsContent value="programs">
                    <ProgramsTable programs={programs} />
                </TabsContent>

                <TabsContent value="finances" className="space-y-8">
                    {/* Revenue Breakdowns */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
                            <h2 className="text-xl font-bold text-black-rich mb-4">Revenue by Coach</h2>
                            <div className="space-y-4">
                                {revenuePerCoach.map((coach: any, idx: number) => (
                                    <div key={idx} className="flex justify-between items-center pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                                        <div className="font-medium text-black-rich">{coach.name}</div>
                                        <div className="font-bold text-green-600">${coach.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                                    </div>
                                ))}
                                {revenuePerCoach.length === 0 && <div className="text-slate-500 text-sm">No coach revenue data.</div>}
                            </div>
                        </div>
                        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
                            <h2 className="text-xl font-bold text-black-rich mb-4">Revenue by Program</h2>
                            <div className="space-y-4">
                                {revenuePerProgram.map((prog: any, idx: number) => (
                                    <div key={idx} className="flex justify-between items-center pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                                        <div className="font-medium text-black-rich">{prog.name}</div>
                                        <div className="font-bold text-green-600">${prog.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                                    </div>
                                ))}
                                {revenuePerProgram.length === 0 && <div className="text-slate-500 text-sm">No program revenue data.</div>}
                            </div>
                        </div>
                    </div>

                    <div>
                        <PaymentPlansTable plans={plans as any} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-black-rich mb-4">Payment History</h2>
                        <PaymentsTable payments={payments} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-black-rich mb-4">Active Subscriptions</h2>
                        <SubscriptionsTable subscriptions={subscriptions} />
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
