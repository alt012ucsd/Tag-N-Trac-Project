// lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dqkguyiyfdhnohsvevtv.supabase.co/'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRxa2d1eWl5ZmRobm9oc3ZldnR2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDI2OTI4OSwiZXhwIjoyMDY1ODQ1Mjg5fQ.oDEZVguMLnIPxMhowK4356LApNQgMNYHgwB142v5EA4';

export const supabase = createClient(supabaseUrl, supabaseKey);
