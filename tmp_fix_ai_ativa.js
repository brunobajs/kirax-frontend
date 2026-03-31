const fs = require('fs');
const path = 'pipeline_de_vendas_kirax/code.html';
let content = fs.readFileSync(path, 'utf8');

// Adicionar alertas neurais ao Pipeline de Vendas
const alertHtml = `
<div id="neural-alerts" class="mb-6 space-y-2 hidden">
    <div class="flex items-center gap-2 text-primary text-[10px] font-bold uppercase tracking-widest mb-2">
        <span class="material-symbols-outlined text-sm">psychology</span>
        Alertas Neurais (IA Ativa)
    </div>
    <div id="alert-list" class="space-y-2"></div>
</div>
`;

content = content.replace('<!-- Kanban Board -->', alertHtml + '<!-- Kanban Board -->');

const activeAIScript = `
<script>
    async function checkNeuralAlerts() {
        const urlParams = new URLSearchParams(window.location.search);
        const empresaId = urlParams.get('empresa_id');
        if (!empresaId || !window.kiraxSupabase) return;

        const { data: alerts } = await window.kiraxSupabase
            .from('notificacoes_ia')
            .select('*')
            .eq('empresa_id', empresaId)
            .eq('lida', false)
            .limit(3);

        if (alerts && alerts.length > 0) {
            const container = document.getElementById('neural-alerts');
            const list = document.getElementById('alert-list');
            container.classList.remove('hidden');
            list.innerHTML = alerts.map(a => \`
                <div class="p-3 bg-primary/5 border border-primary/20 rounded-sm flex items-center justify-between">
                    <div>
                        <p class="text-xs font-bold text-primary">\${a.titulo}</p>
                        <p class="text-[10px] text-on-surface-variant">\${a.mensagem}</p>
                    </div>
                    <button class="text-primary hover:text-white transition-colors">
                        <span class="material-symbols-outlined text-sm">visibility</span>
                    </button>
                </div>
            \`).join('');
        }
    }

    window.addEventListener('DOMContentLoaded', checkNeuralAlerts);
</script>
`;

content = content.replace('</body>', activeAIScript + '</body>');
fs.writeFileSync(path, content, 'utf8');
console.log('IA Ativa integrada ao Pipeline!');
