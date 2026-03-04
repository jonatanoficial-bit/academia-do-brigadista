# Academia do Brigadista (mobile-first) — build 20260304-143153

Aplicativo web estático (HTML + CSS + JS **vanilla**) pronto para GitHub Pages.

## Rodar localmente
Por ser um projeto com `fetch()` (carregamento de conteúdo JSON), use um servidor local:

### Opção 1 — VS Code (Live Server)
1. Instale a extensão **Live Server**
2. Abra `index.html` e clique em **Go Live**

### Opção 2 — Python
```bash
python -m http.server 8080
```
Acesse: http://localhost:8080

## Publicar no GitHub Pages
1. Crie um repositório (ex.: `academia-do-brigadista`)
2. Envie todos os arquivos para a branch `main`
3. Em **Settings → Pages** selecione:
   - Source: **Deploy from a branch**
   - Branch: `main` / `(root)`
4. Abra a URL fornecida pelo GitHub Pages

## Serial (primeiro acesso por navegador)
- No **primeiro acesso** o usuário precisa informar um serial válido.
- Depois, o acesso fica liberado **no mesmo navegador** (via `localStorage`).
- Para limpar o acesso: abra **Admin → Segurança → Resetar acesso** (ou limpe o `localStorage` do site no navegador).

> Os 20 seriais válidos gerados nesta build estão em `admin.html` (somente visível após login), e também podem ser trocados no futuro.

## Estrutura (arquitetura expansível)
```
/content/
  /core/
    manifest.json
    fire.json
    first_aid.json
    prevention.json
    evaluation.json
  /dlc/
    index.json          # catálogo de DLCs (para GitHub Pages é necessário listar aqui)
    (exemplos podem ser adicionados futuramente)
```

### Como funciona DLC
- O app carrega `/content/core/manifest.json`.
- Também lê `/content/dlc/index.json` para saber quais DLCs existem.
- DLCs podem ser ativadas/desativadas no **Admin**.
- DLCs importadas pelo Admin podem ser armazenadas localmente (sem precisar mexer no core).

## Admin (modo local)
Acesse: `.../admin.html`

**Login padrão (pode e deve ser alterado):**
- Usuário: `admin`
- Senha: `admin123`

No Admin você consegue:
- Ativar/desativar DLCs
- Exportar / importar JSON de conteúdo
- Editar links (ex.: embed do Google Forms)
- Resetar serial liberado no navegador

## Logo
⚠️ **Importante:** por limitações do chat, esta build inclui um `assets/logo-placeholder.svg`.
Substitua por seu logo oficial:
- Coloque seu arquivo em `assets/logo.png` (ou `logo.svg`)
- Ajuste em `app.config.js` se necessário.

## Referências normativas usadas para orientar o conteúdo
O conteúdo do curso foi estruturado como **material educacional** com base em normas e referências amplamente usadas no Brasil/SP e em protocolos de primeiros socorros. Recomenda-se validação final por profissional habilitado e adequação ao seu público-alvo e carga horária.

- **NR-23 (Proteção contra Incêndios)** — Ministério do Trabalho e Emprego (atualização 2022): https://www.gov.br/trabalho-e-emprego/ (PDF citado no app)
- **ABNT NBR 14276 (Brigada de incêndio — Requisitos)** (referência didática)
- **CBPMESP — Instruções Técnicas (SP)**: IT 17/2025 (Brigada), IT 21/2025 (Extintores) + Decreto Estadual 69.118/2024
- **Lei 13.722/2018 (Lei Lucas)** — primeiros socorros em escolas/recreação
- **AHA Guidelines 2020 CPR/ECC** — base para RCP/DEA (referência internacional)

## Próximos passos sugeridos
- Você me envia o link do **Google Forms** (embed) para eu fixar como padrão.
- Você envia o **logo oficial** em arquivo para eu integrar diretamente.
- Criar DLCs adicionais: vídeos, bancos de questões, simulações, certificados, etc.

---
Criado por **Jonatan Vale** — **Academia do Brigadista**.
