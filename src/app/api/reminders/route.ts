import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// 📥 ดึงรายการ reminders
export async function GET() {
  const { data, error } = await supabase
    .from('reminders')
    .select('*')
    .order('next_water_date', { ascending: true })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

// ➕ เพิ่ม reminder ใหม่
export async function POST(req: Request) {
  const body = await req.json()

  const { error } = await supabase
    .from('reminders')
    .insert(body)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
