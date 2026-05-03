import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://sneybhegyfavtbvosvjt.supabase.co/rest/v1/"
const supabaseKey = "sb_publishable_PZip5ZPBjq-_QKBkW6ZhHw_WhDwjFSD"

export const supabase = createClient(supabaseUrl, supabaseKey)