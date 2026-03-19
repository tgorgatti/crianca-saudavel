# Criança Saudável

Aplicativo PWA para acompanhamento completo do desenvolvimento infantil. Combina uma estética acolhedora com funcionalidades robustas de persistência de dados — tudo salvo localmente no navegador, sem necessidade de conta ou servidor.

**Demo ao vivo:** [tgorgatti.github.io/crianca-saudavel](https://tgorgatti.github.io/crianca-saudavel/)

---

## Funcionalidades

| Seção | Descrição |
|---|---|
| **Perfil** | Até 5 crianças com foto, nome, data de nascimento e cálculo automático de idade |
| **Agenda Médica** | Calendário mensal com consultas passadas e futuras, modal de edição com observações persistentes |
| **Receitas e Exames** | Arquivo de imagens e PDFs com visualização em modal e download direto |
| **Curva de Crescimento** | Gráficos de peso e altura (Recharts) com tabela de histórico e exclusão individual |
| **Rotina Alimentar** | Diário de refeições com tipo, descrição, aceitação e observações |
| **Vacinas** | Controle de vacinas aplicadas e pendentes, progresso em percentual, carteira de vacinação em PDF/imagem |
| **Contatos de Saúde** | Cadastro de profissionais com nome, especialidade, telefone, e-mail e endereço |

### Recursos técnicos

- **PWA** — instalável em Android, iOS e desktop, funciona offline
- **Internacionalização** — interface disponível em Português Brasileiro, Inglês e Espanhol
- **Persistência total** — todos os dados (incluindo imagens e PDFs) ficam no `localStorage`; nada se perde ao fechar o navegador
- **Compressão automática** — imagens são redimensionadas e comprimidas antes de salvar (máx. 1600 px, qualidade 82 %)
- **Responsivo** — layout adaptável para mobile e desktop
- **Error Boundary** — tela de fallback amigável em caso de erro de renderização

---

## Stack

| Camada | Tecnologia |
|---|---|
| Framework | React 18 + TypeScript |
| Build | Vite 5 |
| Estilo | Tailwind CSS 3 |
| Gráficos | Recharts 2 |
| Animações | Framer Motion 11 |
| Ícones | Lucide React |
| PWA | vite-plugin-pwa (Workbox) |
| Deploy | GitHub Pages via gh-pages |
| Testes | Playwright + pytest |

---

## Início rápido

### Pré-requisitos

- Node.js 18+
- npm 9+

### Instalação

```bash
npm install
```

### Desenvolvimento

```bash
npm run dev
```

Acesse `http://localhost:5173/crianca-saudavel/`

### Build de produção

```bash
npm run build
```

Os arquivos gerados ficam em `dist/`.

### Preview do build

```bash
npm run preview
```

### Deploy para GitHub Pages

```bash
npm run deploy
```

> Requer que a branch `gh-pages` já exista no repositório e que o GitHub Pages esteja configurado para servi-la.

---

## Estrutura do projeto

```
crianca-saudavel/
├── public/
│   ├── pwa-192x192.png        # Ícone PWA 192×192
│   ├── pwa-512x512.png        # Ícone PWA 512×512
│   └── apple-touch-icon.png   # Ícone iOS 180×180
│
├── src/
│   ├── App.tsx                # Raiz do app + Error Boundary
│   ├── main.tsx               # Entry point React
│   ├── index.css              # Estilos globais + utilitários Tailwind
│   │
│   ├── components/
│   │   ├── Sidebar.tsx        # Navegação lateral + seletor de criança + idioma
│   │   ├── ChildProfile.tsx   # Perfil, foto e dados da criança
│   │   ├── MedicalAgenda.tsx  # Calendário e gestão de consultas
│   │   ├── PrescriptionsExams.tsx  # Receitas e exames (upload/visualização)
│   │   ├── GrowthCurve.tsx    # Gráficos de crescimento
│   │   ├── FoodRoutine.tsx    # Diário alimentar
│   │   ├── VaccineHistory.tsx # Histórico de vacinas + carteira
│   │   ├── HealthContacts.tsx # Contatos de saúde
│   │   └── FileModal.tsx      # Modal de visualização de arquivos
│   │
│   ├── context/
│   │   └── AppContext.tsx     # Estado global (React Context + localStorage)
│   │
│   ├── i18n/
│   │   ├── translations.ts    # Strings em pt-BR, en e es
│   │   └── index.tsx          # Provider e hook useTranslation
│   │
│   ├── types/
│   │   └── index.ts           # Interfaces TypeScript (Child, Appointment, etc.)
│   │
│   └── utils/
│       └── compress.ts        # Compressão de imagens via Canvas API
│
├── tests/
│   └── e2e/
│       ├── conftest.py        # Fixtures Playwright (viewport, timeout)
│       └── test_app.py        # 39 testes E2E cobrindo todas as seções
│
├── index.html                 # Entry HTML com meta tags SEO e PWA
├── vite.config.ts             # Config Vite + PWA + code splitting
├── tailwind.config.js         # Config Tailwind
├── tsconfig.json              # Config TypeScript
└── package.json               # Dependências e scripts
```

---

## Persistência de dados

Todos os dados são armazenados no `localStorage` do navegador sob chaves com prefixo `cs_`:

| Chave | Conteúdo |
|---|---|
| `cs_children` | Lista de crianças (nome, nascimento, foto comprimida) |
| `cs_appointments` | Consultas médicas |
| `cs_medical_files` | Receitas e exames (base64) |
| `cs_growth` | Registros de peso e altura |
| `cs_food` | Entradas do diário alimentar |
| `cs_vaccines` | Vacinas aplicadas e pendentes |
| `cs_contacts` | Contatos de saúde |
| `cs_vaccination_cards` | Carteiras de vacinação (base64) |
| `cs_language` | Idioma selecionado |

> O `localStorage` suporta tipicamente 5–10 MB por origem. A compressão automática de imagens mantém o uso dentro desse limite.

---

## Internacionalização

O idioma é selecionado pelo usuário no sidebar e persistido no `localStorage`. Todas as strings da interface estão centralizadas em `src/i18n/translations.ts`.

**Idiomas suportados:**

| Código | Idioma |
|---|---|
| `pt-BR` | Português Brasileiro (padrão) |
| `en` | English |
| `es` | Español |

Para adicionar um novo idioma, basta incluir uma nova entrada no objeto `translations` em `src/i18n/translations.ts` e adicionar a opção no seletor do `Sidebar.tsx`.

---

## Testes

Os testes E2E utilizam **Playwright** (Python) e cobrem todas as funcionalidades do app.

### Configuração do ambiente de teste

```bash
python -m venv .venv
.venv\Scripts\activate        # Windows
pip install playwright pytest pytest-playwright
playwright install chromium
```

### Executar todos os testes

```bash
pytest tests/e2e/test_app.py -v
```

### Executar contra o ambiente de produção

Altere temporariamente o `BASE_URL` em `tests/e2e/test_app.py`:

```python
BASE_URL = "https://tgorgatti.github.io/crianca-saudavel/"
```

### Cobertura dos testes (39 casos)

| Classe | Casos |
|---|---|
| `TestPerfil` | Carregamento, cadastro, idade, edição, exclusão, resumo |
| `TestAgendaMedica` | Seção, calendário, navegação, adicionar, exibir, excluir |
| `TestCurvaCrescimento` | Seção, medição, gráfico, histórico, excluir |
| `TestRotinaAlimentar` | Seção, refeição, aceitação, selecionar, excluir |
| `TestVacinas` | Seção, BCG, contador, toggle, excluir, filtro |
| `TestContatosSaude` | Seção, adicionar, tel link, email link, excluir |
| `TestPersistencia` | Perfil, consulta e contato após reload |
| `TestNavegacao` | Todas as seções, mobile, desktop |

---

## PWA — Instalação no dispositivo

O app pode ser instalado diretamente pelo navegador:

- **Android (Chrome):** banner automático ou menu "Adicionar à tela inicial"
- **iOS (Safari):** botão Compartilhar → "Adicionar à Tela de Início"
- **Desktop (Chrome/Edge):** ícone de instalação na barra de endereço

Após instalado, o app funciona **offline** — o service worker (Workbox) faz cache de todos os assets no primeiro acesso.

---

## Licença

Projeto privado — todos os direitos reservados.
