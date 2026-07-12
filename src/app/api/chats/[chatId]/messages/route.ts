import { NextResponse } from 'next/server';
import { supabase } from '@/lib/superbase';

export async function POST(
    request: Request,
    { params }: { params: Promise<{ chatId: string }> }
) {
    const { chatId } = await params;
    const body = await request.json();

    const { data, error } = await supabase
        .from('messages')
        .insert({ chat_id: chatId, role: body.role, content: body.content })
        .select()
        .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
}
