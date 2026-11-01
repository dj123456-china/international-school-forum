import { readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const dist = resolve(root, 'dist')
let html = await readFile(resolve(dist, 'index.html'), 'utf8')

// The Vite entry is for HTTP; the standalone page runs without a server.
html = html.replace(/<script\b[^>]*id="local-file-entry"[^>]*>[\s\S]*?<\/script>/, '')
const scripts = [...html.matchAll(/<script\b[^>]*src="([^"]+)"[^>]*><\/script>/g)]
const styles = [...html.matchAll(/<link\b[^>]*rel="stylesheet"[^>]*href="([^"]+)"[^>]*>/g)]
if (scripts.length !== 1 || styles.length !== 1) {
  throw new Error('Expected one JavaScript bundle and one stylesheet for the local preview.')
}

async function readAsset(path) {
  const asset = resolve(dist, path)
  if (!asset.startsWith(dist + sep)) throw new Error('Preview asset must be inside dist.')
  return readFile(asset, 'utf8')
}

const js = (await readAsset(scripts[0][1])).replace(/<\/script/gi, '<\\/script')
const css = (await readAsset(styles[0][1]))
  // Local preview uses system font fallbacks and makes no font requests.
  .replace(/@import\s+(?:url\([^)]*\)|"[^"]*"|'[^']*')[^;]*;/g, '')
  .replace(/<\/style/gi, '<\\/style')
html = html.replace(scripts[0][0], '')
html = html.replace(styles[0][0], () => `<style>${css}</style>`)
html = html.replace('</body>', () => `<script>${js}</script></body>`)
await writeFile(resolve(root, 'preview.html'), html)
await writeFile(resolve(dist, 'preview.html'), html)
console.log('Local preview generated: preview.html')
