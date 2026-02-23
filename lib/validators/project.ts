import * as z from "zod";

export const newProjectSchema = z.object({
  name: z.string().min(2, "Le nom du projet est requis"),
  isNewCompany: z.boolean(),
  companyId: z.string().optional(),
  newCompanyData: z.object({
    name: z.string().optional(),
    email: z.string().email("Email invalide").optional().or(z.literal("")),
    phone_number: z.string().optional(),
    website: z.string().optional(),
    business_sector: z.string().optional(),
  }).optional(),
}).superRefine((data, ctx) => {
  if (data.isNewCompany && (!data.newCompanyData || !data.newCompanyData.name)) {
    ctx.addIssue({
      path: ["newCompanyData", "name"],
      message: "Le nom de l'entreprise est requis",
      code: z.ZodIssueCode.custom,
    });
  }
});

export type NewProjectFormValues = z.infer<typeof newProjectSchema>;