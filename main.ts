import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';
const sourceRoot = fileURLToPath(new URL('.', import.meta.url));
const destination = path.resolve(process.env.MAKEFUN_OUTPUT_DIR || '/output');
if (destination === sourceRoot.replace(/\/$/, '')) throw new Error('Output must differ from source');
fs.mkdirSync(destination, { recursive: true });
for (const folder of ['game', 'screenshots']) {
  fs.cpSync(path.join(sourceRoot, folder), path.join(destination, folder), { recursive: true });
}
const payload = buildDossier(destination, {
  text_max_bytes: 160 * 1024,
  screenshots: { max: 4, max_bytes: 256 * 1024 },
  game_max_files: 993,
  game_max_bytes: 48 * 1024 * 1024,
  game_path_max_bytes: 1000
});
fs.writeFileSync(path.join(destination, 'dossier.json'), payload);
