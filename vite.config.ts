import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import { readFileSync } from 'fs'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // package.jsonのhomepageからベースパスを抽出
  let base = '/';
  
  if (mode === 'production') {
    try {
      const pkgPath = resolve(__dirname, 'package.json');
      const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
      if (pkg.homepage) {
        const url = new URL(pkg.homepage);
        base = url.pathname;
      }
    } catch (err) {
      console.warn('Could not read homepage from package.json, using root path');
    }
  }

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
