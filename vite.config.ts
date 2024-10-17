import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// svg
import {createSvgIconsPlugin} from "vite-plugin-svg-icons";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    createSvgIconsPlugin({
      iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
      symbolId: 'icon-[dir]-[name]',
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        // api: 'modern-compiler',
        silenceDeprecations: ['legacy-js-api'],
        javascriptEnabled: true,
        additionalData: '@import "./src/style/variable.scss";',
      }
    }
  }
})
