import { Suspense } from "react";
import OpportunitiesPage from "./OpportunitiesPage";

export default function Page() {
    return (
        <Suspense fallback={<div className="p-8">Loading...</div>}>
            <OpportunitiesPage />
        </Suspense>
    );
}
