import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { generateTailwind } from './scripts/build-tailwind.mjs'

const sourceDirectory = path.join(path.dirname(fileURLToPath(import.meta.url)), 'src')

function tailwindSourceWatcher() {
  return {
    name: 'quest-tailwind-source-watcher',
    configureServer(server) {
      let timer
      server.watcher.on('change', (file) => {
        if (!file.startsWith(`${sourceDirectory}${path.sep}`) || !/\.(js|jsx)$/.test(file)) return
        clearTimeout(timer)
        timer = setTimeout(async () => {
          await generateTailwind()
        }, 80)
      })
    },
  }
}

const repo = process.env.GITHUB_REPOSITORY ? process.env.GITHUB_REPOSITORY.split('/')[1] : ''
const isRootPage = repo.endsWith('.github.io')
const appBase = process.env.GITHUB_ACTIONS === 'true'
  ? (isRootPage ? '/' : `/${repo || 'sitquest'}/`)
  : '/'

export default defineConfig({
  // Use the repository subpath on GitHub Pages; keep local development at /.
  base: appBase,
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    tailwindcss(),
    tailwindSourceWatcher(),
  ],
})
