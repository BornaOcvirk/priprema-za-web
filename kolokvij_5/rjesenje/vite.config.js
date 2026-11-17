import { resolve } from 'path'

export default {
  root: resolve(import.meta.dirname, 'src'),
  server: {
    port: 8080,
    proxy: {
      "/api": "http://localhost:3000"
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        silenceDeprecations: ['import', 'color-functions', 'global-builtin', 'if-function'],
      },
    },
  },
}
