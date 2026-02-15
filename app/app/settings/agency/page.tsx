"use client"

import {
    Avatar
} from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useSettings } from "../settings-context"
import { updateAgencyInformation } from "@/actions/agency.server"

export default function AgencyPage() {
    const { agency, team } = useSettings()

    return (
        <div className=" space-y-10">
            {/* ---------------- TEAM ---------------- */}
            <Card>
                <CardHeader>
                    <CardTitle>Équipe</CardTitle>
                    <CardDescription>
                        Invitez et gérez les membres de votre agence
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-8">
                    {/* Invite */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Input type="email" placeholder="email@agence.fr" />

                        <Select>
                            <SelectTrigger>
                                <SelectValue placeholder="Rôle" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="admin">Admin</SelectItem>
                                <SelectItem value="agent">Agent</SelectItem>
                                <SelectItem value="collaborateur">
                                    Collaborateur
                                </SelectItem>
                                <SelectItem value="lecteur">
                                    Lecteur
                                </SelectItem>
                            </SelectContent>
                        </Select>

                        <Button className="md:col-span-1">
                            Envoyer l'invitation
                        </Button>
                    </div>

                    <Separator />

                    {/* Members Table */}
                    <div>
                        <h4 className="text-sm font-medium mb-4">
                            Membres actifs
                        </h4>

                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Membre</TableHead>
                                    <TableHead>Rôle</TableHead>
                                    <TableHead className="text-right">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {team.map((member, index) => (
                                    <TableRow key={index}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar>
                                                    {/* <AvatarFallback>
                                                        {member.name
                                                            .split(" ")
                                                            .map(
                                                                (n) => n[0]
                                                            )
                                                            .join("")}
                                                    </AvatarFallback> */}
                                                </Avatar>
                                                <div>
                                                    <p className="font-medium">
                                                        {member.name}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {member.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </TableCell>

                                        <TableCell>
                                            <Badge variant="secondary">
                                                {member.role}
                                            </Badge>
                                        </TableCell>

                                        <TableCell className="text-right">
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                            >
                                                Supprimer
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {/* ---------------- AGENCY INFO ---------------- */}
            <Card>
                <CardHeader>
                    <CardTitle>Informations de l'agence</CardTitle>
                    <CardDescription>
                        Gérez les informations publiques de votre agence
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">
                                Nom de l'agence
                            </label>
                            <Input defaultValue={agency?.name} />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">
                                Site web
                            </label>
                            <Input type="url" defaultValue={agency?.website} />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">
                                Téléphone
                            </label>
                            <Input type="tel" defaultValue={agency?.phone} />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">
                                Email
                            </label>
                            <Input type="email" defaultValue={agency?.email} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            Adresse
                        </label>
                        <Input defaultValue={agency?.address} />
                    </div>

                    <div className="pt-4">
                        <Button>Enregistrer les modifications</Button>
                    </div>
                </CardContent>
            </Card>

            {/* ---------------- BRANDING ---------------- */}
            {/* <Card>
                <CardHeader>
                    <CardTitle>Identité visuelle</CardTitle>
                    <CardDescription>
                        Personnalisez l'apparence de votre agence
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-8">
                    <div className="space-y-3">
                        <label className="text-sm font-medium">Logo</label>

                        <div className="border border-dashed rounded-xl p-8 text-center cursor-pointer hover:bg-muted transition">
                            <p className="text-sm text-muted-foreground">
                                Cliquez ou déposez un fichier
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                                PNG, JPG, SVG — max 2MB
                            </p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-sm font-medium">
                            Couleur principale
                        </label>

                        <div className="flex items-center gap-4">
                            <Input
                                type="color"
                                defaultValue={agency?.primaryColor}
                                className="w-20 h-10 p-1"
                            />
                            <Input
                                readOnly
                                value={agency?.primaryColor}
                            />
                        </div>
                    </div>

                    <div className="pt-4">
                        <Button>Enregistrer les modifications</Button>
                    </div>
                </CardContent>
            </Card> */}
        </div>
    )
}
