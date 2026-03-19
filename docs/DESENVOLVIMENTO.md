# Guia de Desenvolvimento — Criança Saudável

## Pré-requisitos

| Ferramenta | Versão mínima | Verificar |
|---|---|---|
| Node.js | 18.x | `node --version` |
| npm | 9.x | `npm --version` |
| Python | 3.9+ | `python --version` (apenas para testes E2E) |
| Git | qualquer | `git --version` |

---

## Configuração inicial

```bash
# 1. Clonar o repositório
git clone https://github.com/tgorgatti/crianca-saudavel.git
cd crianca-saudavel

# 2. Instalar dependências
npm install

# 3. Iniciar o servidor de desenvolvimento
npm run dev
```

Acesse: `http://localhost:5173/crianca-saudavel/`

> O app usa `base: '/crianca-saudavel/'` no Vite para coincidir com o subdiretório do GitHub Pages. Sempre acesse pela URL com o path completo em desenvolvimento.

---

## Scripts disponíveis

| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia o servidor de desenvolvimento com HMR |
| `npm run build` | Compila TypeScript e gera o bundle em `dist/` |
| `npm run preview` | Serve o build de produção localmente |
| `npm run deploy` | Faz build e publica no GitHub Pages (`gh-pages -d dist`) |

---

## Fluxo de trabalho recomendado

### 1. Desenvolver uma nova funcionalidade

```bash
# Criar branch
git checkout -b feat/nome-da-funcionalidade

# Desenvolver com HMR ativo
npm run dev

# Verificar se o build não quebra
npm run build

# Rodar testes E2E
pytest tests/e2e/test_app.py -v

# Commitar e abrir PR
git add .
git commit -m "feat: descrição da funcionalidade"
git push origin feat/nome-da-funcionalidade
```

### 2. Corrigir um bug

```bash
git checkout -b fix/descricao-do-bug
# ... correção ...
npm run build  # garantir 0 erros TypeScript
pytest tests/e2e/test_app.py -v
git commit -m "fix: descrição do bug"
```

### 3. Publicar nova versão

```bash
# Atualizar versão em package.json
# Commitar tudo
git add .
git commit -m "chore: v1.x.x"
git push origin main

# Deploy para GitHub Pages
npm run deploy
```

---

## Adicionando um novo componente

1. Criar o arquivo em `src/components/NomeComponente.tsx`
2. Seguir o padrão dos componentes existentes:
   - `export default function NomeComponente()`
   - Consumir o contexto via `const { ... } = useApp()`
   - Usar `t.nomeSecao.*` para todas as strings visíveis
3. Registrar a seção em `App.tsx` (objeto `sections`)
4. Adicionar o item de navegação no `Sidebar.tsx`
5. Adicionar as strings em `src/i18n/translations.ts` nos três idiomas
6. Escrever testes E2E em `tests/e2e/test_app.py`

---

## Adicionando uma nova entidade de dados

1. Definir a interface em `src/types/index.ts`
2. Adicionar o estado e as funções CRUD em `src/context/AppContext.tsx`:
   - `useState<Entidade[]>` inicializado com leitura do `localStorage`
   - `useEffect` que salva no `localStorage` a cada mudança
   - Funções `addEntidade`, `updateEntidade`, `deleteEntidade`
   - Expor via `value` do Provider
3. Criar o componente que consome a entidade

### Padrão de chave localStorage

```ts
const STORAGE_KEY = 'cs_nome_entidade';

const [items, setItems] = useState<Entidade[]>(() => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
});

useEffect(() => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}, [items]);
```

---

## Adicionando um novo idioma

1. Abrir `src/i18n/translations.ts`
2. Adicionar a entrada no objeto `translations`:

```ts
export const translations: Record<Language, AppTranslations> = {
  'pt-BR': { ... },
  'en': { ... },
  'es': { ... },
  'fr': { ... },  // novo idioma
};
```

3. Atualizar o tipo `Language`:

```ts
export type Language = 'pt-BR' | 'en' | 'es' | 'fr';
```

4. Adicionar o botão de seleção no `Sidebar.tsx`

---

## Testes E2E

### Configuração (uma vez)

```bash
# Windows
python -m venv .venv
.venv\Scripts\activate
pip install playwright pytest pytest-playwright
playwright install chromium
```

