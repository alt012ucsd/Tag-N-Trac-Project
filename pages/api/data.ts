import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../public/lib/supabaseClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { project, asset_id } = req.body;

  try {
    // Start with selecting all columns
    let query = supabase.from('device_configs').select('*');

    // Conditionally filter
    if (project) query = query.eq('project_name', project);
    if (asset_id) query = query.eq('asset_id', asset_id);

    const { data, error } = await query;

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ results: data });
  } catch (err) {
    console.error('Unexpected error in /api/data:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
