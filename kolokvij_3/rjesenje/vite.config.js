import { resolve } from 'path'

export default {
  root: resolve(import.meta.dirname, 'src'),
  build: {
    outDir: '../dist',
    rollupOptions: {
      input: {
        index: resolve(import.meta.dirname, 'src/index.html'),
        another: resolve(import.meta.dirname, 'src/another.html')
      },
    }
  },
  server: {
    port: 8080,
    proxy: {
      "/api": "http://localhost:3000"
    }
  },
  css: {
     preprocessorOptions: {
        scss: {
          silenceDeprecations: [
            'import',
            'color-functions',
            'global-builtin',
            'if-function',
          ],
        },
     },
  },
}
