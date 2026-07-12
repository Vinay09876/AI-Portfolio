import { NextResponse } from 'next/server';
import { supabase } from '@/lib/superbase';

export async function POST(request: Request) {
    const { name, email, message } = await request.json();

    if (!name || !email || !message) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { error } = await supabase
        .from('contact_submissions')
        .insert({ name, email, message });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });

}
