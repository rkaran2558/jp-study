import { supabase } from '@/lib/supabase'
import UpdatesTicker from './UpdatesTicker'

export default async function GlobalTicker() {
  const { data: updates } = await supabase.from('updates').select('*').eq('is_active', true).order('created_at', { ascending: false })
  
  if (!updates || updates.length === 0) return null

  return <UpdatesTicker updates={updates} />
}
