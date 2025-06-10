// Point d'entrée principal de la bibliothèque Quickly
export { QuicklyArray } from './core/QuicklyArray';
export { WasmBindings } from './wasm/bindings';
export { loadWasmModule, loadWasmModuleSync, isWasmAvailable, getWasmStatus } from './wasm/loader';
export * from './types';

import { QuicklyArray } from './core/QuicklyArray';
import { WasmBindings } from './wasm/bindings';
import { isWasmAvailable, getWasmStatus } from './wasm/loader';
import { QuicklyInfo } from './types';

// Constantes de version
export const VERSION = '1.0.0';
export const BUILD_DATE = new Date().toISOString();

// Fonction utilitaire pour vérifier que WASM est prêt
export function isWasmReady(): boolean {
  try {
    if (!isWasmAvailable()) return false;

    // Test de fonctionnement basique
    const testResult = WasmBindings.arraySum([1, 2, 3]);
    return testResult === 6;
  } catch (error) {
    console.warn('⚠️  WASM not ready:', error instanceof Error ? error.message : error);
    return false;
  }
}

// Informations complètes sur la bibliothèque
export function getQuicklyInfo(): QuicklyInfo {
  const wasmStatus = getWasmStatus();

  return {
    version: VERSION,
    wasmReady: wasmStatus.loaded && isWasmReady(),
    buildDate: BUILD_DATE,
    features: [
      'Array Math Operations',
      'Statistical Functions',
      'WASM Backend',
      'TypeScript Support'
    ]
  };
}

// Fonction de diagnostic
export function diagnose(): void {
  console.log('🔍 Quickly Library Diagnostic');
  console.log('===============================');

  const info = getQuicklyInfo();
  console.log(`Version: ${info.version}`);
  console.log(`Build Date: ${info.buildDate}`);
  console.log(`WASM Ready: ${info.wasmReady ? '✅' : '❌'}`);

  const wasmStatus = getWasmStatus();
  if (!wasmStatus.loaded) {
    console.log(`WASM Error: ${wasmStatus.error}`);
    console.log('\n🔧 Solutions possibles:');
    console.log('1. Exécutez "npm run build:wasm" pour compiler le module WASM');
    console.log('2. Vérifiez que wasm-pack est installé: cargo install wasm-pack');
    console.log('3. Vérifiez que les fichiers existent dans wasm-pkg/');
  } else {
    console.log('✅ WASM module loaded successfully');

    // Test des fonctions principales
    try {
      const testArray = [1, 2, 3, 4, 5];
      const sum = WasmBindings.arraySum(testArray);
      console.log(`✅ Basic operations working (sum test: ${sum})`);
    } catch (error) {
      console.log(`❌ WASM functions not working: ${error}`);
    }
  }

  console.log(`\nFeatures: ${info.features.join(', ')}`);
}

// Export par défaut pour faciliter l'import
export default {
  QuicklyArray,
  WasmBindings,
  VERSION,
  BUILD_DATE,
  isWasmReady,
  getQuicklyInfo,
  diagnose,

  // Aliases pour compatibilité
  version: VERSION,
  info: getQuicklyInfo
};