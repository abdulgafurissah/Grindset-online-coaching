import { Navbar } from "@/components/Navbar";
import { getCoaches } from "@/app/actions/coach-public";
import Link from "next/link";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function AdminCoachesPage() {
    const coaches = await getCoaches();

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-black-rich mb-2 uppercase tracking-tight">Coach Management</h1>
                    <p className="text-slate-500">Add, edit, and manage your coaching team.</p>
                </div>
                <Link href="/dashboard/admin/coaches/new">
                    <Button className="bg-brand text-black-rich font-bold hover:bg-brand/90">
                        <Plus className="mr-2 h-4 w-4" /> Add Coach
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {coaches.map((coach: any) => (
                    <div key={coach.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-xl font-bold text-black-rich">{coach.name}</h3>
                                    <p className="text-sm text-slate-500">{coach.profile?.specialty || "General Coach"}</p>
                                </div>
                                <div className="bg-brand/10 text-brand text-xs font-bold px-2 py-1 rounded uppercase">
                                    {((coach.profile?.commissionRate || 0.8) * 100).toFixed(0)}% Split
                                </div>
                            </div>

                            <div className="space-y-2 mb-6">
                                <div className="text-sm text-slate-600">
                                    <span className="font-semibold">Clients:</span> 0 {/* Placeholder for client count */}
                                </div>
                                <div className="text-sm text-slate-600">
                                    <span className="font-semibold">Rating:</span> {coach.profile?.rating?.toFixed(1)}/5.0
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <Link href={`/dashboard/admin/coaches/${coach.id}/edit`} className="flex-1">
                                    <Button variant="outline" className="w-full border-slate-200 hover:bg-slate-50 text-slate-700">
                                        <Edit className="mr-2 h-4 w-4" /> Edit
                                    </Button>
                                </Link>
                                <Button variant="ghost" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}

                {coaches.length === 0 && (
                    <div className="col-span-full text-center py-12 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
                        <p className="text-slate-500 mb-4 font-medium">No coaches found.</p>
                        <Link href="/dashboard/admin/coaches/new">
                            <Button variant="outline" className="border-slate-300 text-black-rich bg-white hover:bg-slate-100 hover:text-black">
                                Create your first coach
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
