import { createClient } from '@supabase/supabase-js'

// Get these from Supabase dashboard → Project Settings → API
const supabaseUrl = 'https://bhywwqxikkgkshpfbtbx.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJoeXd3cXhpa2tna3NocGZidGJ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4MTQ2MDksImV4cCI6MjA2NTM5MDYwOX0.5GzCcfeY_hFtblBdmmrKewM4KBMYq1IqC98uKBvcuO8'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
