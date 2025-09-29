const { createClient } = require('@supabase/supabase-js');

export default async function handler(req, res) {
  try {
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
    const { data: app_content, error: e1 } = await supabase.from('app_content').select('*');
    if (e1) throw e1;
    const { data: products, error: e2 } = await supabase.from('products').select('*');
    if (e2) throw e2;
    res.status(200).json({ app_content, products });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
