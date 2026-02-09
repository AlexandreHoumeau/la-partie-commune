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
            header: "Nom",
            accessorKey: "company.name",
            cell: ({ row }) => {
                const opportunity = row.original
                return opportunity.company?.website ? <Link href={`opportunities/${opportunity.slug}`} className="font-medium text-wrap underline cursor-pointer">{opportunity.company.name}</Link> : <div className="font-medium text-wrap">{opportunity.company?.name}</div>

            }
        },
        {
            accessorKey: "company.email",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        className="cursor-pointer"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Email
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: ({ row }) => {
                const email = row.original.company?.email
                return email ? <span className="font-semibold cursor-pointer flex gap-2 items-center" onClick={async () => {
                    await navigator.clipboard.writeText(email);
                    toast.success("Copié dans le presse-papiers", { position: "top-right" });
                }}>{email}<Copy size={14} /></span> : null;
            }
        },
        {
            accessorKey: "company.phone_number",
            header: "Phone",
        },
        {
            accessorKey: "status",
            filterFn: (row, columnId, filterValue: OpportunityStatus[]) => {
                if (!Array.isArray(filterValue)) return true;
                return filterValue.includes(row.getValue(columnId));
            },
            header: "Status",
            cell: ({ row }) => {
                const status = row.getValue<OpportunityStatus>("status");
                const id = row.original.id;

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Badge className={`${STATUS_COLORS[status]} cursor-pointer`}>
                                {mapOpportunityStatusLabel[status]}
                            </Badge>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">
                            {Object.entries(mapOpportunityStatusLabel).map(([key, label]) => (
                                <DropdownMenuItem
                                    key={key}
                                    onClick={() =>
                                        onStatusChange(id, key as OpportunityStatus)
                                    }
                                >
                                    <Badge className={`${STATUS_COLORS[key as OpportunityStatus]} cursor-pointer`}>
                                        {label}
                                    </Badge>
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        }
        ,
        {
            accessorKey: "contact_via",
            header: "Contact Via",
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
                                const formattedString = `Nom: ${opportunity.company?.name}; Webiste: ${opportunity.company?.website}; Email: ${opportunity.company?.email}; PhoneNumber: ${opportunity.company?.phone_number}; Description: ${opportunity.description}; Secteur d'activité: ${opportunity.company?.business_sector}`

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
