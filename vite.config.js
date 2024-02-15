import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'
import react from '@vitejs/plugin-react-swc'
import svgr from "vite-plugin-svgr";
import legacy from '@vitejs/plugin-legacy'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    legacy(),
    react(),
    svgr()
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    open: true,
    proxy: {
      //配置跨域
      '/api': {
        target: 'http://127.0.0.1:11419/',
        changeOrigin: true
      },
      '/rec_file': {
        target: 'http://127.0.0.1:11419/',
        changeOrigin: true
      }
    }
  },
})
