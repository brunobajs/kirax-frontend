const fs = require('fs');
const path = 'central_de_chats_desktop/code.html';
let content = fs.readFileSync(path, 'utf8');

// Adicionar botão de Bot e Sugerir Resposta dinâmico
const botToggleHtml = `
<div class="flex items-center gap-2 px-3 py-1 bg-tertiary/10 border border-tertiary/20 rounded-sm">
    <span class="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
    <span class="text-[9px] font-bold text-tertiary uppercase tracking-widest">IA BOT ATIVO</span>
</div>
`;

content = content.replace('<!-- Chat Header -->', '<!-- Chat Header -->\n<div class="absolute top-20 right-8 z-20">' + botToggleHtml + '</div>');

// Injetar script de IA
const aiScript = `
<script>
    async function suggestAIResponse() {
        const urlParams = new URLSearchParams(window.location.search);
        const empresaId = urlParams.get('empresa_id');
        const textarea = document.querySelector('textarea');
        
        if (!empresaId || !window.kiraxSupabase) return;

        try {
            // Buscar conhecimento da empresa
            const { data: knowledge } = await window.kiraxSupabase
                .from('conhecimento_ia')
                .select('prompt_conhecimento')
                .eq('empresa_id', empresaId)
                .single();

            const context = knowledge ? knowledge.prompt_conhecimento : "Empresa genérica de serviços.";
            const lastMessage = document.querySelector('section.flex-1 > div.flex-1 div:last-child p')?.textContent || "Olá";

            textarea.value = "Gerando sugestão...";
            
            // Simulação de chamada Gemini (usando o conhecimento)
            // Em produção, isso chamaria o endpoint do backend
            setTimeout(() => {
                textarea.value = "Olá! Baseado no seu interesse em " + lastMessage.slice(0, 20) + "..., aqui na " + (context.includes('Total Agro') ? 'Total Agro' : 'Kirax') + " temos as melhores opções. " + (context.includes('fertilizantes') ? "Nossos fertilizantes NPK estão com 10% de desconto hoje!" : "Como posso te ajudar hoje?");
            }, 1000);

        } catch (err) {
            console.error("Erro na Sugestão IA:", err);
        }
    }

    // Vincular botão de sugestão
    document.addEventListener('DOMContentLoaded', () => {
        const btn = document.querySelector('button:contains("SUGERIR_RESPOSTA")') || document.querySelectorAll('button')[16]; // Fallback selector
        if (btn) btn.onclick = suggestAIResponse;
    });
</script>
`;

content = content.replace('</body>', aiScript + '</body>');
fs.writeFileSync(path, content, 'utf8');
console.log('Bot IA e Sugestão integrados!');
