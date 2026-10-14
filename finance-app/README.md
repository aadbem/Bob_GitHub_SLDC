# finance-app

Painel de mercado que compara IBM e concorrentes (Microsoft, Oracle, SAP e Salesforce) usando Yahoo Finance via um BFF em Node.

## Estrutura

```
finance-app/
├─ package.json            # scripts e dependências
├─ package-lock.json       # lockfile gerado pelo npm ci
├─ .nvmrc                  # Node 22 (igual ao CI)
├─ tsconfig.json
├─ vite.config.ts          # proxy /api -> 127.0.0.1:3001 + vitest
├─ eslint.config.js
├─ .env.example            # PORT e MARKET_PROVIDER
├─ index.html
├─ shared/                 # tipos e config compartilhados (cliente + servidor)
│  ├─ types.ts             # Range, Quote, SeriesPoint, SeriesDTO, QuoteResult, ApiError
│  └─ companies.ts         # lista de até 5 símbolos (IBM + 4 concorrentes)
├─ server/                 # BFF (bind só em 127.0.0.1)
│  ├─ index.ts             # bootstrap
│  ├─ app.ts               # rotas e middlewares
│  ├─ routes/market.ts     # GET /api/market/quotes e /api/market/history
│  ├─ providers/
│  │  ├─ MarketDataProvider.ts  # interface do provedor
│  │  ├─ fixtureProvider.ts     # dados offline/determinísticos
│  │  └─ yahooProvider.ts       # Yahoo Finance (yahoo-finance2)
│  ├─ domain/
│  │  ├─ validation.ts  # allowlist de símbolos e ranges
│  │  ├─ ranges.ts      # janela -> período/intervalo/TTL
│  │  └─ normalize.ts   # bruto -> SeriesDTO
│  ├─ cache.ts          # TTL em memória
│  └─ errors.ts         # erros tipados -> respostas genéricas
├─ src/                   # cliente React (Vite)
│  ├─ main.tsx
│  ├─ index.css
│  ├─ api/                # camada de serviço (fetch com timeout + marketApi)
│  │  ├─ client.ts
│  │  └─ marketApi.ts
│  ├─ hooks/              # TanStack Query
│  │  ├─ useQuotes.ts
│  │  └─ useHistory.ts
│  ├─ domain/             # cálculos puros
│  │  ├─ metrics.ts      # variação %, rebase, ranking
│  │  └─ format.ts       # moeda, %, datas
│  ├─ components/
│  │  ├─ layout/          # Header
│  │  ├─ controls/        # RangeTabs
│  │  ├─ summary/         # SummaryCard, SummaryCardGrid, RankingTable
│  │  ├─ charts/          # ComparisonChart, CompanyChartCard
│  │  └─ feedback/        # LoadingState, ErrorState, PartialDataBanner, ErrorBoundary
│  ├─ pages/DashboardPage.tsx
│  └─ test/               # setup de testes
└─ README.md
```

## Como rodar localmente

```bash
# 1. Entre na pasta da aplicação
cd finance-app

# 2. Instale as dependências (usa o lockfile para instalação reproduzível)
npm ci

# 3. Rode o cliente (Vite) e o servidor BFF em paralelo, em modo offline/fixture
MARKET_PROVIDER=fixture npm run dev

# O cliente fica disponível em: http://localhost:5173
# O servidor BFF fica disponível em: http://127.0.0.1:3001

# Para usar o Yahoo Finance real (requer rede), rode apenas:
npm run dev
```

### Passo a passo resumido

1. `cd finance-app`
2. `npm ci`
3. `MARKET_PROVIDER=fixture npm run dev`
4. Abra o navegador em `http://localhost:5173`

### Comandos de validação

```bash
npm run lint        # 0 erros e 0 warnings
npm run typecheck   # tsc --noEmit
npm test            # vitest (sem rede)
npm run build       # build de produção do cliente
npm run preview     # preview do build de produção
```

### Variáveis de ambiente

Copie `.env.example` para `.env` (não commitado):

```
PORT=3001
MARKET_PROVIDER=fixture   # yahoo | fixture
```

- `fixture`: dados determinísticos, sem rede (recomendado para demos e CI).
- `yahoo`: consulta o Yahoo Finance via `yahoo-finance2`.

## Endpoints da API (BFF)

- `GET /api/market/quotes?symbols=IBM,MSFT,ORCL,SAP,CRM`
- `GET /api/market/history?symbols=IBM,MSFT&range=1d|7d|3m`

O BFF binda apenas em `127.0.0.1`, nunca `0.0.0.0`.

## Testes

Os testes nunca chamam a rede. O servidor usa `FixtureProvider` injetado; o cliente usa MSW.

## Extensões previstas

- Nova empresa: adicionar uma linha em `shared/companies.ts`.
- Novo range: adicionar entrada em `server/domain/ranges.ts` e uma aba em `RangeTabs`.
- Gráfico por ticker escolhido: reutilizar `CompanyChartCard` + `useHistory`.
- Troca de fonte de dados: novo `MarketDataProvider`.
