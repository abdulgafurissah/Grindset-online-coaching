import { Program } from "@prisma/client";
import CreateProgramForm from "./CreateProgramForm";

interface ProgramsTableProps {
    programs: Program[];
}

export default function ProgramsTable({ programs }: ProgramsTableProps) {
    return (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-black-rich">Programs</h2>
                    <p className="text-slate-500">Manage your programs.</p>
                </div>
                <CreateProgramForm />
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-500 font-medium text-xs uppercase">
                        <tr>
                            <th className="px-6 py-3">Title</th>
                            <th className="px-6 py-3">Description</th>
                            <th className="px-6 py-3">Link</th>
                            <th className="px-6 py-3"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {programs.map((program) => (
                            <tr key={program.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4 text-black-rich font-medium">{program.title}</td>
                                <td className="px-6 py-4 text-slate-600">{program.description}</td>
                                <td className="px-6 py-4 text-slate-600">{program.link}</td>
                                <td className="px-6 py-4 text-right">
                                    {/* Actions placeholder */}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
