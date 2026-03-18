import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://tfwffqwlxxdombuzsgfy.supabase.co"
const supabaseKey = "sb_publishable_hQN9CisDeAV2hFQh0N_SXQ_RdCv7IF0"

export const supabase = createClient(supabaseUrl, supabaseKey)