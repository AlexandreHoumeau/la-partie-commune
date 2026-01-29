'use client';

import { useState, useEffect, useMemo } from 'react';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Trash2 } from "lucide-react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    verticalListSortingStrategy,
    sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { deleteOpportunities } from '@/actions/opportunity.actions';
import { SortableItem } from './SortableItem';
import { mapContactViaLabel, mapOpportunityStatusLabel, OpportunityWithCompany } from '@/lib/validators/oppotunities';
import { CONTACT_COLORS, STATUS_COLORS } from '@/utils/general';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
// import { SortableItem } from "./SortableItem"; // small sortable wrapper

interface OpportunityTableProps {
    opportunities: OpportunityWithCompany[];
    onEdit: (opportunity: OpportunityWithCompany) => void;
}

export const OpportunityTable = ({ opportunities, onEdit }: OpportunityTableProps) => {
    const [search, setSearch] = useState("");
    const [selected, setSelected] = useState<string[]>([]);
    const [data, setData] = useState(opportunities);

    useEffect(() => setData(opportunities), [opportunities]);

    // const filteredData = useMemo(() => {
    //     return data.filter(
    //         (o) =>
    //             o.name.toLowerCase().includes(search.toLowerCase()) ||
    //             o.section.toLowerCase().includes(search.toLowerCase())
    //     );
    // }, [search, data]);

    // const handleDelete = async () => {
    //     await deleteOpportunities(selected);
    //     setData(data.filter((o) => !selected.includes(o.id)));
    //     setSelected([]);
    // };

    // const handleDragEnd = ({ active, over }: any) => {
    //     if (active.id !== over.id) {
    //         const oldIndex = data.findIndex((i) => i.id === active.id);
    //         const newIndex = data.findIndex((i) => i.id === over.id);
    //         setData(arrayMove(data, oldIndex, newIndex));
    //         // TODO: persist order if needed
    //     }
    // };

    return (
        <div className="overflow-hidden rounded-md border">

            <Table>
                <TableHeader className='bg-gray-50'>
                    <TableRow className='font-bold'>
                        <TableHead>Nom de l'entreprise</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Contact via</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Site internet</TableHead>
                        <TableHead>Secteur d'activité</TableHead>
                        <TableHead>Description</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data?.map((opportunity) => (
                        <TableRow key={opportunity.id}>
                            <TableCell className="font-medium">
                                {opportunity.company?.name}
                            </TableCell>
                            <TableCell><Badge className={STATUS_COLORS[opportunity.status]}>{mapOpportunityStatusLabel[opportunity.status]}</Badge></TableCell>
                            <TableCell><Badge className={CONTACT_COLORS[opportunity.contact_via!]}>{mapContactViaLabel[opportunity.contact_via!]}</Badge></TableCell>
                            <TableCell>{opportunity.company?.email}</TableCell>
                            <TableCell>{opportunity.company?.website}</TableCell>
                            <TableCell>{opportunity.company?.business_sector}</TableCell>
                            <TableCell>{opportunity.description}</TableCell>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                        <span className="sr-only">Open menu</span>
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuItem
                                    // onClick={() => navigator.clipboard.writeText(payment.id)}
                                    >
                                        Copy payment ID
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>View customer</DropdownMenuItem>
                                    <DropdownMenuItem>View payment details</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                        </TableRow>
                    ))}
                </TableBody>
                {/* <TableFooter>
                    <TableRow>
                        <TableCell colSpan={3}>Total</TableCell>
                        <TableCell className="text-right">$2,500.00</TableCell>
                    </TableRow>
                </TableFooter> */}
            </Table>

            {/* <div className="flex justify-between mb-4">
                <Input
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <div className="flex gap-2">
                    {selected.length > 0 && (
                        <Button variant="destructive" onClick={handleDelete} data-icon="inline-start">
                            <Trash2 /> Delete {selected.length}
                        </Button>
                    )}
                </div>
            </div> */}

            {/* <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={filteredData.map((o) => o.id)} strategy={verticalListSortingStrategy}>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Section</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredData.map((opportunity) => (
                                <SortableItem key={opportunity.id} id={opportunity.id}>
                                    <TableRow>
                                        <TableCell>{opportunity.name}</TableCell>
                                        <TableCell>{opportunity.section}</TableCell>
                                        <TableCell>
                                            <Badge className={statusColor(opportunity.status)}>
                                                {opportunity.status.replace("_", " ")}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Button size="sm" onClick={() => onEdit(opportunity)}>
                                                Edit
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                </SortableItem>
                            ))}
                        </TableBody>
                    </Table>
                </SortableContext>
            </DndContext> */}
        </div>
    );
};
