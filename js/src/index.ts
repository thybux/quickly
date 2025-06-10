// Point d'entrée principal de la bibliothèque Quickly
export { QuicklyArray } from './core/Array';
export { WasmBindings } from './wasm/bindings';
export * from './types';

// Version et informations
export const VERSION = '1.0.0';
export const BUILD_INFO = {
  version: VERSION,
  wasmSupport: true,
  buildDate: new Date().toISOString(),
};

// Fonction utilitaire pour vérifier que WASM est chargé
export function isWasmReady(): boolean {
  try {
    // Test simple pour vérifier que WASM fonctionne
    WasmBindings.arraySum([1, 2, 3]);
    return true;
  } catch (error) {
    console.warn('WASM not ready:', error);
    return false;
  }
}

// Export par défaut pour faciliter l'import
export default {
  QuicklyArray,
  WasmBindings,
  VERSION,
  BUILD_INFO,
  isWasmReady,
};
