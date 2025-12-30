import { readdir, readFile, writeFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function fixImports(dir) {
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);

    if (entry.isDirectory()) {
      await fixImports(fullPath);
    } else if (entry.isFile() && entry.name.endsWith('.js')) {
      let content = await readFile(fullPath, 'utf-8');
      
      // Fix relative imports to include .js extension
      content = content.replace(
        /from ['"](\.[^'"]+)['"]/g,
        (match, path) => {
          if (path.endsWith('.js')) return match;
          return `from '${path}.js'`;
        }
      );
      
      content = content.replace(
        /import ['"](\.[^'"]+)['"]/g,
        (match, path) => {
          if (path.endsWith('.js')) return match;
          return `import '${path}.js'`;
        }
      );

      await writeFile(fullPath, content, 'utf-8');
    }
  }
}

const distPath = join(__dirname, '..', 'dist');
console.log('Fixing imports in:', distPath);

fixImports(distPath)
  .then(() => console.log('✓ Import paths fixed successfully'))
  .catch((err) => {
    console.error('Error fixing imports:', err);
    process.exit(1);
  });
