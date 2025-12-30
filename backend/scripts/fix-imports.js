import { readdir, readFile, writeFile } from 'fs/promises';
import { join, extname } from 'path';

async function* getFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* getFiles(path);
    } else if (entry.isFile() && extname(entry.name) === '.js') {
      yield path;
    }
  }
}

async function fixImports() {
  const distDir = 'dist';
  let filesProcessed = 0;

  for await (const file of getFiles(distDir)) {
    let content = await readFile(file, 'utf-8');
    let modified = false;

    // Fix side-effect imports: import './file'
    const sideEffectImportRegex = /(import\s+['"])(\.[^'"]+)(['"])/g;
    content = content.replace(sideEffectImportRegex, (match, prefix, path, suffix) => {
      if (!path.endsWith('.js') && !path.endsWith('.json')) {
        modified = true;
        return `${prefix}${path}.js${suffix}`;
      }
      return match;
    });

    // Fix relative imports: from './file' or from '../file'
    const relativeImportRegex = /(from\s+['"])(\.[^'"]+)(['"])/g;
    content = content.replace(relativeImportRegex, (match, prefix, path, suffix) => {
      if (!path.endsWith('.js') && !path.endsWith('.json')) {
        modified = true;
        return `${prefix}${path}.js${suffix}`;
      }
      return match;
    });

    // Fix relative dynamic imports: import('./file') or import('../file')
    const dynamicImportRegex = /(import\s*\(\s*['"])(\.[^'"]+)(['"]\s*\))/g;
    content = content.replace(dynamicImportRegex, (match, prefix, path, suffix) => {
      if (!path.endsWith('.js') && !path.endsWith('.json')) {
        modified = true;
        return `${prefix}${path}.js${suffix}`;
      }
      return match;
    });

    if (modified) {
      await writeFile(file, content, 'utf-8');
      filesProcessed++;
    }
  }

  console.log(`✅ Fixed imports in ${filesProcessed} files`);
}

fixImports().catch(err => {
  console.error('Error fixing imports:', err);
  process.exit(1);
});
