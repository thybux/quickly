// Setup global pour les tests Jest
import { existsSync } from 'fs';
import { join } from 'path';

// Vérifier que les fichiers WASM sont présents
const wasmPath = join(__dirname, '../pkg/quickly.wasm');
if (!existsSync(wasmPath)) {
  console.warn('⚠️  Fichier WASM non trouvé. Exécutez "npm run build:rust" d\'abord.');
}

// Configuration globale pour les tests
global.console = {
  ...console,
  // Supprimer les logs console pendant les tests sauf si VERBOSE=true
  log: process.env.VERBOSE === 'true' ? console.log : jest.fn(),
  debug: process.env.VERBOSE === 'true' ? console.debug : jest.fn(),
  info: process.env.VERBOSE === 'true' ? console.info : jest.fn(),
  warn: console.warn,
  error: console.error,
};

// Augmenter le timeout pour les opérations WASM
jest.setTimeout(10000);
