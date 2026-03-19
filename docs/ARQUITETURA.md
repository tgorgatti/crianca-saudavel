# Arquitetura — Criança Saudável

## Visão geral

O app é uma **Single Page Application (SPA)** React totalmente client-side. Não existe backend: todo o estado é gerenciado em memória via React Context e persiste no `localStorage` do navegador.

```
┌─────────────────────────────────────────────┐
│                  Browser                    │
│                                             │
│  ┌──────────────┐     ┌──────────────────┐  │
│  │  React SPA   │────▶│  localStorage    │  │
│  │  (Vite/TSX)  │◀────│  (cs_* keys)     │  │
│  └──────┬───────┘     └──────────────────┘  │
│         │                                   │
│  ┌──────▼───────┐                           │
│  │ Service Worker│  (Workbox — offline)     │
│  └──────────────┘                           │
└─────────────────────────────────────────────┘
         │  static assets
┌────────▼────────┐
│  GitHub Pages   │
│  /crianca-      │
│   saudavel/     │
└─────────────────┘
```

---

## Árvore de componentes

```
App
├── ErrorBoundary           ← captura erros de renderização
└── div.flex.h-screen
    ├── Sidebar             ← navegação, seletor de criança, idioma
    └── MainContent         ← renderiza a seção ativa
        ├── ChildProfile
        ├── MedicalAgenda
        │   ├── CalendarView
        │   ├── AppointmentCard
        │   └── EditModal
        ├── PrescriptionsExams
        │   ├── FileCard
        │   └── FileModal
        ├── GrowthCurve     ← LineChart (Recharts)
        ├── FoodRoutine
        ├── VaccineHistory
        │   └── CardViewer  ← modal da carteira de vacinação
        └── HealthContacts
```

---

## Fluxo de dados

```
Ação do usuário
      │
      ▼
 Componente (estado local: useState)
      │
      │ chama função do contexto
      ▼
 AppContext.tsx
  ├── atualiza estado React (useState)
  └── persiste no localStorage (useEffect)
      │
      ▼
 Componente re-renderiza com novos dados
```

### AppContext — responsabilidades

`src/context/AppContext.tsx` é o único ponto de verdade do estado global. Ele:

1. Inicializa o estado lendo do `localStorage` (hidratação síncrona no `useState` initializer)
2. Registra um `useEffect` que serializa e salva no `localStorage` a cada mudança
3. Expõe funções CRUD para cada entidade (`addChild`, `updateAppointment`, `deleteVaccine`, etc.)
4. Expõe o objeto `t` (traduções) com base no `language` selecionado

---

## Modelo de dados

Todas as interfaces estão em `src/types/index.ts`.

```
Child
  id: string (uuid)
  name: string
  birthDate: string  (YYYY-MM-DD)
  photoData: string | null  (data URL comprimida)

Appointment
  id, childId, date, time, location, notes

MedicalFile
  id, childId, name
  fileType: 'prescription' | 'exam'
  fileData: string  (data URL — imagem ou PDF base64)
  mimeType, date, notes

GrowthRecord
  id, childId, date
  weight: number | null  (kg)
  height: number | null  (cm)

FoodEntry
  id, childId, date
  mealType: string  (chave invariante: 'breakfast', 'lunch', etc.)
  description, acceptance, notes

Vaccine
  id, childId, name
  scheduledDate, appliedDate
  status: 'applied' | 'pending'
  reactions, notes

HealthContact
  id, name, specialty, phone, email, address, notes

VaccinationCard
  childId, fileData, mimeType, uploadDate
```

---

## Sistema de internacionalização (i18n)

```
src/i18n/
├── translations.ts   ← objeto com todas as strings em pt-BR, en, es
└── index.tsx         ← LanguageProvider + hook useTranslation
```

O idioma ativo é armazenado em `AppContext` e persistido em `cs_language`. O objeto `t` (traduções) é derivado via `useMemo` e passado pelo contexto — todos os componentes consomem `t` via `useApp()`.

Strings com parâmetros são implementadas como funções:

```ts
birthdayDays: (n: number) => `em ${n} dias`
```

### Chaves invariantes em FoodRoutine

Os tipos de refeição são salvos como chaves estáveis (`'breakfast'`, `'morning_snack'`, etc.) para que a ordenação cronológica funcione independentemente do idioma selecionado. A tradução acontece apenas na renderização.

---

## Compressão de arquivos

`src/utils/compress.ts` usa a **Canvas API** do navegador para redimensionar e re-codificar imagens antes de salvá-las no `localStorage`:

```
Arquivo selecionado
      │
      ▼
 file.type.startsWith('image/')?
  ├── Não → lê como data URL diretamente (PDF)
  │          └── tamanho > 4 MB? → lança erro
  └── Sim → createImageBitmap()
              │
              ▼
         dimensões > 1600 px?
          └── Sim → escala proporcional até 1600 px
              │
              ▼
         canvas.toDataURL(outputMime, 0.82)
              │
              ▼
         retorna { data, mime, originalSize, compressedSize }
```

**Constantes:**

| Constante | Valor | Propósito |
|---|---|---|
| `MAX_IMAGE_PX` | 1600 | Dimensão máxima (px) de qualquer lado |
| `IMAGE_QUALITY` | 0.82 | Qualidade JPEG (0–1) |
| `MAX_FILE_BYTES` | 4 MB | Limite para PDFs (sem compressão) |

---

## PWA e Service Worker

Configurado em `vite.config.ts` via `vite-plugin-pwa` (Workbox):

| Estratégia | Aplicada a |
|---|---|
| `precache` | Todos os assets do build (JS, CSS, HTML, PNG) |
| `CacheFirst` | Fontes Google (1 ano de TTL) |

O `scope` e `start_url` do manifest apontam para `/crianca-saudavel/` para compatibilidade com GitHub Pages (subdiretório).

O service worker é registrado automaticamente (`registerType: 'autoUpdate'`) e atualizado silenciosamente quando uma nova versão é publicada.

---

## Code splitting

O bundle de produção é dividido em 4 chunks independentes para carregamento paralelo e cache eficiente:

| Chunk | Conteúdo | Tamanho (gzip) |
|---|---|---|
| `vendor-react` | react + react-dom | ~0.08 kB |
| `vendor-recharts` | recharts | ~149 kB |
| `vendor-motion` | framer-motion | ~40 kB |
| `index` | código da aplicação | ~25 kB |

---

## Error Boundary

`App.tsx` envolve toda a aplicação com um `ErrorBoundary` (class component):

```
getDerivedStateFromError → hasError: true
componentDidCatch        → console.error (sem serviço externo)
render (fallback)        → card com mensagem + botão "Tentar novamente"
```

O botão de retry reseta `hasError` para `false`, permitindo que o React tente renderizar novamente sem recarregar a página.
