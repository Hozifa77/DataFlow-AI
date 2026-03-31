import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(req: Request) {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({
        notifications: [
          { id: "1", type: "success", title: "Welcome", message: "Your account is ready. You have $10.00 in credits.", read: false, created_at: new Date().toISOString() },
          { id: "2", type: "info", title: "Getting Started", message: "Upload your first document to begin extracting data.", read: false, created_at: new Date().toISOString() },
        ]
      });
    }

    const { data: notifications, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) {
      return NextResponse.json({ notifications: [] });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('credits')
      .eq('id', user.id)
      .single();

    const credits = profile?.credits || 0;

    if (credits <= 2 && credits > 0) {
      const hasLowBalance = notifications?.some(
        (n: any) => n.type === 'warning' && n.title === 'Low Balance' && !n.read
      );
      if (!hasLowBalance) {
        await supabase.from('notifications').insert([{
          user_id: user.id,
          type: 'warning',
          title: 'Low Balance',
          message: 'Your balance is running low. Please recharge.',
          read: false,
        }]);
      }
    }

    if (credits === 0) {
      const hasNoBalance = notifications?.some(
        (n: any) => n.type === 'error' && n.title === 'No Credits' && !n.read
      );
      if (!hasNoBalance) {
        await supabase.from('notifications').insert([{
          user_id: user.id,
          type: 'error',
          title: 'No Credits',
          message: 'You have no credits remaining.',
          read: false,
        }]);
      }
    }

    return NextResponse.json({ notifications: notifications || [] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { id, readAll } = await req.json();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (readAll) {
      await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user.id)
        .eq('read', false);
    } else if (id) {
      await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', id)
        .eq('user_id', user.id);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
