const { createClient } = require('@supabase/supabase-js');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  try {
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
    const diagnosticData = req.body;
    const { data, error } = await supabase.from('diagnostics').insert([diagnosticData]).select();
    if (error) throw error;
    res.status(200).json({ success: true, data: data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}
