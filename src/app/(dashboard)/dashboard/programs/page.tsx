import { getCoachPrograms } from "@/app/actions/coach";
import CoachProgramsTable from "./CoachProgramsTable";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function CoachProgramsPage() {
    const session = await auth();
    if (!session?.user?.id || (session.user as any).role !== "COACH") {
        redirect("/dashboard");
    }

    const programs = await getCoachPrograms();

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-black-rich mb-2 uppercase tracking-tight">My Programs</h1>
                <p className="text-slate-500">Create and manage your specialized coaching programs.</p>
            </div>
            <CoachProgramsTable programs={programs} />
        </div>
    );
}
