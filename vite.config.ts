import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { cmsPublishPlugin } from './vite.cms-plugin.ts'

const dirname =
  typeof __dirname !== 'undefined'
    ? __dirname
    : path.dirname(fileURLToPath(import.meta.url))

// Keep this file free of Storybook/Vitest/Playwright imports so Cloudflare
// Pages can build without installing browser tooling.
export default defineConfig({
  plugins: [react(), tailwindcss(), cmsPublishPlugin(dirname)],
  resolve: {
    alias: {
      '@': path.resolve(dirname, './src'),
    },
  },
})
