"use client";

import { createContext, useContext, ReactNode } from "react";

const ProjectContext = createContext<any | null>(null);

export function ProjectProvider({ project, children }: { project: any, children: ReactNode }) {
    return (
        <ProjectContext.Provider value={project}>
            {children}
        </ProjectContext.Provider>
    );
}

export function useProject() {
    const context = useContext(ProjectContext);
    if (!context) {
        throw new Error("useProject doit être utilisé dans un ProjectProvider");
    }
    return context;
}