### Executar todos os testes

```bash
pytest tests/e2e/test_app.py -v
```

### Executar uma classe específica

```bash
pytest tests/e2e/test_app.py::TestVacinas -v
```

### Executar um teste específico

```bash
pytest tests/e2e/test_app.py::TestPerfil::test_editar_perfil -v
```

### Re-executar apenas os que falharam

```bash
pytest tests/e2e/test_app.py --lf -v
```

### Rodar no app publicado (produção)

Altere a linha `BASE_URL` em `tests/e2e/test_app.py`:

```python
BASE_URL = "https://tgorgatti.github.io/crianca-saudavel/"
```

### Escrevendo novos testes

Siga o padrão das classes existentes:

```python
class TestNovaSecao:
    def setup(self, page: Page):
        criar_crianca(page)
        nav_click(page, 'nova_secao')

    def test_abre_secao(self, page: Page):
        self.setup(page)
        expect(page.get_by_text("Título da Seção")).to_be_visible()

    def test_adicionar_item(self, page: Page):
        self.setup(page)
        page.click("button:has-text('Novo item')")
        # ...
        expect(page.get_by_text("Item criado")).to_be_visible()
```

---

## Convenções de código

### TypeScript

- Interfaces públicas ficam em `src/types/index.ts`
- Interfaces internas ao componente ficam no próprio arquivo
- Sem `any` — usar tipos precisos ou `unknown`

### React

- Componentes funcionais com `export default function`
- Estado local com `useState`; estado global via `AppContext`
- Sem comentários em código trivial

### Tailwind CSS

- Classes utilitárias diretamente no JSX
- Classes reutilizáveis definidas em `src/index.css` com `@layer components`:

```css
@layer components {
  .card { @apply bg-white rounded-2xl shadow-sm border border-pink-100 p-5; }
  .btn-primary { @apply px-4 py-2 rounded-xl text-sm font-semibold text-white ...; }
  .input-field { @apply w-full px-3 py-2 rounded-xl border border-gray-200 ...; }
  .label { @apply block text-xs font-medium text-gray-600 mb-1; }
}
```

### Commits

Usar [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: adiciona exportação de dados em JSON
fix: corrige ordenação de refeições ao trocar idioma
chore: atualiza dependências
test: cobre exclusão de contatos de saúde
docs: adiciona guia de desenvolvimento
```

---

## Deploy detalhado

O deploy usa o pacote `gh-pages` que empacota o conteúdo de `dist/` e força-pusha para a branch `gh-pages` do repositório:

```
npm run deploy
  └── gh-pages -d dist
        ├── npm run build  (via "predeploy" — se configurado)
        ├── git add dist/**
        ├── git commit -m "Updates"
        └── git push origin gh-pages --force
```

O GitHub Pages está configurado para servir da branch `gh-pages`, raiz `/`.

### Configurações críticas para GitHub Pages

| Arquivo | Configuração | Motivo |
|---|---|---|
| `vite.config.ts` | `base: '/crianca-saudavel/'` | Assets com path correto |
| `vite.config.ts` | `scope: '/crianca-saudavel/'` | Service worker no subdiretório |
| `vite.config.ts` | `start_url: '/crianca-saudavel/'` | PWA abre no path correto |

> Sem o `base` correto, os assets JS/CSS teriam paths absolutos (`/assets/...`) que não existem no GitHub Pages.

---

## Diagnóstico de problemas comuns

| Problema | Causa provável | Solução |
|---|---|---|
| App em branco após deploy | `base` incorreto no Vite | Verificar `vite.config.ts` |
| PWA não instala | `scope`/`start_url` errados | Verificar manifest no DevTools → Application |
| localStorage cheio | Muitas fotos sem comprimir | `compressFile()` já limita a 1600 px |
| Testes falham localmente | Servidor dev não está rodando | `npm run dev` antes de `pytest` |
| Testes lentos | Timeout padrão de 15s | Ajustar em `tests/e2e/conftest.py` |
| Tradução faltando | Chave ausente em um idioma | Verificar `translations.ts` para os 3 idiomas |
| Ordenação incorreta de refeições ao trocar idioma | Chave de refeição salva como string localizada | Usar chaves invariantes (`'lunch'`) em vez de display strings |
