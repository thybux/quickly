// Setup global pour les tests Jest
import { existsSync } from 'fs';
import { join } from 'path';

// Vérifier que les fichiers WASM sont présents
const wasmPath = join(__dirname, '../wasm-pkg/quickly.wasm');
if (!existsSync(wasmPath)) {
  console.warn('⚠️  Fichier WASM non trouvé dans wasm-pkg/');
  console.warn('   Exécutez "npm run build:wasm" d\'abord.');
}

// Configuration globale pour les tests
const originalConsole = global.console;
global.console = {
  ...originalConsole,
  // Supprimer les logs console pendant les tests sauf si VERBOSE=true
  log: process.env.VERBOSE === 'true' ? originalConsole.log : jest.fn(),
  debug: process.env.VERBOSE === 'true' ? originalConsole.debug : jest.fn(),
  info: process.env.VERBOSE === 'true' ? originalConsole.info : jest.fn(),
  warn: originalConsole.warn,
  error: originalConsole.error,
};

// Augmenter le timeout pour les opérations WASM
jest.setTimeout(30000);

// Configuration Jest pour les tests
beforeAll(() => {
  if (process.env.VERBOSE === 'true') {
    console.log('🧪 Starting Quickly Library tests...');
  }
});

afterAll(() => {
  if (process.env.VERBOSE === 'true') {
    console.log('✅ All tests completed!');
  }
});