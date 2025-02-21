import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_API;
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InByd2tpZWtjZmlud2NiYmZienFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk3MzYyMDksImV4cCI6MjA1NTMxMjIwOX0.SS3hkx188Ss41rWNrM9Q0mBbaZNMi-gvmUKwgR6e0DQ";
export const supabase = createClient(supabaseUrl, supabaseKey);
