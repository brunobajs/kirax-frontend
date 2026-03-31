const fs = require('fs');
const path = 'central_de_chats_desktop/code.html';
let content = fs.readFileSync(path, 'utf8');

// Injetar scripts no head
content = content.replace('</head>', '<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>\n<script src="../config.js"></script>\n</head>');

// Injetar script de renderização no final do body
const dynamicScript = `
<script>
    async function fetchChats() {
        const urlParams = new URLSearchParams(window.location.search);
        const empresaId = urlParams.get('empresa_id');
        if (!empresaId || !window.kiraxSupabase) return;

        try {
            // Buscar mensagens agrupadas por telefone (Simulação de canais de chat)
            const { data: messages, error } = await window.kiraxSupabase
                .from('whatsapp_messages')
                .select('*')
                .eq('empresa_id', empresaId)
                .order('created_at', { ascending: false });

            if (error) throw error;
            renderChatList(messages);
        } catch (err) {
            console.error("Erro no Chat:", err);
        }
    }

    function renderChatList(messages) {
        const listEl = document.querySelector('section.w-80 > div.flex-1');
        if (!listEl) return;

        // Agrupar por telefone único para simular lista de conversas
        const uniqueChats = {};
        messages.forEach(m => {
            const phone = m.from_phone || m.to_phone || 'Desconhecido';
            if (!uniqueChats[phone]) {
                uniqueChats[phone] = m;
            }
        });

        listEl.innerHTML = '';
        Object.values(uniqueChats).forEach(chat => {
            const phone = chat.from_phone || chat.to_phone;
            const item = document.createElement('div');
            item.className = "p-4 hover:bg-white/5 transition-colors cursor-pointer border-l-2 border-transparent active:border-primary active:bg-surface-container";
            item.innerHTML = \`
                <div class="flex gap-3">
                    <div class="w-10 h-10 rounded-sm bg-surface-container-highest flex items-center justify-center text-primary font-bold">
                        \${phone.slice(-2)}
                    </div>
                    <div class="flex-1 min-w-0">
                        <div class="flex justify-between items-start mb-0.5">
                            <span class="font-headline text-xs font-bold text-on-surface truncate">\${phone}</span>
                            <span class="text-[9px] text-primary/40 font-mono">\${new Date(chat.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        </div>
                        <p class="text-[11px] text-on-surface-variant truncate">\${chat.message}</p>
                        <div class="flex gap-1 mt-1">
                             <span class="bg-secondary/10 text-secondary text-[8px] px-1.5 py-0.5 font-bold uppercase">WhatsApp</span>
                        </div>
                    </div>
                </div>
            \`;
            item.onclick = () => loadMessages(phone);
            listEl.appendChild(item);
        });
    }

    async function loadMessages(phone) {
        const urlParams = new URLSearchParams(window.location.search);
        const empresaId = urlParams.get('empresa_id');
        const chatContainer = document.querySelector('section.flex-1 > div.flex-1');
        const headerName = document.querySelector('section.flex-1 h3');
        
        if (headerName) headerName.textContent = phone;
        if (!chatContainer) return;

        const { data: messages } = await window.kiraxSupabase
            .from('whatsapp_messages')
            .select('*')
            .or(\`from_phone.eq.\${phone},to_phone.eq.\${phone}\`)
            .eq('empresa_id', empresaId)
            .order('created_at', { ascending: true });

        chatContainer.innerHTML = messages.map(m => {
            const isMe = m.direction === 'outbound';
            return \`
                <div class="flex flex-col \${isMe ? 'items-end ml-auto' : 'items-start'} max-w-[80%] mb-6">
                    <div class="\${isMe ? 'bg-primary/5 border-r-2 border-primary-fixed' : 'bg-surface-container border-l-2 border-on-surface-variant/20'} p-4 rounded-sm">
                        <p class="text-sm text-on-surface leading-relaxed">\${m.message}</p>
                    </div>
                    <span class="text-[9px] mt-1 font-mono text-on-surface-variant uppercase">\${new Date(m.created_at).toLocaleTimeString()} • \${isMe ? 'SISTEMA' : 'CLIENTE'}</span>
                </div>
            \`;
        }).join('');
        
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    window.addEventListener('DOMContentLoaded', fetchChats);
</script>
`;

content = content.replace('</body>', dynamicScript + '</body>');
fs.writeFileSync(path, content, 'utf8');
console.log('Chat transformado com sucesso!');
