import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { defineConfig } from 'vite'
import path from 'node:path'
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

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    tailwindSourceWatcher(),
  ],
})
