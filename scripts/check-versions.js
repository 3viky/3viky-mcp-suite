#!/usr/bin/env node
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

// Find all mcp-* directories
const directories = readdirSync('.', { withFileTypes: true })
  .filter(dirent => dirent.isDirectory() && dirent.name.startsWith('mcp-'))
  .map(dirent => dirent.name);

const packages = directories.map(dir => join(dir, 'package.json'));
const versions = new Map();

console.log('🔍 Checking dependency version consistency across packages...\n');

for (const pkgPath of packages) {
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
  const deps = { ...pkg.dependencies, ...pkg.devDependencies };

  for (const [name, version] of Object.entries(deps)) {
    if (!versions.has(name)) versions.set(name, new Set());
    versions.get(name).add(version);
  }
}

let hasInconsistency = false;

for (const [name, versionSet] of versions) {
  if (versionSet.size > 1) {
    console.error(`❌ Inconsistent versions for ${name}:`);
    for (const version of versionSet) {
      const pkgs = packages.filter(p => {
        const pkg = JSON.parse(readFileSync(p, 'utf-8'));
        const deps = { ...pkg.dependencies, ...pkg.devDependencies };
        return deps[name] === version;
      });
      console.error(`   ${version} used by: ${pkgs.map(p => p.split('/')[0]).join(', ')}`);
    }
    console.error('');
    hasInconsistency = true;
  }
}

if (hasInconsistency) {
  console.error('⚠️  Version inconsistencies detected!');
  console.error('\nTo fix:');
  console.error('1. Update package.json files to use the same version');
  console.error('2. Or add version to pnpm.overrides in root package.json');
  console.error('3. Run pnpm install to apply changes\n');
  process.exit(1);
} else {
  console.log('✅ All dependency versions are consistent across packages\n');
}
