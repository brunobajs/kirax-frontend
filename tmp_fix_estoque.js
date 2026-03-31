const fs = require('fs');
const path = 'gest_o_de_estoque_kirax/code.html';
let content = fs.readFileSync(path, 'utf8');

// Injetar scripts no head
content = content.replace('</head>', '<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>\n<script src="../config.js"></script>\n</head>');

// Injetar script de renderização no final do body
const dynamicScript = `
<script>
    async function fetchInventory() {
        const urlParams = new URLSearchParams(window.location.search);
        const empresaId = urlParams.get('empresa_id');
        if (!empresaId || !window.kiraxSupabase) return;

        try {
            const { data: produtos, error } = await window.kiraxSupabase
                .from('produtos')
                .select('*')
                .eq('empresa_id', empresaId);

            if (error) throw error;
            updateInventoryUI(produtos);
        } catch (err) {
            console.error("Erro no Estoque:", err);
        }
    }

    function updateInventoryUI(produtos) {
        const totalValueEl = document.querySelector('.text-primary-fixed.text-3xl');
        const totalItemsEl = document.querySelectorAll('.font-headline.text-2xl')[0];
        const lowStockEl = document.querySelectorAll('.font-headline.text-2xl.text-error')[0];
        const listEl = document.querySelector('section.space-y-4 > div.space-y-2');

        let totalValue = 0;
        let totalItems = 0;
        let lowStockCount = 0;

        listEl.innerHTML = '';
        produtos.forEach(p => {
            totalValue += (parseFloat(p.preco_venda) || 0) * (p.estoque_atual || 0);
            totalItems += (p.estoque_atual || 0);
            const isLow = (p.estoque_atual || 0) <= (p.estoque_minimo || 5);
            if (isLow) lowStockCount++;

            const card = document.createElement('div');
            card.className = \`p-4 bg-surface-container flex items-center justify-between \${isLow ? 'border-l-2 border-error neon-glow-error' : ''}\`;
            card.innerHTML = \`
                <div class="space-y-1">
                    <h3 class="font-medium text-sm">\${p.nome}</h3>
                    <p class="text-[10px] text-on-surface-variant font-mono uppercase">SKU: \${p.sku || 'N/A'}</p>
                    <div class="flex items-center gap-2 pt-1">
                        \${isLow ? '<span class="px-1.5 py-0.5 rounded-full bg-error-container text-[9px] text-on-error-container font-bold uppercase">Crítico</span>' : ''}
                        <p class="text-[11px] text-on-surface">R$ \${(parseFloat(p.preco_venda) || 0).toLocaleString('pt-BR')}</p>
                    </div>
                </div>
                <div class="text-right">
                    <p class="text-xs text-on-surface-variant">Qtd.</p>
                    <p class="font-headline text-xl font-bold \${isLow ? 'text-error' : 'text-on-surface'}">\${p.estoque_atual}</p>
                </div>
            \`;
            listEl.appendChild(card);
        });

        if (totalValueEl) totalValueEl.textContent = 'R$ ' + totalValue.toLocaleString('pt-BR');
        if (totalItemsEl) totalItemsEl.textContent = totalItems.toLocaleString('pt-BR');
        if (lowStockEl) lowStockEl.textContent = lowStockCount.toString();
    }

    window.addEventListener('DOMContentLoaded', fetchInventory);
</script>
`;

content = content.replace('</body>', dynamicScript + '</body>');
fs.writeFileSync(path, content, 'utf8');
console.log('Estoque transformado com sucesso!');
