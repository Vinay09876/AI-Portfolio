import { NextResponse } from 'next/server';
import { supabase } from '@/lib/superbase';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const visitorId = searchParams.get('visitorId');

    if (!visitorId) {
        return NextResponse.json({ error: 'Missing visitorId' }, { status: 400 });
    }

    const { data, error } = await supabase
        .from('chats')
        .select('*, messages(*)')
        .eq('visitor_id', visitorId)
        .order('created_at', { ascending: false });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
}

export async function POST(request: Request) {
    const body = await request.json();
    const title = body.title || 'New Conversation';
    const visitorId = body.visitorId;

    if (!visitorId) {
        return NextResponse.json({ error: 'Missing visitorId' }, { status: 400 });
    }

    const { data, error } = await supabase
        .from('chats')
        .insert({ title, visitor_id: visitorId })
        .select()
        .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
}

export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url);
    const visitorId = searchParams.get('visitorId');

    if (!visitorId) {
        return NextResponse.json({ error: 'Missing visitorId' }, { status: 400 });
    }

    const { error } = await supabase
        .from('chats')
        .delete()
        .eq('visitor_id', visitorId);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
}
