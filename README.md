# Portfolio - Carlos Eduardo

Portfolio moderno e otimizado para conversão de clientes.

## 📁 Estrutura

```
portfolio/
├── index.html          # HTML principal
├── styles.css          # Estilos completos
├── main.js             # JavaScript interativo
├── img/
│   ├── carlos.png      # Sua foto de perfil
│   ├── projeto1.png    # Thumbnail Coca-Cola
│   ├── projeto2.png    # Thumbnail Barbearia
│   ├── projeto3.png    # Thumbnail Cafeteria
│   └── og-preview.svg  # Preview para redes sociais
└── video/
    └── fundo.mp4       # Vídeo de fundo (ADICIONAR)
```

## ⚡ Funcionalidades Implementadas

### 🎯 Foco em Conversão
- **Formulário multi-step** (3 etapas) - reduz fricção, aumenta conclusão
- **Contadores animados** de resultados (projetos, satisfação, prazo)
- **Depoimentos em slider** com auto-play e swipe touch
- **Badges de confiança** (tecnologias, processo, benefícios)
- **CTAs estratégicos** com WhatsApp direto

### ✨ Animações & Interações
- **Reveal on scroll** (IntersectionObserver) - performance nativa
- **Parallax suave** nos cards flutuantes (mouse move)
- **Hover states ricos** em todos elementos interativos
- **Progress bar** de scroll no topo
- **Animações de entrada** escalonadas (staggered)
- **Respeita `prefers-reduced-motion`** - acessibilidade

### 📱 Responsivo & Acessível
- Mobile-first com breakpoints em 900px, 768px, 600px
- Menu hambúrguer animado
- Navegação por teclado completa
- ARIA labels e roles semânticos
- Focus visible customizado
- Contraste WCAG AA

### 🛠 Tech Stack
- **Vanilla JS** (ES6+) - zero dependências
- **CSS Custom Properties** - design system completo
- **CSS Grid + Flexbox** - layouts modernos
- **IntersectionObserver** - scroll animations performáticas
- **FormData API** - formulário nativo

## 🔧 O que você precisa fazer

### 1. Adicionar vídeo de fundo
Coloque um arquivo `fundo.mp4` em `/video/`:
- **Duração:** 15-30s em loop suave
- **Resolução:** 1920x1080 (ou 1280x720)
- **Codec:** H.264/MP4
- **Tamanho:** < 5MB (comprimido)
- **Dica:** Use vídeos abstratos, partículas, gradientes em movimento

### 2. Personalizar conteúdo
Edite `index.html`:
- ✅ Seu nome, telefone, email
- ✅ Projetos reais (URLs, imagens, descrições)
- ✅ Depoimentos reais de clientes
- ✅ Skills que você domina
- ✅ Meta tags (description, OG)

### 3. Converter OG para JPG (opcional)
O `og-preview.svg` funciona, mas para melhor compatibilidade:
```bash
# Instalar ImageMagick e converter
magick img/og-preview.svg img/og-preview.jpg
```

### 4. Deploy recomendado
- **Vercel/Netlify:** Conecte o repo, deploy automático
- **GitHub Pages:** Settings > Pages > Deploy from branch
- **Custom domain:** Configure DNS + SSL automático

## 🎨 Personalização de Cores

Edite as variáveis em `styles.css` (linhas 12-40):

```css
:root {
  --green: #22c55e;        /* Cor principal */
  --green-dark: #16a34a;   /* Hover/active */
  --bg: #030303;           /* Background */
  --card: #0d0d0d;         /* Cards */
  --text: #e5e5e5;         /* Texto principal */
  --muted: #8b8b8b;        /* Texto secundário */
}
```

## 📊 Métricas de Performance

- **CSS:** ~18KB gzipped
- **JS:** ~8KB gzipped
- **Zero dependências externas** (fonts via preload)
- **Lazy loading** nativo nas imagens
- **Video** carrega async, não bloqueia

## 🧪 Testar localmente

```bash
# Python 3
python -m http.server 8000

# Node.js (npx)
npx serve .

# PHP
php -S localhost:8000
```

Acesse `http://localhost:8000`

## 📝 Checklist pré-lançamento

- [ ] Vídeo `fundo.mp4` adicionado e otimizado
- [ ] Foto `carlos.png` atualizada (300x300px mínimo)
- [ ] Thumbnails dos projetos (`projeto1-3.png`) - 400x225px
- [ ] URLs dos projetos funcionando
- [ ] Telefone/WhatsApp correto no formulário e footer
- [ ] Email de contato atualizado
- [ ] Meta tags personalizadas (title, description, OG)
- [ ] Favicon adicionado (gere em realfavicongenerator.net)
- [ ] Testado no mobile (Chrome DevTools device toolbar)
- [ ] Testado acessibilidade (axe, WAVE, teclado only)
- [ ] Deploy configurado com HTTPS

## 📄 Licença

MIT - Sinta-se livre para usar e modificar.