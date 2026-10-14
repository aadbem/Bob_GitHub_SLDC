# Resumo da Task — Estrutura da Aplicação React `finance-app`

## Objetivo
Criar uma estrutura simples de aplicação React para o repositório, com base no [`plano-de-implementacao.md`](plano-de-implementacao.md), incluindo:

- Página de dashboard
- Componentes reutilizáveis de cards de gráficos
- Camada de serviço para dados financeiros
- Organização de pastas limpa, adequada para futuras expansões

## O que foi implementado

### Configuração raiz (`finance-app/`)
- [`package.json`](finance-app/package.json) — scripts `dev`, `dev:client`, `dev:server`, `lint`, `typecheck`, `test`, `build`; dependências React 19, Vite, Recharts, TanStack Query, `yahoo-finance2`, Express, vitest, MSW, ESLint, TypeScript
- [`tsconfig.json`](finance-app/tsconfig.json) — strict mode, caminhos `src/`, `server/`, `shared/`
- [`vite.config.ts`](finance-app/vite.config.ts) — proxy `/api` → `127.0.0.1:3001`
- [`vitest.config.ts`](finance-app/vitest.config.ts) — jsdom, globals, setup de testes
- [`eslint.config.js`](finance-app/eslint.config.js) — ReScript + React hooks
- [`.nvmrc`](finance-app/.nvmrc) — Node 22 (alinhado ao CI)
- [`index.html`](finance-app/index.html), [`.env.example`](finance-app/.env.example) (`PORT=3001`, `MARKET_PROVIDER=fixture`)

### Camada compartilhada (`shared/`)
- [`types.ts`](finance-app/shared/types.ts) — `Range`, `Quote`, `SeriesPoint`, `SeriesDTO`, `QuoteResult`, `ApiError`
- [`companies.ts`](finance-app/shared/companies.ts) — lista de até 5 símbolos (IBM, MSFT, ORCL, SAP, CRM) com validação de limite

### Servidor BFF (`server/`)
- [`index.ts`](finance-app/server/index.ts) — bootstrap, bind apenas em `127.0.0.1`, graceful shutdown
- [`app.ts`](finance-app/server/app.ts) — Express + CORS, rota `/health`, injeção do provedor
- [`routes/market.ts`](finance-app/server/routes/market.ts) — `GET /api/market/quotes`, `GET /api/market/history`, validação de allowlist, handler de erros genérico (sem stack trace)
- [`providers/MarketDataProvider.ts`](finance-app/server/providers/MarketDataProvider.ts) — interface do provedor
- [`providers/fixtureProvider.ts`](finance-app/server/providers/fixtureProvider.ts) — dados offline/determinísticos (modo demo)
- [`providers/yahooProvider.ts`](finance-app/server/providers/yahooProvider.ts) — Yahoo Finance via `yahoo-finance2`
- [`domain/validation.ts`](finance-app/server/domain/validation.ts) — allowlist de símbolos/ranges, máximo 5 por requisição
- [`domain/ranges.ts`](finance-app/server/domain/ranges.ts) — janela → período/intervalo/TTL
- [`domain/normalize.ts`](finance-app/server/domain/normalize.ts) — bruto → `SeriesDTO` (descarta nulls, ordena)
- [`cache.ts`](finance-app/server/cache.ts) — TTL em memória
- [`errors.ts`](finance-app/server/errors.ts) — erros tipados → respostas genéricas

### Cliente React (`src/`)
- [`api/client.ts`](finance-app/src/api/client.ts) — fetch com `AbortSignal` e timeout de 15s
- [`api/marketApi.ts`](finance-app/src/api/marketApi.ts) — `getQuotes()`, `getHistory()`
- [`hooks/useQuotes.ts`](finance-app/src/hooks/useQuotes.ts), [`hooks/useHistory.ts`](finance-app/src/hooks/useHistory.ts) — TanStack Query
- [`domain/metrics.ts`](finance-app/src/domain/metrics.ts) — variação %, rebase em 0%, ranking (funções puras)
- [`domain/format.ts`](finance-app/src/domain/format.ts) — moeda, %, datas por range
- `components/layout/Header.tsx`
- `components/controls/RangeTabs.tsx` — 1D / 7D / 3M
- `components/summary/SummaryCard.tsx`, [`SummaryCardGrid.tsx`](finance-app/src/components/summary/SummaryCardGrid.tsx), [`RankingTable.tsx`](finance-app/src/components/summary/RankingTable.tsx)
- `components/charts/ComparisonChart.tsx`, [`CompanyChartCard.tsx`](finance-app/src/components/charts/CompanyChartCard.tsx) — Recharts, linhas rebaseadas, IBM em destaque
- `components/feedback/LoadingState.tsx`, [`ErrorState.tsx`](finance-app/src/components/feedback/ErrorState.tsx), [`PartialDataBanner.tsx`](finance-app/src/components/feedback/PartialDataBanner.tsx), [`ErrorBoundary.tsx`](finance-app/src/components/feedback/ErrorBoundary.tsx)
- [`pages/DashboardPage.tsx`](finance-app/src/pages/DashboardPage.tsx) — orquestra range (espelhado em `?range=`), hooks, cards, gráfico comparativo, ranking, estados de loading/erro/falha parcial
- [`main.tsx`](finance-app/src/main.tsx), [`index.css`](finance-app/src/index.css)
- [`test/setup.ts`](finance-app/src/test/setup.ts), [`domain/metrics.test.ts`](finance-app/src/domain/metrics.test.ts) — 4 testes de unidade

### Documentação e processo
- [`README.md`](finance-app/README.md) — estrutura, como rodar localmente, variáveis de ambiente, endpoints, validações, extensões previstas
- [`.gitignore`](.gitignore) na raiz — `node_modules`, `.env*`, `dist`, `build`, `coverage`, logs
- [`finance-app/README.md`](finance-app/README.md) — guia completo de execução e contribuição

### Ajustes fora de `finance-app/`
- [`.github/workflows/finance-app-ci.yml`](.github/workflows/finance-app-ci.yml) — `working-directory: finance-app`, `npm ci`, `lint`, `test`, `typecheck`, `build`, `npm audit --audit-level=high`, actions pinados por SHA, `cache-dependency-path` no `package-lock.json`
- [`.github/PULL_REQUEST_TEMPLATE.md`](.github/PULL_REQUEST_TEMPLATE.md) — comandos de validação atualizados para `finance-app/`

## Como rodar localmente

```bash
cd finance-app
npm ci
MARKET_PROVIDER=fixture npm run dev
```

- Cliente: `http://localhost:5173`
- Servidor BFF: `http://127.0.0.1:3001`

Modo `fixture` = dados offline (sem rede). Para Yahoo real: `npm run dev`.

## Validações (todas verdes)
- `npm run typecheck` — `tsc --noEmit` sem erros
- `npm run lint` — 0 erros, 0 warnings
- `npm test` — 4 testes passam (vitest, sem rede)
- `npm run build` — build de produção OK

## Extensões previstas (conforme o plano)
- Nova empresa: editar uma linha em `shared/companies.ts`
- Novo range: entrada em `server/domain/ranges.ts` + aba em `RangeTabs`
- Gráfico por ticker escolhido: reutilizar `CompanyChartCard` + `useHistory`
- Troca de fonte de dados: novo `MarketDataProvider`
