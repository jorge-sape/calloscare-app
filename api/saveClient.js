const { createClient } = require('@supabase/supabase-js');

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') { return res.status(405).json({ error: 'Method Not Allowed' }); }

  try {
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
    const clientData = req.body;

    let query = supabase.from('clients');
    if (clientData.email) {
        query = query.select('id, firstName, lastName, email, phone, dob, gender').eq('email', clientData.email);
    } else if (clientData.phone) {
        query = query.select('id, firstName, lastName, email, phone, dob, gender').eq('phone', clientData.phone);
    }

    const { data: existing, error: findError } = await query;
    if (findError) throw findError;

    if (existing && existing.length > 0) {
        return res.status(200).json({ success: true, data: existing, message: 'Client already exists.' });
    }

    const { data, error } = await supabase.from('clients').insert([clientData]).select();
    if (error) throw error;

    res.status(200).json({ success: true, data: data, message: 'Client created.' });
  } catch (error) { 
    res.status(500).json({ success: false, error: error.message }); 
  }
}
