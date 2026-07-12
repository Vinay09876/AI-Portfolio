import { NextResponse } from 'next/server';
import { supabase } from '@/lib/superbase';

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ chatId: string }> }
) {
    const { chatId } = await params;
    const body = await request.json();
    const visitorId = body.visitorId;

    if (!visitorId) {
        return NextResponse.json({ error: 'Missing visitorId' }, { status: 400 });
    }

    const { data, error } = await supabase
        .from('chats')
        .update({ title: body.title })
        .eq('id', chatId)
        .eq('visitor_id', visitorId)
        .select()
        .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ chatId: string }> }
) {
    const { chatId } = await params;
    const { searchParams } = new URL(request.url);
    const visitorId = searchParams.get('visitorId');

    if (!visitorId) {
        return NextResponse.json({ error: 'Missing visitorId' }, { status: 400 });
    }

    const { error } = await supabase
        .from('chats')
        .delete()
        .eq('id', chatId)
        .eq('visitor_id', visitorId);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
}
