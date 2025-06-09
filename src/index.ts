// Point d'entrée principal de la bibliothèque Quickly
export { QuicklyArray } from './typescript/core/Array';

// Export des types
export * from './typescript/types';

// Export des bindings WASM (pour usage avancé)
export { WasmBindings } from './typescript/wasm/bindings';

// Version et métadonnées
export const VERSION = '1.0.0';
export const DESCRIPTION = 'Une bibliothèque TypeScript avec du Rust pour la performance';
