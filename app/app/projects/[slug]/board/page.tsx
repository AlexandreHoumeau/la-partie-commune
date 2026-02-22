import { getProjectBySlug } from "@/actions/project.server";
import { getProjectTasks } from "@/actions/task.server";
import { KanbanBoard } from "@/components/projects/KanbanBoard";
import { notFound } from "next/navigation";


export default async function ProjectBoardPage({ params }: { params: { slug: string } }) {
    const { slug } = await params;
    const projectResult = await getProjectBySlug(slug);

    if (!projectResult.success || !projectResult.data) notFound();

    const project = projectResult.data;

    const tasksResult = await getProjectTasks(project.id);
    const initialTasks = tasksResult.success ? tasksResult.data : [];

    return (
        <div className="h-full flex flex-col">
            <div className="flex-1 overflow-hidden">
                <KanbanBoard projectId={project.id} initialTasks={initialTasks || []} />
            </div>
        </div>
    );
}