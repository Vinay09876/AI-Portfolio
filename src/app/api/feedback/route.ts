import { NextResponse } from 'next/server';
import { supabase } from '@/lib/superbase';

export async function POST(request: Request) {
    const { rating, thumbs, comment } = await request.json();

    if (!rating && !thumbs) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { error } = await supabase
        .from('feedbacks')
        .insert({ rating, thumbs: thumbs ?? null, comment: comment ?? null })

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
}