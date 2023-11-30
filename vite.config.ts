import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  base: "./",
  plugins: [vue()],
  resolve:{alias:[{find:"@",replacement:path.resolve(__dirname,"./src")}, ]},
  server: {
    port: 5173,
    open: true,
    // 代理
    proxy: {
      // '/api': {
      //   target: 'http://192.168.8.170:5000/api/WCS3D',
      //   changeOrigin: true,
      //   rewrite: path => path.replace(/^\/api/,  '')
      // },
    }
  }
})
