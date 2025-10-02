const { createClient } = require('@supabase/supabase-js');

export default async function handler(req, res) {
    // Adiciona os headers CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        const supabase = createClient(
            process.env.SUPABASE_URL,
            process.env.SUPABASE_ANON_KEY
        );

        // Conteúdo principal da app (textos, protocolos resumidos, etc.)
        const { data: app_content, error: e1 } = await supabase
            .from('app_content')
            .select('*');
        if (e1) throw e1;

        // Produtos (catálogo interativo)
        const { data: interactive_products, error: e2 } = await supabase
            .from('interactive_products')
            .select('*');
        if (e2) throw e2;

        // Regras de sugestão dinâmica
        const { data: suggestion_rules, error: e3 } = await supabase
            .from('suggestion_rules')
            .select('*');
        if (e3) throw e3;

        // Questões de investigação da causa raiz
        const { data: cause_investigation_questions, error: e4 } = await supabase
            .from('cause_investigation')
            .select('*');
        if (e4) throw e4;

        // Protocolos completos (texto do eBook para cada calo/verruga) - NOVO V5.0
        const { data: full_protocols, error: e5 } = await supabase
            .from('full_protocols')
            .select('*');
        if (e5) throw e5;

        // Devolve tudo já preparado para a app v5.0
        res.status(200).json({
            app_content,
            interactive_products,
            suggestion_rules,
            cause_investigation_questions,
            full_protocols
        });

    } catch (error) {
        console.error("ERRO FATAL no getAppConfig:", error);
        res.status(500).json({ error: error.message });
    }
}
