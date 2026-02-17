import { z } from "zod";

export const signupSchema = z.object({
    // On retire le .default(false) pour éviter le type "optional"
    isInvited: z.boolean(), 
    agencyName: z.string(),
    firstName: z.string().min(2, "Le prénom doit avoir 2 caractères"),
    lastName: z.string().min(2, "Le nom doit avoir 2 caractères"),
    email: z.string().email("Email invalide"),
    password: z.string().min(8, "8 caractères minimum"),
    confirmPassword: z.string()
})
.refine(data => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
})
.refine(data => {
    // Si l'utilisateur n'est PAS invité, le nom de l'agence est requis (min 2)
    if (!data.isInvited) {
        return data.agencyName.trim().length >= 2;
    }
    return true;
}, {
    message: "Le nom de l'agence est requis (min 2 caractères)",
    path: ["agencyName"],
});

export type SignupValues = z.infer<typeof signupSchema>;

export const loginSchema = z.object({
    email: z.string().email("Email invalide"),
    password: z.string().min(8, "Mot de passe trop court"),
});