'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

export default function LoginPage() {
    const supabase = createSupabaseBrowserClient();
    const [email, setEmail] = useState('');

    async function signIn() {
        await supabase.auth.signInWithOtp({ email });
    }

    return (
        <div className="flex h-screen items-center justify-center">
            <div className="w-full max-w-sm space-y-4">
                <Input
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <Button onClick={signIn} className="w-full">
                    Se connecter
                </Button>
            </div>
        </div>
    );
}
