const fs = require('fs');
const path = 'm_dulo_financeiro_inteligente/code.html';
let content = fs.readFileSync(path, 'utf8');

// Injetar scripts no head
content = content.replace('</head>', '<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>\n<script src="../config.js"></script>\n</head>');

// Injetar script de renderização no final do body
const dynamicScript = `
<script>
    async function fetchFinanceData() {
        const urlParams = new URLSearchParams(window.location.search);
        const empresaId = urlParams.get('empresa_id');
        if (!empresaId || !window.kiraxSupabase) return;

        try {
            const { data: transacoes, error } = await window.kiraxSupabase
                .from('transacoes')
                .select('*')
                .eq('empresa_id', empresaId)
                .order('data_transacao', { ascending: false });

            if (error) throw error;
            updateFinancialUI(transacoes);
        } catch (err) {
            console.error("Erro no Financeiro:", err);
        }
    }

    function updateFinancialUI(transacoes) {
        const receitaEl = document.querySelector('.text-primary.text-3xl');
        const despesaEl = document.querySelector('.text-secondary.text-3xl');
        const listEl = document.querySelector('tbody');

        let totalReceita = 0;
        let totalDespesa = 0;

        listEl.innerHTML = '';
        transacoes.forEach(t => {
            const isReceita = t.tipo === 'receita';
            if (isReceita) totalReceita += parseFloat(t.valor);
            else totalDespesa += parseFloat(t.valor);

            const row = document.createElement('tr');
            row.className = "hover:bg-white/5 transition-colors";
            row.innerHTML = \`
                <td class="px-6 py-4 text-xs font-mono">\${new Date(t.data_transacao).toLocaleDateString()}</td>
                <td class="px-6 py-4 text-sm font-medium">\${t.descricao}</td>
                <td class="px-6 py-4 text-[10px]"><span class="px-2 py-1 \${isReceita ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-secondary/10 text-secondary border border-secondary/20'} rounded-sm uppercase font-bold">\${t.categoria}</span></td>
                <td class="px-6 py-4 text-xs text-on-surface-variant uppercase">\${t.metodo}</td>
                <td class="px-6 py-4 text-sm font-bold \${isReceita ? 'text-primary' : 'text-error'} text-right">\${isReceita ? '+' : '-'} R$ \${parseFloat(t.valor).toLocaleString('pt-BR')}</td>
            \`;
            listEl.appendChild(row);
        });

        if (receitaEl) receitaEl.textContent = 'R$ ' + totalReceita.toLocaleString('pt-BR');
        if (despesaEl) despesaEl.textContent = 'R$ ' + totalDespesa.toLocaleString('pt-BR');
    }

    window.addEventListener('DOMContentLoaded', fetchFinanceData);
</script>
`;

content = content.replace('</body>', dynamicScript + '</body>');
fs.writeFileSync(path, content, 'utf8');
console.log('Financeiro transformado com sucesso!');
