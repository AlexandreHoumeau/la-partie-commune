import { SignupForm } from "@/components/auth/SignupForm";
import { Suspense } from "react";

export default function SignupPage() {
    return (
        <div className="flex min-h-screen items-center justify-center">
            <Suspense>
                <SignupForm />
            </Suspense>
        </div>
    );
}