"use client";

import { useState } from "react";
import { createChecklistItem, deleteChecklistItem, getProjectChecklists } from "@/actions/project.server";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PortalUploadAccessButton } from "@/components/files/PortalUploadAccessButton";
import { getChecklistDisplayDescription, getChecklistSuggestedSections } from "@/lib/portal-checklist";
import { buildPortalResponsePreview, parsePortalClientResponse } from "@/lib/portal-content";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, Plus, Type, FileImage, File, Trash2, CheckCircle2, Clock } from "lucide-react";

type ChecklistItem = {
  id: string;
  title: string;
  description: string | null;
  expected_type: string;
  status: "pending" | "uploaded";
  client_response: string | null;
  file_url: string | null;
};

export function ProjectChecklistClient({
  projectId,
  initialItems,
}: {
  projectId: string;
  initialItems: ChecklistItem[];
}) {
  const [items, setItems] = useState<ChecklistItem[]>(initialItems);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [suggestedSections, setSuggestedSections] = useState("");
  const [expectedType, setExpectedType] = useState("text");

  const loadChecklists = async () => {
    setIsLoading(true);
    const res = await getProjectChecklists(projectId);
    if (res.success && res.data) setItems(res.data as ChecklistItem[]);
    setIsLoading(false);
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    const res = await createChecklistItem(projectId, {
      title,
      description,
      expected_type: expectedType,
      suggested_sections: expectedType === "text"
        ? suggestedSections.split("\n").map((item) => item.trim()).filter(Boolean)
        : [],
    });
    setIsSubmitting(false);

    if (res.success) {
      toast.success("Demande ajoutée !");
      setTitle("");
      setDescription("");
      setSuggestedSections("");
      await loadChecklists();
    } else {
      toast.error("Erreur lors de l'ajout.");
    }
  };

  const handleDelete = async (id: string) => {
    const res = await deleteChecklistItem(id);
    if (res.success) {
      toast.success("Demande supprimée.");
      setItems((currentItems) => currentItems.filter((item) => item.id !== id));
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "text": return <Type className="w-4 h-4 text-blue-500" />;
      case "image": return <FileImage className="w-4 h-4 text-emerald-500" />;
      default: return <File className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="max-w-[1000px] mx-auto p-6 md:p-8 space-y-8 animate-in fade-in duration-500 pb-20">
      <div>
        <h2 className="card-title">Chasseur de contenus</h2>
        <p className="text-sm text-muted-foreground">Listez ici les éléments que votre client doit vous fournir. Une demande de type texte peut maintenant contenir plusieurs sections et commentaires dans une seule réponse.</p>
      </div>

      <form onSubmit={handleAddItem} className="bg-card p-6 rounded-2xl border border-border shadow-sm flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1 w-full space-y-2">
          <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Ce qu'il vous faut</Label>
          <Input
            placeholder="Ex: Logo en haute définition..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="h-10 bg-muted/50 shadow-none"
            required
          />
        </div>

        <div className="flex-1 w-full space-y-2">
          <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Contexte</Label>
          <Input
            placeholder="Ex: Contenu de la page d'accueil"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="h-10 bg-muted/50 shadow-none"
          />
        </div>

        <div className="w-full md:w-48 space-y-2">
          <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Format attendu</Label>
          <Select value={expectedType} onValueChange={setExpectedType}>
            <SelectTrigger className="h-10 bg-muted/50 shadow-none">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="text">Texte long</SelectItem>
              <SelectItem value="image">Image / Logo</SelectItem>
              <SelectItem value="file">Fichier (PDF, zip)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button type="submit" disabled={isSubmitting} className="h-10 px-6 bg-foreground hover:bg-foreground/90 text-background w-full md:w-auto">
          {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
          Ajouter
        </Button>
      </form>

      {expectedType === "text" && (
        <div className="bg-card p-5 rounded-2xl border border-border shadow-sm space-y-2">
          <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Sections suggérées</Label>
          <textarea
            value={suggestedSections}
            onChange={(e) => setSuggestedSections(e.target.value)}
            rows={4}
            placeholder={"Hero\nÀ propos\nServices\nFAQ"}
            className="w-full rounded-xl bg-muted/50 border border-border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none"
          />
          <p className="text-xs text-muted-foreground">Une ligne par section. Le client pourra partir de cette structure puis l’adapter.</p>
        </div>
      )}

      <div className="space-y-3">
        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground text-sm">Chargement des demandes...</div>
        ) : items.length === 0 ? (
          <div className="p-12 text-center border border-dashed border-border rounded-2xl text-muted-foreground bg-muted/50">
            Aucune demande pour le moment. Ajoutez le premier élément ci-dessus !
          </div>
        ) : (
          items.map((item) => {
            const structuredResponse = parsePortalClientResponse(item.client_response);
            const responsePreview = buildPortalResponsePreview(item.client_response);
            const displayDescription = getChecklistDisplayDescription(item.description);
            const suggested = getChecklistSuggestedSections(item.description);

            return (
            <div key={item.id} className="group bg-card p-5 rounded-2xl border border-border shadow-sm transition-all hover:border-blue-200 dark:hover:border-blue-800/60 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center border border-border shrink-0">
                    {getTypeIcon(item.expected_type)}
                  </div>
                  <div>
                    <h4 className="card-title">{item.title}</h4>
                    {displayDescription && (
                      <p className="mt-1 text-sm text-muted-foreground">{displayDescription}</p>
                    )}
                    <div className="flex items-center gap-2 mt-1">
                      {item.status === "pending" ? (
                        <span className="inline-flex items-center text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-md">
                          <Clock className="w-3 h-3 mr-1" /> En attente
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md">
                          <CheckCircle2 className="w-3 h-3 mr-1" /> Fourni
                        </span>
                      )}
                      <span className="text-xs text-muted-foreground capitalize">• {item.expected_type}</span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(item.id)}
                  className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              {suggested.length > 0 && (
                <div className="ml-14 flex flex-wrap gap-2">
                  {suggested.map((section) => (
                    <span key={section} className="inline-flex rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 px-2.5 py-1 text-[11px] font-medium">
                      {section}
                    </span>
                  ))}
                </div>
              )}

              {item.status === "uploaded" && (
                <div className="mt-2 p-4 bg-muted rounded-xl border border-border ml-14">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">Réponse du client :</p>

                  {item.file_url ? (
                    <PortalUploadAccessButton
                      itemId={item.id}
                      className="inline-flex gap-2 px-4 py-2 bg-card border border-border rounded-lg text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-sm transition-all"
                    >
                      Télécharger / Voir le fichier ({item.client_response})
                    </PortalUploadAccessButton>
                  ) : structuredResponse ? (
                    <div className="space-y-3">
                      <p className="text-sm font-medium text-foreground">{responsePreview}</p>
                      <div className="space-y-2">
                        {structuredResponse.sections.map((section) => (
                          <div key={section.id} className="rounded-lg border border-border bg-card px-3 py-2">
                            <p className="text-sm font-semibold text-foreground">{section.title}</p>
                            <p className="mt-1 text-sm text-muted-foreground whitespace-pre-wrap">{section.content}</p>
                            {section.comment?.trim() && (
                              <p className="mt-2 text-xs text-muted-foreground whitespace-pre-wrap">Note : {section.comment}</p>
                            )}
                          </div>
                        ))}
                      </div>
                      {structuredResponse.generalComment?.trim() && (
                        <p className="text-xs text-muted-foreground whitespace-pre-wrap">Commentaire général : {structuredResponse.generalComment}</p>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-foreground whitespace-pre-wrap">{item.client_response}</p>
                  )}
                </div>
              )}
            </div>
            );
          })
        )}
      </div>
    </div>
  );
}
