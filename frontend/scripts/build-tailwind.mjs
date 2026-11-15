import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { compile } from '@tailwindcss/node'
import { Scanner } from '@tailwindcss/oxide'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

export async function generateTailwind() {
  const input = path.join(root, 'src', 'index.css')
  const output = path.join(root, 'src', 'tailwind.generated.css')
  const source = await readFile(input, 'utf8')
  const compiler = await compile(source, {
    base: root,
    from: input,
    onDependency: () => {},
  })
  const scanner = new Scanner({
    sources: [
      ...compiler.sources,
      { base: path.join(root, 'src'), pattern: '**/*.{js,jsx}', negated: false },
    ],
  })
  await writeFile(output, compiler.build(scanner.scan()))
  console.log(`Generated Tailwind utilities from ${scanner.scannedFiles.length} source files.`)
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await generateTailwind()
}
