const { createClient } = require('@supabase/supabase-js');

module.exports = async (req, res) => {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        // Verificar variáveis de ambiente
        if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
            throw new Error('Variáveis de ambiente do Supabase não configuradas');
        }

        const supabase = createClient(
            process.env.SUPABASE_URL,
            process.env.SUPABASE_ANON_KEY
        );

        // Buscar dados com fallbacks
        const [app_content, interactive_products, suggestion_rules, cause_investigation] = await Promise.all([
            supabase.from('app_content').select('*').then(({ data, error }) => {
                if (error) {
                    console.warn('Erro em app_content:', error.message);
                    return [];
                }
                return data || [];
            }),
            supabase.from('interactive_products').select('*').then(({ data, error }) => {
                if (error) {
                    console.warn('Erro em interactive_products:', error.message);
                    return [];
                }
                return data || [];
            }),
            supabase.from('suggestion_rules').select('*').then(({ data, error }) => {
                if (error) {
                    console.warn('Erro em suggestion_rules:', error.message);
                    return [];
                }
                return data || [];
            }),
            supabase.from('cause_investigation').select('*').then(({ data, error }) => {
                if (error) {
                    console.warn('Erro em cause_investigation:', error.message);
                    return [];
                }
                return data || [];
            })
        ]);

        // Dados de fallback básicos se as tabelas estiverem vazias
        const response = {
            app_content: app_content.length > 0 ? app_content : getFallbackAppContent(),
            interactive_products: interactive_products.length > 0 ? interactive_products : getFallbackProducts(),
            suggestion_rules: suggestion_rules.length > 0 ? suggestion_rules : [],
            cause_investigation_questions: cause_investigation.length > 0 ? cause_investigation : getFallbackInvestigation(),
            full_protocols: {} // Pode ser implementado depois
        };

        res.status(200).json(response);

    } catch (error) {
        console.error('ERRO NO getAppConfig:', error);
        
        // Fallback completo em caso de erro
        res.status(200).json({
            app_content: getFallbackAppContent(),
            interactive_products: getFallbackProducts(),
            suggestion_rules: [],
            cause_investigation_questions: getFallbackInvestigation(),
            full_protocols: {}
        });
    }
};

// Fallbacks básicos
function getFallbackAppContent() {
    return [
        {
            content_key: 'higiene_rule',
            title: 'Regra de Ouro de Higiene',
            content_html: '<p>Lave e seque os pés com água morna e sabão neutro. Desinfete a área com produtos adequados.</p>'
        },
        {
            content_key: 'emergency_kit_protocol', 
            title: 'Kit de Emergência',
            content_html: '<p>Para dor intensa: gelo, repouso e elevação do pé.</p>'
        }
    ];
}

function getFallbackProducts() {
    return [
        {
            product_name: "Povidona-iodada",
            category: "Desinfecção",
            description: "Solução antisséptica"
        },
        {
            product_name: "Álcool 70º", 
            category: "Desinfecção",
            description: "Para desinfetar utensílios"
        }
    ];
}

function getFallbackInvestigation() {
    return [
        {
            category: "Calçado",
            questions: [
                {
                    question_key: "shoe_fit",
                    question_text: "O calçado é confortável?",
                    investigation_advice: "Calçado inadequado pode causar calos."
                }
            ]
        }
    ];
}
