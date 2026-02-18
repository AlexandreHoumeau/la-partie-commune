import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ContactVia, mapContactViaLabel, mapOpportunityStatusLabel, OpportunityStatus, OpportunityWithCompany } from "@/lib/validators/oppotunities";
import { CONTACT_COLORS, STATUS_COLORS } from "@/utils/general";
import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { Edit, MoreVertical, Star, Trash2 } from "lucide-react";
import { Copy } from 'lucide-react';
import { toast } from "sonner";
import { ArrowUpDown } from "lucide-react"
import Link from "next/link";
import { cn } from "@/lib/utils";

type ColumnsProps = {
    onStatusChange: (id: string, status: OpportunityStatus) => void;
    onDeleteOpportunities: (ids: string[]) => void;
    editOpportunity: (opportunity: OpportunityWithCompany) => void;
    onFavoriteChange: (id: string, isFavorite: boolean) => void;
};

export const getColumns = ({
    onStatusChange,
    onDeleteOpportunities,
    editOpportunity,
    onFavoriteChange
}: ColumnsProps): ColumnDef<OpportunityWithCompany>[] => [
        {
            header: "Entreprise",
            accessorKey: "company.name",
            cell: ({ row }) => {
                const opportunity = row.original
                return (
                    <div className="flex flex-col">
                        <Link href={`opportunities/${opportunity.slug}`} className="font-bold text-slate-900 hover:text-blue-600 transition-colors">
                            {opportunity.company?.name}
                        </Link>
                        <span className="text-[10px] text-slate-400 uppercase font-medium tracking-tight">
                            {opportunity.company?.business_sector || "Secteur inconnu"}
                        </span>
                    </div>
                )
            }
        },
        {
            accessorKey: "company.email",
            header: "Contact",
            cell: ({ row }) => {
                const email = row.original.company?.email
                if (!email) return <span className="text-slate-300 italic text-xs">Pas d'email</span>;
                return (
                    <div
                        className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer hover:text-blue-600 transition-colors group"
                        onClick={() => {
                            navigator.clipboard.writeText(email);
                            toast.success("Email copié");
                        }}
                    >
                        <span className="max-w-[150px] truncate">{email}</span>
                        <Copy className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                )
            }
        },
        {
            accessorKey: "status",
            header: "Statut",
            cell: ({ row }) => {
                const status = row.getValue<OpportunityStatus>("status");
                const id = row.original.id;

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Badge className={cn("cursor-pointer px-2.5 py-1 rounded-md border-none font-bold text-[10px] uppercase tracking-tighter", STATUS_COLORS[status])}>
                                {mapOpportunityStatusLabel[status]}
                            </Badge>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-48 rounded-xl shadow-xl border-slate-100">
                            {Object.entries(mapOpportunityStatusLabel).map(([key, label]) => (
                                <DropdownMenuItem key={key} onClick={() => onStatusChange(id, key as OpportunityStatus)} className="focus:bg-slate-50">
                                    <Badge className={cn("text-[10px] border-none uppercase", STATUS_COLORS[key as OpportunityStatus])}>
                                        {label}
                                    </Badge>
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
        {
            accessorKey: "contact_via",
            header: "Contact Via",
            filterFn: (row, columnId, value: ContactVia[]) => {
                if (!value || value.length === 0) return true;
                return value.includes(row.getValue(columnId));
            },
            cell: ({ row }) => {
                const contact_via: ContactVia = row.getValue("contact_via");
                const label = mapContactViaLabel[contact_via];
                const color = CONTACT_COLORS[contact_via] || "gray";

                return (
                    <Badge
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${color}`}
                    >
                        {label}
                    </Badge>
                );

            }
        },
        {
            accessorKey: "created_at",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        className="cursor-pointer"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Crée le
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },

            cell: ({ row }) => {
                const date = new Date(row.getValue("created_at"));
                const formattedDate = dayjs(date).format("DD MMM YYYY");
                return <div className="font-medium">{formattedDate}</div>
            },

        },
        {
            accessorKey: "description",
            header: "Description",
            cell: ({ row }) => {
                const descirption: string = row.getValue("description");
                return <div className="font-medium text-wrap">{descirption}</div>

            }
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const opportunity = row.original

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button className="h-8 w-8" size="icon" variant="ghost">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuItem onClick={() => editOpportunity(opportunity)}>
                                <Edit />
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={async () => {
                                const formattedString = `Nom: ${opportunity.company?.name}; Webiste: ${opportunity.company?.website}; Email: ${opportunity.company?.email}; PhoneNumber: ${opportunity.company?.phone_number}; Description: ${opportunity.description}; Secteur d'activité: ${opportunity.company?.business_sector}; A contacter via: ${opportunity.contact_via}; Statut: ${opportunity.status}`;
                                await navigator.clipboard.writeText(JSON.stringify(formattedString));
                                toast.success("Copié dans l'opportunité presse-papiers", { position: "top-right" });

                            }}>
                                <Copy />
                                Copy
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onFavoriteChange(opportunity.id, !opportunity.is_favorite)}>
                                <Star />
                                {opportunity.is_favorite ? "Unfavorite" : "Favorite"}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem variant="destructive" onClick={() => onDeleteOpportunities([opportunity.id])}>
                                <Trash2 />
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            },
        }
    ]
