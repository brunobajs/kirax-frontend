const fs = require('fs');
const path = 'dashboard_de_performance_kirax/code.html';
let content = fs.readFileSync(path, 'utf8');

// Modernizar o Dashboard para Visão Gerencial
content = content.replace('</head>', '<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>\n<script src="../config.js"></script>\n</head>');

const managementScript = `
<script>
    async function fetchPerformance() {
        const urlParams = new URLSearchParams(window.location.search);
        const empresaId = urlParams.get('empresa_id');
        const role = urlParams.get('role') || 'vendedor'; // vendedor ou gerente
        
        if (!empresaId || !window.kiraxSupabase) return;

        try {
            let query = window.kiraxSupabase
                .from('transacoes')
                .select('*, usuarios(nome)')
                .eq('empresa_id', empresaId);

            // Se for vendedor, vê só o dele. Se for gerente, vê tudo.
            if (role === 'vendedor') {
                const userId = urlParams.get('usuario_id');
                if (userId) query = query.eq('usuario_id', userId);
            }

            const { data: transacoes } = await query;
            renderManagerDashboard(transacoes, role);
        } catch (err) {
            console.error("Erro no Dashboard:", err);
        }
    }

    function renderManagerDashboard(transacoes, role) {
        const titleEl = document.querySelector('h1');
        if (titleEl) titleEl.textContent = role === 'gerente' ? 'DASHBOARD GERENCIAL' : 'DASHBOARD DE VENDAS';
        
        // Lógica de agregação por vendedor se for gerente...
        if (role === 'gerente') {
            const sellers = {};
            transacoes.forEach(t => {
                const name = t.usuarios?.nome || 'Inominado';
                sellers[name] = (sellers[name] || 0) + parseFloat(t.valor);
            });
            console.log("Vendas por Vendedor:", sellers);
            // Aqui poderíamos injetar um gráfico de ranking de vendedores
        }
    }

    window.addEventListener('DOMContentLoaded', fetchPerformance);
</script>
`;

content = content.replace('</body>', managementScript + '</body>');
fs.writeFileSync(path, content, 'utf8');
console.log('Dashboard Gerencial integrado!');
