/**
 * Acceptance tests for CJS and ESM module consumption.
 *
 * These tests validate that:
 * 1. All @suds-cli packages can be consumed via CommonJS (require)
 * 2. All @suds-cli packages can be consumed via ESM (import)
 * 3. TypeScript types work correctly in both module systems
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { Project } from 'fixturify-project'
import { execSync, exec } from 'node:child_process'
import * as path from 'node:path'

// List of all packages to test
const PACKAGES = [
  'chapstick',
  'code',
  'cursor',
  'filepicker',
  'filesystem',
  'filetree',
  'help',
  'icons',
  'key',
  'list',
  'machine',
  'markdown',
  'paginator',
  'progress',
  'runeutil',
  'spinner',
  'statusbar',
  'stopwatch',
  'table',
  'tea',
  'textarea',
  'textinput',
  'timer',
  'viewport',
]

const ROOT_DIR = path.resolve(import.meta.dirname, '..')

function runCommand(cmd: string, cwd: string): string {
  try {
    return execSync(cmd, {
      cwd,
      encoding: 'utf-8',
      env: { ...process.env, NODE_OPTIONS: '' },
    })
  } catch (error) {
    const err = error as { stdout?: string; stderr?: string; message?: string }
    throw new Error(
      `Command failed: ${cmd}\nstdout: ${err.stdout}\nstderr: ${err.stderr}\n${err.message}`,
    )
  }
}

describe('CJS Module Consumption', () => {
  let project: Project

  beforeAll(async () => {
    // Create a CommonJS project
    // Note: We use Node16 moduleResolution to support package.json exports field
    project = new Project('cjs-consumer', '1.0.0', {
      files: {
        'tsconfig.json': JSON.stringify(
          {
            compilerOptions: {
              target: 'ES2022',
              module: 'Node16',
              moduleResolution: 'Node16',
              esModuleInterop: true,
              strict: true,
              skipLibCheck: true,
              declaration: false,
              outDir: './dist',
              rootDir: './src',
            },
            include: ['src/**/*.ts'],
          },
          null,
          2,
        ),
        src: {
          'index.ts': generateCjsTestFile(),
        },
      },
    })

    // Set package.json properties
    project.pkg.type = 'commonjs'
    project.pkg.devDependencies = {
      typescript: '5.8.2',
    }

    // Link all @suds-cli packages
    for (const pkg of PACKAGES) {
      project.linkDependency(`@suds-cli/${pkg}`, {
        target: path.join(ROOT_DIR, 'packages', pkg),
      })
    }

    await project.write()

    // Install dependencies
    runCommand('npm install', project.baseDir)
  })

  afterAll(async () => {
    project.dispose()
  })

  it('should compile TypeScript with correct types', () => {
    // Run tsc to verify types work
    const result = runCommand('npx tsc --noEmit', project.baseDir)
    expect(result).not.toContain('error')
  })

  it('should run the compiled code', () => {
    // Compile and run
    runCommand('npx tsc', project.baseDir)
    const result = runCommand('node dist/index.js', project.baseDir)
    expect(result).toContain('All CJS imports successful')
  })
})

describe('ESM Module Consumption', () => {
  let project: Project

  beforeAll(async () => {
    // Create an ESM project
    project = new Project('esm-consumer', '1.0.0', {
      files: {
        'tsconfig.json': JSON.stringify(
          {
            compilerOptions: {
              target: 'ES2022',
              module: 'NodeNext',
              moduleResolution: 'NodeNext',
              esModuleInterop: true,
              strict: true,
              skipLibCheck: true,
              declaration: false,
              outDir: './dist',
              rootDir: './src',
            },
            include: ['src/**/*.ts'],
          },
          null,
          2,
        ),
        src: {
          'index.ts': generateEsmTestFile(),
        },
      },
    })

    // Set package.json properties
    project.pkg.type = 'module'
    project.pkg.devDependencies = {
      typescript: '5.8.2',
    }

    // Link all @suds-cli packages
    for (const pkg of PACKAGES) {
      project.linkDependency(`@suds-cli/${pkg}`, {
        target: path.join(ROOT_DIR, 'packages', pkg),
      })
    }

    await project.write()

    // Install dependencies
    runCommand('npm install', project.baseDir)
  })

  afterAll(async () => {
    project.dispose()
  })

  it('should compile TypeScript with correct types', () => {
    // Run tsc to verify types work
    const result = runCommand('npx tsc --noEmit', project.baseDir)
    expect(result).not.toContain('error')
  })

  it('should run the compiled code', () => {
    // Compile and run
    runCommand('npx tsc', project.baseDir)
    const result = runCommand('node dist/index.js', project.baseDir)
    expect(result).toContain('All ESM imports successful')
  })
})

