import { LoginForm } from "@/components/auth/LoginForm";
import { Suspense } from "react";

export default function LoginPage() {
    return (
        <div className="flex min-h-screen items-center justify-center">
            <Suspense>
                <LoginForm />
            </Suspense>
        </div>
    );
}