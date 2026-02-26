import { SignupForm } from "@/components/auth/SignupForm";
import { Suspense } from "react";

export default function SignupPage() {
    return (
        <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden px-4 py-12">
            <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-violet-600/15 rounded-full blur-[100px] pointer-events-none" />
            <Suspense>
                <SignupForm />
            </Suspense>
        </div>
    );
}
