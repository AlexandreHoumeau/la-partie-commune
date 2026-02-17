"use client";

import { Eye, EyeOff, AlertCircle, Loader2, LockKeyhole } from "lucide-react";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle
} from "@/components/ui/card";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { loginSchema } from "@/lib/validators/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function LoginForm() {
	const searchParams = useSearchParams();
	const next = searchParams.get("next");
	const [loading, setLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [submitError, setSubmitError] = useState<string | null>(null);
	const router = useRouter();

	const form = useForm({
		resolver: zodResolver(loginSchema),
		defaultValues: { email: "", password: "" }
	});
	const supabase = createSupabaseBrowserClient();

	async function onSubmit(values: any) {
		setLoading(true);
		setSubmitError(null);
		const { error } = await supabase.auth.signInWithPassword(values);

		if (error) {
			setSubmitError("Email ou mot de passe incorrect.");
			setLoading(false);
			return;
		}

		router.push(next || "/app");
		router.refresh();
	}

	return (
		<Card className="w-full max-w-md border-slate-200 shadow-xl">
			<CardHeader className="space-y-1 text-center">
				<div className="flex justify-center mb-2">
					<div className="p-3 rounded-full bg-primary/10">
						<LockKeyhole className="w-6 h-6 text-primary" />
					</div>
				</div>
				<CardTitle className="text-2xl font-bold tracking-tight">Bon retour</CardTitle>
				<CardDescription>
					Connectez-vous à votre interface agence
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						{submitError && (
							<Alert variant="destructive" className="py-2 px-3 text-sm">
								<AlertCircle className="h-4 w-4" />
								<AlertDescription>{submitError}</AlertDescription>
							</Alert>
						)}

						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input
											placeholder="exemple@agence.com"
											type="email"
											className="h-11 focus-visible:ring-primary"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<FormItem>
									<div className="flex items-center justify-between">
										<FormLabel>Mot de passe</FormLabel>
										<Link href="#" className="text-xs text-primary hover:underline">Oublié ?</Link>
									</div>
									<FormControl>
										<div className="relative">
											<Input
												type={showPassword ? "text" : "password"}
												placeholder="••••••••"
												className="h-11 pr-10 focus-visible:ring-primary"
												{...field}
											/>
											<button
												type="button"
												onClick={() => setShowPassword(!showPassword)}
												className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
											>
												{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
											</button>
										</div>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<Button className="w-full h-11 text-base font-semibold transition-all" disabled={loading}>
							{loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
							{loading ? "Connexion..." : "Se connecter"}
						</Button>
					</form>
				</Form>
			</CardContent>
			<CardFooter className="flex flex-col space-y-2">
				<div className="text-sm text-center text-slate-500 w-full">
					Pas encore de compte ?{" "}
					<Link
						href={`/auth/signup${next ? `?next=${encodeURIComponent(next)}` : ""}`}
						className="text-primary font-semibold hover:underline"
					>
						Créer un espace
					</Link>
				</div>
			</CardFooter>
		</Card>
	);
}