#!/usr/bin/env node
import { execSync } from 'child_process';
import { cpSync, rmSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const pluginRoot = join(__dirname, '..');
const monorepoRoot = join(pluginRoot, '..');
const serversDir = join(pluginRoot, 'servers');

// Initialize git submodules if needed
console.log('📥 Ensuring git submodules are initialized...');
try {
  execSync('git submodule update --init --recursive', {
    cwd: monorepoRoot,
    stdio: 'pipe'
  });
} catch (error) {
  console.warn('⚠️  Warning: Failed to initialize git submodules');
  console.warn('   If running outside git repo, this is expected.');
}

// Clean previous build
if (existsSync(serversDir)) {
  rmSync(serversDir, { recursive: true, force: true });
}
mkdirSync(serversDir, { recursive: true });

const services = [
  'mcp-domain-checker',
  'mcp-domain-checker-price',
  'mcp-gitlab-ci',
  'mcp-opener',
  'mcp-stream-workflow',
  'mcp-stream-workflow-status'
];

console.log('🔨 Building all MCP services...');
try {
  execSync('pnpm -r --filter "./mcp-*" build', {
    cwd: monorepoRoot,
    stdio: 'inherit'
  });
} catch (error) {
  console.error('❌ Build failed');
  process.exit(1);
}

console.log('\n📦 Deploying services with production dependencies...');
for (const service of services) {
  const srcPath = join(monorepoRoot, service);
  const destPath = join(serversDir, service.replace('mcp-', ''));

  if (!existsSync(srcPath)) {
    console.warn(`⚠️  Warning: ${service} not found at ${srcPath}`);
    continue;
  }

  console.log(`  Deploying ${service}...`);

  // Use pnpm deploy to copy with resolved workspace dependencies
  // Note: --legacy flag required for pnpm v10+
  try {
    execSync(`pnpm --filter "${service}" deploy ${destPath} --prod --legacy`, {
      cwd: monorepoRoot,
      stdio: 'pipe'
    });
  } catch (error) {
    console.error(`❌ Failed to deploy ${service}`);
    console.error(error.stderr?.toString() || error.message);
    continue;
  }

  // Copy additional files based on service (pnpm deploy doesn't copy these)
  if (service === 'mcp-stream-workflow') {
    const promptsPath = join(srcPath, 'prompts');
    const templatesPath = join(srcPath, 'templates');

    if (existsSync(promptsPath)) {
      cpSync(promptsPath, join(destPath, 'prompts'), { recursive: true });
    }

    if (existsSync(templatesPath)) {
      cpSync(templatesPath, join(destPath, 'templates'), { recursive: true });
    }
  }

  if (service === 'mcp-stream-workflow-status') {
    const dashboardDistPath = join(srcPath, 'dashboard', 'dist');

    if (existsSync(dashboardDistPath)) {
      mkdirSync(join(destPath, 'dashboard'), { recursive: true });
      cpSync(dashboardDistPath, join(destPath, 'dashboard', 'dist'), { recursive: true });
    } else {
      console.warn(`⚠️  Warning: Dashboard not built for ${service}`);
    }
  }
}

console.log('\n✅ Plugin bundle complete!');
console.log(`   Output: ${serversDir}`);
console.log('\n📊 Bundle size:');
try {
  execSync(`du -sh ${serversDir}`, { stdio: 'inherit' });
} catch {
  // Ignore du errors on systems where it's not available
}
