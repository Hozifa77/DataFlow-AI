import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const { amount } = await req.json();

    if (!amount || typeof amount !== 'number' || amount < 5) {
      return NextResponse.json({ error: 'Minimum top-up amount is $5.00' }, { status: 400 });
    }

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ success: true, newBalance: 10 + amount, demo: true });
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('credits')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const newBalance = profile.credits + amount;

    await supabase
      .from('profiles')
      .update({ credits: newBalance })
      .eq('id', user.id);

    await supabase.from('transactions').insert([{
      user_id: user.id,
      type: 'topup',
      amount: amount,
      description: `Wallet top-up - $${amount.toFixed(2)}`,
    }]);

    await supabase.from('notifications').insert([{
      user_id: user.id,
      type: 'success',
      title: 'Credits Added',
      message: `$${amount.toFixed(2)} has been added to your wallet. New balance: $${newBalance.toFixed(2)}`,
      read: false,
    }]);

    return NextResponse.json({ success: true, newBalance });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
