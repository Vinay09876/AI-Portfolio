import { NextResponse } from 'next/server';
import { supabase } from '@/lib/superbase';

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ chatId: string; messageId: string }> }
) {
    const { chatId, messageId } = await params;
    const { content } = await request.json();

    if (!content || !content.trim()) {
        return NextResponse.json({ error: 'Missing content' }, { status: 400 });
    }

    // 1. Look up the edited message's timestamp, so we know what counts as "after" it
    const { data: original, error: fetchError } = await supabase
        .from('messages')
        .select('created_at')
        .eq('id', messageId)
        .eq('chat_id', chatId)
        .single();

    if (fetchError || !original) {
        return NextResponse.json({ error: fetchError?.message || 'Message not found' }, { status: 404 });
    }

    // 2. Delete every message in this chat that came after the edited one (the old reply, and anything after it)
    const { error: deleteError } = await supabase
        .from('messages')
        .delete()
        .eq('chat_id', chatId)
        .gt('created_at', original.created_at);

    if (deleteError) {
        return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    // 3. Update the edited message's own content
    const { data, error } = await supabase
        .from('messages')
        .update({ content })
        .eq('id', messageId)
        .select()
        .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
}
