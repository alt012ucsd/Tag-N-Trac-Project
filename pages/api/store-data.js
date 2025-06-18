// pages/api/piecharts.js
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY // keep secret
);

export default async function handler(req, res) {
  const { data, error } = await supabase
    .from('device_configs')
    .select('*')
    .limit(500);

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  res.status(200).json(data);
}
