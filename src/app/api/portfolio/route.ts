import { NextResponse } from "next/server";
import { supabase } from "@/lib/superbase";

export async function GET() {
    const [profileRes, experienceRes, skillsRes, projectRes, educationRes] = await Promise.all([
        supabase.from('profile').select('*').single(),
        supabase.from('experience').select('*').order('sort_order'),
        supabase.from('skill_categories').select('*').order('sort_order'),
        supabase.from('projects').select('*').order('sort_order'),
        supabase.from('education').select('*').order('sort_order')
    ])

    const error = profileRes.error || experienceRes.error || skillsRes.error || projectRes.error || educationRes.error;
    if (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }

    return NextResponse.json({
        profile: profileRes.data,
        experience: experienceRes.data,
        skills: skillsRes.data,
        projects: projectRes.data,
        education: educationRes.data
    })
}