import { readdirSync, readFileSync } from 'node:fs';
import { basename, resolve } from 'node:path';
import { defineConfig } from 'vite';

const here = import.meta.dirname;
const r = (...p) => resolve(here, ...p);

/* Library entries: one CSS bundle, core CSS, one file per pattern, JS modules. */
function libraryInputs() {
  const inputs = {
    'css/oo': r('src/css/oo.css'),
    'css/core': r('src/css/core.css'),
  };
  for (const file of readdirSync(r('src/css/patterns'))) {
    if (file.endsWith('.css')) inputs[`css/patterns/${basename(file, '.css')}`] = r('src/css/patterns', file);
  }
  inputs['js/oo'] = r('src/js/index.js');
  for (const file of readdirSync(r('src/js'))) {
    if (file.endsWith('.js') && file !== 'index.js') inputs[`js/${basename(file, '.js')}`] = r('src/js', file);
  }
  return inputs;
}

/*
 * Demo site: index.html at the site root, every other page under demo/.
 * The output mirrors the source tree, so dist/site/ is a deployable root.
 */
function demoInputs() {
  const inputs = { index: r('index.html') };
  for (const file of readdirSync(r('demo'))) {
    if (file.endsWith('.html')) inputs[`demo/${basename(file, '.html')}`] = r('demo', file);
  }
  return inputs;
}

/*
 * Lightbox links (<a href="assets/img/...">) are not rewritten by Vite, so the
 * full-size demo images are copied to the same relative path in the output.
 */
function copyDemoImages() {
  return {
    name: 'oo-copy-demo-images',
    apply: 'build',
    generateBundle() {
      for (const file of readdirSync(r('demo/assets/img'))) {
        this.emitFile({
          type: 'asset',
          fileName: `demo/assets/img/${file}`,
          source: readFileSync(r('demo/assets/img', file)),
        });
      }
    },
  };
}

export default defineConfig(({ mode }) => {
  if (mode === 'lib') {
    return {
      publicDir: false,
      build: {
        outDir: 'dist',
        emptyOutDir: true,
        cssCodeSplit: true,
        minify: false,
        cssMinify: false,
        target: 'es2022',
        rollupOptions: {
          input: libraryInputs(),
          preserveEntrySignatures: 'strict',
          output: {
            entryFileNames: '[name].js',
            chunkFileNames: 'js/chunks/[name].js',
            assetFileNames: '[name][extname]',
          },
        },
      },
    };
  }

  /*
   * Demo site. Relative URLs by default so the output works from any folder.
   * The GitHub Pages workflow sets OO_BASE=/oo-patterns/ so asset URLs are
   * absolute under the project path.
   */
  return {
    base: process.env.OO_BASE || './',
    publicDir: false,
    plugins: [copyDemoImages()],
    build: {
      outDir: 'dist/site',
      emptyOutDir: true,
      assetsInlineLimit: 0,
      target: 'es2022',
      rollupOptions: { input: demoInputs() },
    },
    test: {
      environment: 'jsdom',
      include: ['tests/**/*.test.js'],
    },
  };
});
