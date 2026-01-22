import { readdirSync, statSync, copyFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..');
const distDir = join(projectRoot, 'dist');
const pagesDir = join(projectRoot, 'pages');

// dist/index.htmlを読み込む
const indexHtmlPath = join(distDir, 'index.html');

// pagesディレクトリ内のすべてのディレクトリを探索
function findDirectories(dir, baseDir = dir) {
  const items = readdirSync(dir);
  const directories = [];

  for (const item of items) {
    const fullPath = join(dir, item);
    const relativePath = fullPath.substring(baseDir.length + 1);
    
    if (statSync(fullPath).isDirectory()) {
      directories.push(relativePath);
      // 再帰的にサブディレクトリも探索
      directories.push(...findDirectories(fullPath, baseDir));
    }
  }

  return directories;
}

// 各ディレクトリにindex.htmlをコピー
const directories = findDirectories(pagesDir);

for (const dir of directories) {
  const targetDir = join(distDir, dir);
  const targetIndexPath = join(targetDir, 'index.html');
  
  // ディレクトリが存在しない場合は作成
  if (!existsSync(targetDir)) {
    mkdirSync(targetDir, { recursive: true });
  }
  
  // index.htmlをコピー（既に存在する場合は上書きしない）
  if (!existsSync(targetIndexPath)) {
    copyFileSync(indexHtmlPath, targetIndexPath);
    console.log(`✓ Created: ${dir}/index.html`);
  }
}

console.log('✓ SPA routing setup completed!');
