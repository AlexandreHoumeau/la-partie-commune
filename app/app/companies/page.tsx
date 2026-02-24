import { Suspense } from "react";
import CompaniesPage from "./CompaniesPage";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-8 text-slate-400 text-sm">Chargement...</div>}>
      <CompaniesPage />
    </Suspense>
  );
}
