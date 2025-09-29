const { createClient } = require('@supabase/supabase-js');

export default async function handler(req, res) {
  try {
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
    const { client_id } = req.query;

    if (!client_id) {
      return res.status(400).json({ error: 'client_id is required' });
    }

    const { data, error } = await supabase
      .from('diagnostics')
      .select('*')
      .eq('client_id', client_id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
