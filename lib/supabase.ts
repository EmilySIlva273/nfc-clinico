import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://sneybhegyfavtbvosvjt.supabase.co/rest/v1/"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNuZXliaGVneWZhdnRidm9zdmp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc4MTQzOTMsImV4cCI6MjA5MzM5MDM5M30.J-DBmZoOJx6Q-S-HDZHVDJZXDxaVhklOdqgpA0CBY1g"

export const supabase = createClient(supabaseUrl, supabaseKey)