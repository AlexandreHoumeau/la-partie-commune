import { getProjectBySlug } from "@/actions/project.server";
import { getProjectTasks } from "@/actions/task.server";
import { KanbanBoard } from "@/components/projects/KanbanBoard";
import { notFound } from "next/navigation";


export default async function ProjectBoardPage({ params }: { params: { slug: string } }) {
    const { slug } = await params;
    const projectResult = await getProjectBySlug(slug);
    
    if (!projectResult.success || !projectResult.data) notFound();

    const project = projectResult.data;

    // 2. Récupérer les tâches
    const tasksResult = await getProjectTasks(project.id);
    const initialTasks = tasksResult.success ? tasksResult.data : [];

    return (
        <div className="h-full flex flex-col">
            {/* L'en-tête de la page Board avec bouton de création */}
            <div className="px-8 py-4 border-b border-slate-200 bg-white/50 flex items-center justify-between shrink-0">
                <p className="text-sm font-semibold text-slate-500">
                    Tableau de bord : <span className="text-slate-900">{project.name}</span>
                </p>
                <button className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-all active:scale-95">
                    + Nouveau Ticket
                </button>
            </div>

            {/* Le composant client interactif */}
            <div className="flex-1 overflow-hidden">
                <KanbanBoard projectId={project.id} initialTasks={initialTasks || []} />
            </div>
        </div>
    );
}