describe('Machine package subpath exports', () => {
  let cjsProject: Project
  let esmProject: Project

  beforeAll(async () => {
    // Create CJS project for machine subpaths
    // Note: We use Node16 moduleResolution to support package.json exports field
    cjsProject = new Project('cjs-machine-consumer', '1.0.0', {
      files: {
        'tsconfig.json': JSON.stringify(
          {
            compilerOptions: {
              target: 'ES2022',
              module: 'Node16',
              moduleResolution: 'Node16',
              esModuleInterop: true,
              strict: true,
              skipLibCheck: true,
              declaration: false,
              outDir: './dist',
              rootDir: './src',
            },
            include: ['src/**/*.ts'],
          },
          null,
          2,
        ),
        src: {
          'index.ts': `
// Test machine package subpath exports (CJS)
import type { PlatformAdapter } from '@suds-cli/machine'
import { createNodePlatform } from '@suds-cli/machine/node'

// Type check - this should compile without errors
const _typeCheck: PlatformAdapter = {} as PlatformAdapter

console.log('createNodePlatform is a function:', typeof createNodePlatform === 'function')
console.log('Machine subpath CJS imports successful')
`,
        },
      },
    })

    cjsProject.pkg.type = 'commonjs'
    cjsProject.pkg.devDependencies = { typescript: '5.8.2' }
    cjsProject.linkDependency('@suds-cli/machine', {
      target: path.join(ROOT_DIR, 'packages', 'machine'),
    })

    await cjsProject.write()
    runCommand('npm install', cjsProject.baseDir)

    // Create ESM project for machine subpaths
    esmProject = new Project('esm-machine-consumer', '1.0.0', {
      files: {
        'tsconfig.json': JSON.stringify(
          {
            compilerOptions: {
              target: 'ES2022',
              module: 'NodeNext',
              moduleResolution: 'NodeNext',
              esModuleInterop: true,
              strict: true,
              skipLibCheck: true,
              declaration: false,
              outDir: './dist',
              rootDir: './src',
            },
            include: ['src/**/*.ts'],
          },
          null,
          2,
        ),
        src: {
          'index.ts': `
// Test machine package subpath exports (ESM)
import type { PlatformAdapter } from '@suds-cli/machine'
import { createNodePlatform } from '@suds-cli/machine/node'

// Type check - this should compile without errors
const _typeCheck: PlatformAdapter = {} as PlatformAdapter

console.log('createNodePlatform is a function:', typeof createNodePlatform === 'function')
console.log('Machine subpath ESM imports successful')
`,
        },
      },
    })

    esmProject.pkg.type = 'module'
    esmProject.pkg.devDependencies = { typescript: '5.8.2' }
    esmProject.linkDependency('@suds-cli/machine', {
      target: path.join(ROOT_DIR, 'packages', 'machine'),
    })

    await esmProject.write()
    runCommand('npm install', esmProject.baseDir)
  })

  afterAll(async () => {
    cjsProject.dispose()
    esmProject.dispose()
  })

  it('should work with CJS subpath imports', () => {
    runCommand('npx tsc --noEmit', cjsProject.baseDir)
    runCommand('npx tsc', cjsProject.baseDir)
    const result = runCommand('node dist/index.js', cjsProject.baseDir)
    expect(result).toContain('Machine subpath CJS imports successful')
  })

  it('should work with ESM subpath imports', () => {
    runCommand('npx tsc --noEmit', esmProject.baseDir)
    runCommand('npx tsc', esmProject.baseDir)
    const result = runCommand('node dist/index.js', esmProject.baseDir)
    expect(result).toContain('Machine subpath ESM imports successful')
  })
})

function generateCjsTestFile(): string {
  const imports = PACKAGES.map(
    (pkg) => `import * as ${toCamelCase(pkg)} from '@suds-cli/${pkg}'`,
  ).join('\n')

  const checks = PACKAGES.map(
    (pkg) => `console.log('@suds-cli/${pkg}:', typeof ${toCamelCase(pkg)})`,
  ).join('\n')

  return `
// Test all @suds-cli packages can be imported via CJS
${imports}

${checks}

console.log('All CJS imports successful')
`
}

function generateEsmTestFile(): string {
  const imports = PACKAGES.map(
    (pkg) => `import * as ${toCamelCase(pkg)} from '@suds-cli/${pkg}'`,
  ).join('\n')

  const checks = PACKAGES.map(
    (pkg) => `console.log('@suds-cli/${pkg}:', typeof ${toCamelCase(pkg)})`,
  ).join('\n')

  return `
// Test all @suds-cli packages can be imported via ESM
${imports}

${checks}

console.log('All ESM imports successful')
`
}

function toCamelCase(str: string): string {
  return str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())
}
