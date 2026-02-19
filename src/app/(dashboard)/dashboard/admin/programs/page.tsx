
import { getPrograms } from "@/app/actions/programs";
import ProgramsPageClient from "./ProgramsPageClient";

export default async function ProgramsPage({ params }: { params: { id: string } }) {
    const programs = await getPrograms();
    return <ProgramsPageClient programs={programs} />;
}
