import { createApp } from './app.js';

const PORT = Number(process.env.PORT) || 3001;

const app = createApp();

const server = app.listen(PORT, '127.0.0.1', () => {
  void console.log(`BFF escutando em http://127.0.0.1:${PORT}`);
});

const signals: NodeJS.Signals[] = ['SIGTERM', 'SIGINT'];
for (const signal of signals) {
  process.on(signal, () => {
    server.close(() => {
      process.exit(0);
    });
  });
}
