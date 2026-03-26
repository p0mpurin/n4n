import { createClient as createServerSupabase } from '@/lib/supabase/server'

export async function incrementView(profileId: string) {
  const supabase = await createServerSupabase()
  await supabase.rpc('increment_view', { profile_id: profileId })
}

export async function getViewCount(profileId: string): Promise<number> {
  const supabase = await createServerSupabase()
  const { data } = await supabase
    .from('profiles')
    .select('view_count')
    .eq('id', profileId)
    .single()
  return data?.view_count ?? 0
}
