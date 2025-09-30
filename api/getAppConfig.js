const { createClient } = require('@supabase/supabase-js');

export default async function handler(req, res) {
    console.log("Function handler started."); // Log de Início

    try {
        const supabaseUrl = process.env.SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseKey) {
            console.error("ERRO: Variáveis de ambiente SUPABASE_URL ou SUPABASE_ANON_KEY não encontradas.");
            return res.status(500).json({ error: "Configuração do servidor incompleta." });
        }
        
        console.log("Variáveis de ambiente encontradas. A tentar criar cliente Supabase.");
        const supabase = createClient(supabaseUrl, supabaseKey);
        console.log("Cliente Supabase criado com sucesso.");

        console.log("A tentar ir buscar 'app_content'.");
        const { data: app_content, error: e1 } = await supabase.from('app_content').select('*');
        if (e1) {
            console.error("Erro ao buscar app_content:", e1);
            throw e1;
        }
        console.log("'app_content' recebido com sucesso.");

        console.log("A tentar ir buscar 'products'.");
        const { data: products, error: e2 } = await supabase.from('products').select('*');
        if (e2) {
            console.error("Erro ao buscar products:", e2);
            throw e2;
        }
        console.log("'products' recebido com sucesso.");

        console.log("A enviar resposta de sucesso.");
        res.status(200).json({ app_content, products });

    } catch (error) {
        console.error("ERRO FATAL no bloco try/catch:", error);
        res.status(500).json({ error: error.message || 'Um erro desconhecido ocorreu no servidor.' });
    }
}
