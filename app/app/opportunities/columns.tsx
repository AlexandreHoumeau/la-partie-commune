import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ContactVia, mapContactViaLabel, mapOpportunityStatusLabel, OpportunityStatus, OpportunityWithCompany } from "@/lib/validators/oppotunities";
import { CONTACT_COLORS, STATUS_COLORS } from "@/utils/general";
import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { Archive, Copy, Edit, Flag, MoreVertical, Star, Trash2 } from "lucide-react";

type ColumnsProps = {
    onStatusChange: (id: string, status: OpportunityStatus) => void;
};

export const getColumns = ({
    onStatusChange,
}: ColumnsProps): ColumnDef<OpportunityWithCompany>[] => [

        {
            header: "Nom",
            accessorKey: "company.name",
        },
        {
            accessorKey: "company.email",
            header: "Email",
        },
        {
            accessorKey: "company.phone",
            header: "Phone",
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => {
                const status = row.getValue<OpportunityStatus>("status");
                const id = row.original.id;

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Badge className={STATUS_COLORS[status]}>
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
                                    <Badge className={STATUS_COLORS[key as OpportunityStatus]}>
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
            header: "Created At",
            cell: ({ row }) => {
                const date = new Date(row.getValue("created_at"));
                const formattedDate = dayjs(date).format("DD MMM YYYY");
                return <div className="font-medium">{formattedDate}</div>
            },

        },
        {
            accessorKey: "description",
            header: "Description",
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const payment = row.original

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button className="h-8 w-8" size="icon" variant="ghost">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuItem>
                                <Edit />
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Copy />
                                Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                <Star />
                                Favorite
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Flag />
                                Report
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                <Archive />
                                Archive
                            </DropdownMenuItem>
                            <DropdownMenuItem variant="destructive">
                                <Trash2 />
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            },
        },
    ]
