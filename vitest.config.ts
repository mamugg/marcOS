import { defineConfig } from 'vitest/config';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import type { Plugin } from 'vite';

function angularInlineTemplates(): Plugin {
  return {
    name: 'angular-inline-templates',
    enforce: 'pre',
    transform(code, id) {
      if (!id.endsWith('.ts') || id.includes('node_modules') || id.endsWith('.spec.ts')) {
        return null;
      }

      let result = code;
      let changed = false;

      result = result.replace(
        /templateUrl:\s*['"]([^'"]+\.html)['"]/g,
        (_, templatePath) => {
          const absolutePath = resolve(dirname(id), templatePath);
          try {
            const content = readFileSync(absolutePath, 'utf-8')
              .replace(/\\/g, '\\\\')
              .replace(/`/g, '\\`')
              .replace(/\$\{/g, '\\${');
            changed = true;
            return `template: \`${content}\``;
          } catch {
            changed = true;
            return "template: ''";
          }
        }
      );

      result = result.replace(/styleUrl:\s*['"][^'"]+['"]/g, () => {
        changed = true;
        return 'styles: []';
      });

      result = result.replace(/styleUrls:\s*\[[^\]]*\]/gs, () => {
        changed = true;
        return 'styles: []';
      });

      return changed ? { code: result, map: null } : null;
    },
  };
}

export default defineConfig({
  plugins: [angularInlineTemplates()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/test-setup.ts'],
    include: ['src/**/*.spec.ts'],
    exclude: ['node_modules', 'dist', '.angular'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test.ts',
        '**/*.spec.ts',
      ],
      thresholds: {
        statements: 80,
        branches: 80,
        functions: 80,
        lines: 80,
      },
    },
  },
  resolve: {
    alias: {
      '@app': '/src/app',
      '@shared': '/src/app/shared',
      '@features': '/src/app/features',
      '@models': '/src/app/shared/models',
    },
  },
});
