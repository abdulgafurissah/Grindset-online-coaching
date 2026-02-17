import { Plus, Search, Calendar, Users, MoreVertical, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { getCoachPrograms } from "@/app/actions/coach";

export default async function ProgramsPage() {
    const programs = await getCoachPrograms();

    return (
        <div className="p-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white uppercase tracking-tight">
                        Program Library
                    </h1>
                    <p className="text-white/60 text-sm mt-1">Manage your workout templates and scale your coaching.</p>
                </div>
                <Link href="/dashboard/programs/new" className="bg-brand hover:bg-brand-600 text-black-rich font-bold py-3 px-6 rounded-none uppercase text-xs tracking-widest transition-all flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Create Program
                </Link>
            </div>

            <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {programs.map((program: any) => (
                    <div key={program.id} className="group relative bg-black-light border border-white/10 hover:border-brand/50 transition-all p-6 rounded-xl overflow-hidden">
                        <div className="flex justify-between items-start mb-4">
                            <div className="h-12 w-12 bg-white/5 rounded-lg flex items-center justify-center text-brand group-hover:bg-brand group-hover:text-black-rich transition-colors">
                                <Calendar className="h-6 w-6" />
                            </div>
                            <button className="text-white/30 hover:text-white transition-colors">
                                <MoreVertical className="h-5 w-5" />
                            </button>
                        </div>

                        <h3 className="text-xl font-bold text-white mb-1">{program.title}</h3>
                        <p className="text-sm text-brand font-medium uppercase tracking-wide mb-6">General Block</p>

                        <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-4 mb-6">
                            <div>
                                <p className="text-xs text-white/40 uppercase tracking-wider">Created</p>
                                <p className="text-white font-bold">{new Date(program.createdAt).toLocaleDateString()}</p>
                            </div>
                            <div>
                                <p className="text-xs text-white/40 uppercase tracking-wider">Active</p>
                                <div className="flex items-center gap-1.5">
                                    <Users className="h-3 w-3 text-brand" />
                                    <p className="text-white font-bold">{program._count.assignments || 0}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <button className="flex-1 bg-white/5 hover:bg-white/10 text-white py-2 rounded text-sm font-bold transition-colors flex items-center justify-center gap-2">
                                <Edit className="h-3 w-3" /> Edit
                            </button>
                            <button className="w-10 bg-white/5 hover:bg-red-500/20 text-white hover:text-red-500 py-2 rounded text-sm font-bold transition-colors flex items-center justify-center">
                                <Trash2 className="h-3 w-3" />
                            </button>
                        </div>
                    </div>
                ))}

                {/* New Program Blueprint Style Card */}
                <Link href="/dashboard/programs/new" className="border-2 border-dashed border-white/10 hover:border-brand/50 bg-transparent hover:bg-white/5 transition-all p-6 rounded-xl flex flex-col items-center justify-center text-center group h-full min-h-[250px]">
                    <div className="h-16 w-16 rounded-full bg-white/5 group-hover:bg-brand/10 flex items-center justify-center mb-4 transition-colors">
                        <Plus className="h-8 w-8 text-white/50 group-hover:text-brand" />
                    </div>
                    <h3 className="text-lg font-bold text-white group-hover:text-brand transition-colors">Create New Template</h3>
                    <p className="text-sm text-white/50 max-w-[200px] mt-2">Design a new training block from scratch or import from library.</p>
                </Link>
            </div>
        </div>
    );
}
