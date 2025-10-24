import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        circuit: resolve(__dirname, 'circuit.html'),
        lewis: resolve(__dirname, 'lewis.html'),
      },
    },
  },
});
