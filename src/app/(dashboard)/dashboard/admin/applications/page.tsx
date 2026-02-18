import prisma from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Check, X, Eye } from "lucide-react";
import { approveCoach, rejectCoach } from "@/app/actions/admin-applications";
import { formatCurrency } from "@/lib/utils";

// Server Actions for Approve/Reject locally to avoid circular deps or extra files if small
// Ideally move to specific action file, but demonstrating inline for brevity/locality logic
// Actually, let's keep it clean and assume the actions exist or export them here?
// Next.js server actions can be in separate file. I'll create `admin-applications.ts` next.

export default async function AdminApplicationsPage() {
    const pendingCoaches = await prisma.user.findMany({
        where: {
            role: "COACH",
            approvalStatus: "PENDING"
        },
        include: {
            profile: true
        },
        orderBy: {
            createdAt: "desc"
        }
    });

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-black-rich mb-2 uppercase tracking-tight">Pending Applications</h1>
                <p className="text-slate-500">Review and approve new coach registrations.</p>
            </div>

            <div className="grid gap-6">
                {pendingCoaches.map((coach: any) => (
                    <div key={coach.id} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col md:flex-row gap-6">
                        <div className="flex-1 space-y-4">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="text-xl font-bold text-black-rich">{coach.name}</h3>
                                    <p className="text-slate-500 text-sm">{coach.email}</p>
                                    <p className="text-slate-500 text-sm">{coach.profile?.phoneNumber}</p>
                                </div>
                                <div className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-1 rounded uppercase">
                                    PENDING
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="font-semibold text-slate-700">Specializations</p>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                        {coach.profile?.specializations?.map((s: string) => (
                                            <span key={s} className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-xs">{s}</span>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <p className="font-semibold text-slate-700">Experience</p>
                                    <p className="text-slate-600">{coach.profile?.experienceYears} Years</p>
                                </div>
                                <div>
                                    <p className="font-semibold text-slate-700">Pricing</p>
                                    <p className="text-slate-600">{coach.profile?.pricingModel} - {formatCurrency(coach.profile?.priceAmount || 0)}</p>
                                </div>
                            </div>

                            <div className="bg-slate-50 p-3 rounded-lg text-sm text-slate-600 italic">
                                "{coach.profile?.bio?.slice(0, 150)}..."
                            </div>
                        </div>

                        <div className="flex flex-row md:flex-col gap-2 justify-center border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
                            <div className="flex gap-2 w-full">
                                <form action={async () => {
                                    "use server";
                                    await approveCoach(coach.id);
                                }}>
                                    <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                                        <Check className="mr-2 h-4 w-4" /> Approve
                                    </Button>
                                </form>
                                <form action={async () => {
                                    "use server";
                                    await rejectCoach(coach.id);
                                }}>
                                    <Button variant="destructive" className="w-full">
                                        <X className="mr-2 h-4 w-4" /> Reject
                                    </Button>
                                </form>
                            </div>
                            <Button variant="outline" className="w-full">
                                <Eye className="mr-2 h-4 w-4" /> View Details
                            </Button>
                        </div>
                    </div>
                ))}

                {pendingCoaches.length === 0 && (
                    <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
                        <p className="text-slate-500">No pending applications.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

