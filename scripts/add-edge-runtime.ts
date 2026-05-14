import fs from 'fs';
import path from 'path';

const appDir = path.join(process.cwd(), 'app');

function addEdgeRuntimeToFile(filePath: string) {
  const content = fs.readFileSync(filePath, 'utf-8');

  // Skip if already has runtime export
  if (content.includes('export const runtime')) {
    console.log(`⏭️  Skipped (already has runtime): ${filePath}`);
    return;
  }

  // Skip if it's a client component
  if (content.includes("'use client'") || content.includes('"use client"')) {
    console.log(`⏭️  Skipped (client component): ${filePath}`);
    return;
  }

  // Add edge runtime at the top of the file (after imports)
  const lines = content.split('\n');
  let insertIndex = 0;

  // Find the last import statement
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim().startsWith('import ') || lines[i].trim().startsWith('import{')) {
      insertIndex = i + 1;
    }
  }

  // Insert runtime export after imports
  lines.splice(insertIndex, 0, '', "export const runtime = 'edge';", '');

  fs.writeFileSync(filePath, lines.join('\n'));
  console.log(`✅ Added edge runtime: ${filePath}`);
}

function processDirectory(dir: string) {
  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (
      (item === 'route.ts' || item === 'route.tsx' || item === 'page.tsx' || item === 'page.ts') &&
      !fullPath.includes('node_modules')
    ) {
      addEdgeRuntimeToFile(fullPath);
    }
  }
}

console.log('🚀 Adding edge runtime to all routes...\n');
processDirectory(appDir);
console.log('\n✅ Done!');
