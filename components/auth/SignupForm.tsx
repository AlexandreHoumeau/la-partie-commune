"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, AlertCircle, Loader2, Sparkles, CheckCircle2 } from "lucide-react";
import { z } from "zod";
import Link from "next/link";

import {
	Form,
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle
} from "@/components/ui/card";

import { signupSchema } from "@/lib/validators/auth";
import { signup } from "@/actions/auth.actions";
import { useSearchParams } from "next/navigation";

type SignupValues = z.infer<typeof signupSchema>;

export function SignupForm() {
	const searchParams = useSearchParams();
	const next = searchParams.get("next");
	const isInvited = !!next;

	const [showPassword, setShowPassword] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);
	const [isPending, startTransition] = useTransition();

	const form = useForm<SignupValues>({
		resolver: zodResolver(signupSchema),
		defaultValues: {
			isInvited: isInvited,
			agencyName: "",
			firstName: "",
			lastName: "",
			email: "",
			password: "",
			confirmPassword: "",
		},
	});

	function onSubmit(values: SignupValues) {
		setError(null);
		startTransition(async () => {
			const result = await signup({ ...values, redirectTo: next || undefined });
			if (result?.error) {
				setError(result.error);
				return;
			}
			setSuccess(true);
		});
	}
	if (success) {
		return (
			<Card className="w-full max-w-md border-slate-200 shadow-xl animate-in fade-in zoom-in duration-300">
				<CardContent className="pt-10 pb-10 text-center space-y-4">
					<div className="flex justify-center">
						<div className="p-3 rounded-full bg-green-50">
							<CheckCircle2 className="w-12 h-12 text-green-500" />
						</div>
					</div>
					<CardTitle className="text-2xl font-bold">Vérifiez vos emails</CardTitle>
					<p className="text-slate-600">
						Nous avons envoyé un lien magique à <strong>{form.getValues("email")}</strong> pour activer votre accès.
					</p>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className="w-full max-w-md border-slate-200 shadow-xl">
			<CardHeader className="space-y-1 text-center">
				<div className="flex justify-center mb-2">
					<div className="p-3 rounded-full bg-primary/10">
						<Sparkles className="w-6 h-6 text-primary" />
					</div>
				</div>
				<CardTitle className="text-2xl font-bold tracking-tight">
					{isInvited ? "Rejoindre l'équipe" : "Commencer l'aventure"}
				</CardTitle>
				<CardDescription>
					{isInvited ? "Créez votre profil pour accepter l'invitation" : "Créez votre espace de travail en 2 minutes"}
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-4"
					>
						{error && (
							<Alert variant="destructive" className="py-2 px-3 text-sm">
								<AlertCircle className="h-4 w-4" />
								<AlertDescription>{error}</AlertDescription>
							</Alert>
						)}
						<input type="hidden" {...form.register("isInvited")} />
						{!isInvited && (
							<FormField
								control={form.control}
								name="agencyName"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Nom de l'agence</FormLabel>
										<FormControl>
											<Input placeholder="Acme Inc." className="h-10" disabled={isPending} {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						)}

						<div className="grid grid-cols-2 gap-3">
							<FormField
								control={form.control}
								name="firstName"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Prénom</FormLabel>
										<FormControl><Input placeholder="Jean" className="h-10" disabled={isPending} {...field} /></FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="lastName"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Nom</FormLabel>
										<FormControl><Input placeholder="Dupont" className="h-10" disabled={isPending} {...field} /></FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl><Input type="email" placeholder="jean@agence.com" className="h-10" disabled={isPending} {...field} /></FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div className="grid grid-cols-2 gap-3">
							<FormField
								control={form.control}
								name="password"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Mot de passe</FormLabel>
										<FormControl>
											<div className="relative">
												<Input
													type={showPassword ? "text" : "password"}
													className="h-10 pr-9"
													disabled={isPending}
													{...field}
												/>
												<button
													type="button"
													onClick={() => setShowPassword(!showPassword)}
													className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400"
												>
													{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
												</button>
											</div>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="confirmPassword"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Confirmation</FormLabel>
										<FormControl>
											<Input
												type={showPassword ? "text" : "password"}
												className="h-10"
												disabled={isPending}
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<Button type="submit" className="w-full h-11 text-base font-semibold mt-2" disabled={isPending}>
							{isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
							{isPending ? "Création..." : "Créer le compte"}
						</Button>
					</form>
				</Form>
			</CardContent>
			<CardFooter>
				<div className="text-sm text-center text-slate-500 w-full">
					Déjà inscrit ?{" "}
					<Link
						href={`/auth/login${next ? `?next=${encodeURIComponent(next)}` : ""}`}
						className="text-primary font-semibold hover:underline"
					>
						Se connecter
					</Link>
				</div>
			</CardFooter>
		</Card>
	);
}