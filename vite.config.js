import { defineConfig } from 'vite';
import { resolve } from 'path';
import fs from 'fs';
import path from 'path';
import vue from '@vitejs/plugin-vue';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { VantResolver } from '@vant/auto-import-resolver';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';

// Helper to find all html files
function getHtmlEntries(dir) {
  const entries = {};
  
  function traverse(currentDir) {
    const files = fs.readdirSync(currentDir);
    
    for (const file of files) {
      const filePath = path.join(currentDir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        traverse(filePath);
      } else if (file.endsWith('.html')) {
        const name = path.relative(__dirname, filePath).replace(/\.html$/, '').replace(/\//g, '_');
        entries[name] = filePath;
      }
    }
  }
  
  traverse(dir);
  return entries;
}

const input = getHtmlEntries(resolve(__dirname, 'src'));

console.log('Detected HTML entries:', input);

export default defineConfig({
  root: 'src',
  publicDir: '../public',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: input
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  plugins: [
    vue(),
    AutoImport({
      imports: ['vue', 'vue-router', 'pinia'],
      resolvers: [ElementPlusResolver()],
      dts: false, // Turn off dts generation for JS project
    }),
    Components({
      resolvers: [
        VantResolver(),
        ElementPlusResolver()
      ],
      dts: false,
    }),
  ],
  server: {
    host: '0.0.0.0',
    port: 3000
  }
});
