import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://feiuxrksqqmipxrdiswt.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZlaXV4cmtzcXFtaXB4cmRpc3d0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEyMDM2NTAsImV4cCI6MjA4Njc3OTY1MH0.Inl8uMVdBrwb6uPjYTDnCr_Ojvq60EgkLWHrSJbA8qI"

export const supabase = createClient(supabaseUrl, supabaseKey)
