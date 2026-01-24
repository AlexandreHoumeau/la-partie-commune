import { createClient } from '@/lib/supabase/server';

export default async function OpportunitiesPage() {
    const supabase = await createClient();
    const { data } = await supabase.from('opportunities').select('*');

    return (
        <div className="p-6">
            <h1 className="text-xl font-semibold">Opportunités</h1>
            <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
    );
}
