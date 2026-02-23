"use client"

import { useState, useTransition } from "react"
import { Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { deleteProject } from "@/actions/project.server"

interface DeleteProjectDialogProps {
    projectId: string
    projectName: string
}

export function DeleteProjectDialog({ projectId, projectName }: DeleteProjectDialogProps) {
    const [open, setOpen] = useState(false)
    const [isPending, startTransition] = useTransition()
    const router = useRouter()

    function handleDelete() {
        startTransition(async () => {
            const result = await deleteProject(projectId)
            if (!result.error) {
                setOpen(false)
                router.refresh()
            }
        })
    }

    return (
        <div onClick={(e) => e.stopPropagation()}>
            <AlertDialog open={open} onOpenChange={(val) => setOpen(val)}>
                <AlertDialogTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 z-10 bg-slate-50 cursor-pointer w-8 rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                        onClick={(e) => {
                            e.preventDefault()
                            setOpen(true)
                        }}
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="rounded-2xl">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-slate-900">
                            Supprimer ce projet ?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-slate-500">
                            Vous êtes sur le point de supprimer{" "}
                            <span className="font-semibold text-slate-700">"{projectName}"</span>.
                            Cette action est irréversible.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel
                            className="rounded-xl"
                            disabled={isPending}
                        >
                            Annuler
                        </AlertDialogCancel>
                        <Button
                            variant="destructive"
                            className="rounded-xl"
                            onClick={handleDelete}
                            disabled={isPending}
                        >
                            {isPending ? "Suppression..." : "Supprimer"}
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}