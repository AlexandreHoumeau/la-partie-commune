'use client'

import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useSettings } from '../settings-context'
import { useActionState, useEffect } from 'react'
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import { updateProfile } from '@/actions/profile.server'
import { mapRoleToPosition } from '@/lib/validators/profile'

export default function ProfilePage() {
    const { profile } = useSettings()
    const [state, formAction, isPending] = useActionState(updateProfile, null)

    // Auto-dismiss success message after 3 seconds
    useEffect(() => {
        if (state?.success) {
            const timer = setTimeout(() => {
                // You could add a way to clear the message here if needed
            }, 3000)
            return () => clearTimeout(timer)
        }
    }, [state?.success])

    return (
        <div className="space-y-6">
            {/* Success/Error Messages */}
            {state?.message && (
                <Alert variant={state.success ? "default" : "destructive"}>
                    {state.success ? (
                        <CheckCircle2 className="h-4 w-4" />
                    ) : (
                        <AlertCircle className="h-4 w-4" />
                    )}
                    <AlertDescription>{state.message}</AlertDescription>
                </Alert>
            )}

            {/* Personal Information Form */}
            <form action={formAction}>
                <Card>
                    <CardHeader>
                        <CardTitle>Informations personnelles</CardTitle>
                        <CardDescription>
                            Vos coordonnées professionnelles et informations de contact
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="first_name">
                                    Prénom <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="first_name"
                                    name="first_name"
                                    defaultValue={profile.first_name}
                                    placeholder="Entrez votre prénom"
                                    disabled={isPending}
                                    aria-invalid={!!state?.errors?.first_name}
                                />
                                {state?.errors?.first_name && (
                                    <p className="text-sm text-destructive">
                                        {state.errors.first_name[0]}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="last_name">
                                    Nom <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="last_name"
                                    name="last_name"
                                    defaultValue={profile.last_name}
                                    placeholder="Entrez votre nom"
                                    disabled={isPending}
                                    aria-invalid={!!state?.errors?.last_name}
                                />
                                {state?.errors?.last_name && (
                                    <p className="text-sm text-destructive">
                                        {state.errors.last_name[0]}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="phone">Téléphone</Label>
                                <Input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    defaultValue={profile.phone}
                                    placeholder="+33 6 12 34 56 78"
                                    disabled={isPending}
                                    aria-invalid={!!state?.errors?.phone}
                                />
                                {state?.errors?.phone && (
                                    <p className="text-sm text-destructive">
                                        {state.errors.phone[0]}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="position">Role</Label>
                                <Input
                                    id="position"
                                    name="position"
                                    placeholder="Votre fonction"
                                    disabled
                                    defaultValue={mapRoleToPosition(profile.role)}
                                    className="opacity-50"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Bientôt disponible
                                </p>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="border-t px-6 py-4 flex justify-between items-center">
                        <p className="text-sm text-muted-foreground">
                            <span className="text-destructive">*</span> Champs obligatoires
                        </p>
                        <Button type="submit" disabled={isPending}>
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isPending ? 'Enregistrement...' : 'Enregistrer les modifications'}
                        </Button>
                    </CardFooter>
                </Card>
            </form>

            {/* Email Card (Read-only) */}
            <Card>
                <CardHeader>
                    <CardTitle>Adresse email</CardTitle>
                    <CardDescription>
                        Votre adresse email ne peut pas être modifiée pour le moment
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" value={profile.email} disabled />
                    </div>
                </CardContent>
            </Card>

            {/* Password Card */}
            <Card className="border-destructive/50">
                <CardHeader>
                    <CardTitle>Mot de passe</CardTitle>
                    <CardDescription>
                        Modifiez votre mot de passe pour sécuriser votre compte
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="current_password">Mot de passe actuel</Label>
                        <Input id="current_password" type="password" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="new_password">Nouveau mot de passe</Label>
                            <Input id="new_password" type="password" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirm_password">Confirmer le mot de passe</Label>
                            <Input id="confirm_password" type="password" />
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="border-t px-6 py-4 bg-destructive/5">
                    <Button variant="destructive" disabled>
                        Changer le mot de passe
                    </Button>
                    <p className="text-xs text-muted-foreground ml-4">
                        Bientôt disponible
                    </p>
                </CardFooter>
            </Card>
        </div>
    )
}