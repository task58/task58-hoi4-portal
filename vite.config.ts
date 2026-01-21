import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteStaticCopy } from 'vite-plugin-static-copy'

// https://vite.dev/config/
export default defineConfig(() => {
  // Cloudflare Pages用にルートパスを使用
  const base = '/';

  return {
    base,
    build: {
      outDir: 'dist',
    },
    plugins: [
      react({
        babel: {
          plugins: [['babel-plugin-react-compiler']],
        },
      }),
      viteStaticCopy({
        targets: [
          {
            src: 'pages',
            dest: '',
          },
        ],
      }),
    ],
  };
});
