import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { supabase } from '@/lib/superbase';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function generateWithRetry(userMessage: string, systemPrompt: string, retries = 2): Promise<string> {
    for (let attempt = 0; attempt <= retries; attempt++) {
        try {
            const result = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: userMessage,
                config: { systemInstruction: systemPrompt },
            });
            return result.text ?? "Sorry, I couldn't generate a response right now.";
        } catch (err: any) {
            const isOverloaded = err?.message?.includes('UNAVAILABLE') || err?.message?.includes('503');
            if (isOverloaded && attempt < retries) {
                await new Promise((resolve) => setTimeout(resolve, 1000 * (attempt + 1))); // wait 1s, then 2s
                continue;
            }
            throw err;
        }
    }
    throw new Error('Failed after retries');
}


export async function POST(
    request: Request,
    { params }: { params: Promise<{ chatId: string }> }
) {
    const { chatId } = await params;
    const { userMessage } = await request.json();

    // 1. Retrieval step: pull your real portfolio content to ground the model
    const [profileRes, experienceRes, projectsRes, skillsRes, educationRes] = await Promise.all([
        supabase.from('profile').select('*').single(),
        supabase.from('experience').select('*').order('sort_order'),
        supabase.from('projects').select('*').order('sort_order'),
        supabase.from('skill_categories').select('*').order('sort_order'),
        supabase.from('education').select('*').order('sort_order'),
    ]);

    const fetchError = profileRes.error || experienceRes.error || projectsRes.error || skillsRes.error || educationRes.error;

    if (fetchError) {
        return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    const profile = profileRes.data;
    const experience = experienceRes.data;
    const projects = projectsRes.data;
    const skills = skillsRes.data;
    const education = educationRes.data;

    // 2. Build a grounding system prompt from that real data
    const systemPrompt = `You are an AI assistant embedded in ${profile.name}'s personal portfolio website. Answer visitor questions about ${profile.name} using ONLY the information below. Be concise, friendly, and use markdown formatting (headers, bold, bullet lists). Whenever you mention a URL (GitHub, LinkedIn, project links, etc.), always format it as a markdown link like [GitHub](https://github.com/...) rather than writing the raw URL as plain text. When listing or naming any project, always include its Link as a markdown link right after the project name (e.g. "**Project Name** ([Live Demo](url))" or "**Project Name** ([GitHub](url))" if no live link exists). If asked something outside this information, politely say you can only answer questions about ${profile.name}'s professional background.

PROFILE:
Name: ${profile.name}
Title: ${profile.title}
Location: ${profile.location}
Email: ${profile.email}
Bio: ${profile.bio}
Social Links: ${profile.social_links.map((l: any) => `${l.platform}: ${l.url}`).join(', ')}

EXPERIENCE:
${experience.map((e: any) => `- ${e.role} at ${e.company} (${e.start_date} to ${e.end_date}): ${e.description} Tech: ${e.tech_stack.join(', ')}`).join('\n')}

PROJECTS:
${projects.map((p: any) => `- ${p.title}: ${p.description} Tech: ${p.tech_stack.join(', ')} Highlights: ${p.highlights.join('; ')} Link: ${p.live_url || p.repo_url}`).join('\n')}

SKILLS:
${skills.map((s: any) => `- ${s.category}: ${s.items.join(', ')}`).join('\n')}

EDUCATION:
${education.map((e: any) => `- ${e.degree} from ${e.institution} (${e.end_date}): ${e.result}`).join('\n')}`;

    try {
        // 3. Call Gemini with the grounding prompt + the visitor's actual question
        const aiText = await generateWithRetry(userMessage, systemPrompt);

        // 4. Persist the assistant's reply
        const { data, error } = await supabase
            .from('messages')
            .insert({ chat_id: chatId, role: 'assistant', content: aiText })
            .select()
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ data });
    } catch (err: any) {
        console.error(err);
        const isOverloaded = err?.message?.includes('UNAVAILABLE') || err?.message?.includes('503');
        const friendlyMessage = isOverloaded
            ? 'The AI service is temporarily overloaded. Please try again in a moment.'
            : (err.message || 'AI generation failed');
        return NextResponse.json({ error: friendlyMessage }, { status: 503 });
    }

}
