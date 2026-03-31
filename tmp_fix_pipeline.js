const fs = require('fs');
const path = 'pipeline_de_vendas_kirax/code.html';
let content = fs.readFileSync(path, 'utf8');

// Injetar scripts no head
content = content.replace('</head>', '<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>\n<script src="../config.js"></script>\n</head>');

// Injetar script de renderização no final do body
const dynamicScript = `
<script>
    async function fetchPipeline() {
        const urlParams = new URLSearchParams(window.location.search);
        const empresaId = urlParams.get('empresa_id');
        if (!empresaId || !window.kiraxSupabase) return;

        try {
            const { data: deals, error } = await window.kiraxSupabase
                .from('deals')
                .select('*, leads(nome, empresa)')
                .eq('empresa_id', empresaId);

            if (error) throw error;
            renderKanban(deals);
        } catch (err) {
            console.error("Erro no Pipeline:", err);
        }
    }

    function renderKanban(deals) {
        // Mapear seções
        const sections = document.querySelectorAll('main > div > div.flex-shrink-0');
        const columns = {
            'lead': sections[0]?.querySelector('.space-y-4'),
            'qualificacao': sections[1]?.querySelector('.space-y-4'),
            'proposta': sections[2]?.querySelector('.space-y-4'),
            'negociacao': sections[3]?.querySelector('.space-y-4'),
            'fechamento': sections[4]?.querySelector('.space-y-4')
        };

        Object.values(columns).forEach(col => { if(col) col.innerHTML = ''; });

        deals.forEach(deal => {
            const col = columns[deal.estagio];
            if (col) {
                const card = document.createElement('article');
                card.className = "p-4 bg-surface-container border border-outline-variant/10 rounded-sm hover:border-primary/30 transition-all cursor-pointer group";
                card.innerHTML = \`
                    <div class="flex justify-between items-start mb-3">
                        <h3 class="font-headline font-bold text-sm tracking-tight text-primary">\${deal.leads?.empresa || 'Cliente'}</h3>
                        <span class="text-primary font-mono text-xs">R$ \${parseFloat(deal.valor).toLocaleString('pt-BR')}</span>
                    </div>
                    <div class="flex items-center gap-2 mb-4">
                        <span class="material-symbols-outlined text-[14px] text-on-surface-variant">person</span>
                        <span class="text-xs text-on-surface-variant">\${deal.leads?.nome || 'Responsável'}</span>
                    </div>
                    <h4 class="text-xs font-bold text-on-surface mb-2">\${deal.titulo}</h4>
                \`;
                col.appendChild(card);
            }
        });
    }
    window.addEventListener('DOMContentLoaded', fetchPipeline);
</script>
`;

content = content.replace('</body>', dynamicScript + '</body>');
fs.writeFileSync(path, content, 'utf8');
console.log('Pipeline transformado com sucesso!');
