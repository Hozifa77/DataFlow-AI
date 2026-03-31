import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(req: Request) {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ credits: 10.00, demo: true });
    }

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('credits')
      .eq('id', user.id)
      .single();

    if (error) {
      return NextResponse.json({ credits: 0 }, { status: 200 });
    }

    return NextResponse.json({ credits: profile?.credits || 0 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
