// Configuração Global Kirax CRM
const KIRAX_CONFIG = {
    // Backend API (Vercel)
    API_URL: 'https://kirax-backend-v2.vercel.app/api',
    
    // Supabase Configuration
    SUPABASE_URL: 'https://qkllvzcmvnouhztdjkwq.supabase.co',
    SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFrbGx2emNtdm5vdWh6dGRrd3dxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIxNDQyMDcsImV4cCI6MjA4NzcyMDIwN30.m9yfmd5z_oZvklugKPGShPvVEzGEInsZAmLaTwEoLp4',
    
    // Modules mapping
    MODULES: {
        VENDAS: 'pipeline_de_vendas_kirax/code.html',
        RELACIONAMENTO: 'pipeline_de_relacionamento_kirax/code.html',
        VAREJO: 'm_dulo_varejo_kirax/code.html',
        CALENDARIO: 'calend_rio_kirax/code.html',
        ADMIN: 'painel_master_admin_kirax_hub_central/code.html'
    }
};

if (typeof window !== 'undefined') {
    window.KIRAX_CONFIG = KIRAX_CONFIG;
    
    // Inicializar Supabase se a lib estiver carregada
    if (typeof supabase !== 'undefined') {
        window.kiraxSupabase = supabase.createClient(KIRAX_CONFIG.SUPABASE_URL, KIRAX_CONFIG.SUPABASE_ANON_KEY);
    }
}

