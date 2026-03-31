const fs = require('fs');
const path = 'checkout_seguro_mercado_pago/code.html';
let content = fs.readFileSync(path, 'utf8');

// Injetar scripts no head
content = content.replace('</head>', '<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>\n<script src="../config.js"></script>\n</head>');

// Injetar script de renderização no final do body
const dynamicScript = `
<script>
    async function fetchCheckoutDetails() {
        const urlParams = new URLSearchParams(window.location.search);
        const empresaId = urlParams.get('empresa_id');
        const productId = urlParams.get('product_id');
        
        if (!empresaId || !window.kiraxSupabase) return;

        try {
            // Se houver produto, buscar detalhes
            if (productId) {
                const { data: product } = await window.kiraxSupabase
                    .from('produtos')
                    .select('*')
                    .eq('id', productId)
                    .single();

                if (product) updateCheckoutUI(product);
            }
        } catch (err) {
            console.error("Erro no Checkout:", err);
        }
    }

    function updateCheckoutUI(product) {
        const titleEl = document.querySelector('h4.font-bold.text-on-surface');
        const priceEl = document.querySelector('span.text-primary.font-headline');
        const totalEl = document.querySelector('span.text-primary.font-black');
        
        if (titleEl) titleEl.textContent = product.nome;
        const priceStr = 'R$ ' + (parseFloat(product.preco_venda) || 0).toLocaleString('pt-BR');
        if (priceEl) priceEl.textContent = priceStr;
        if (totalEl) totalEl.textContent = priceStr;
    }

    window.addEventListener('DOMContentLoaded', fetchCheckoutDetails);
</script>
`;

content = content.replace('</body>', dynamicScript + '</body>');
fs.writeFileSync(path, content, 'utf8');
console.log('Checkout transformado com sucesso!');
