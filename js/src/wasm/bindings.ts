// Bindings TypeScript pour les fonctions WASM
import { loadWasmModuleSync } from './loader';

export class WasmBindings {

  // === Fonctions d'addition ===

  static arrayAdd(a: number[], b: number[]): number[] {
    const wasm = loadWasmModuleSync();
    const float64A = new Float64Array(a);
    const float64B = new Float64Array(b);
    return Array.from(wasm.array_add(float64A, float64B));
  }

  static arrayAddScalar(arr: number[], scalar: number): number[] {
    const wasm = loadWasmModuleSync();
    const float64Arr = new Float64Array(arr);
    return Array.from(wasm.array_add_scalar(float64Arr, scalar));
  }

  static arraySum(arr: number[]): number {
    const wasm = loadWasmModuleSync();
    const float64Arr = new Float64Array(arr);
    return wasm.array_sum(float64Arr);
  }

  // === Fonctions de soustraction ===

  static arraySubtract(a: number[], b: number[]): number[] {
    const wasm = loadWasmModuleSync();
    const float64A = new Float64Array(a);
    const float64B = new Float64Array(b);
    return Array.from(wasm.array_subtract(float64A, float64B));
  }

  static arraySubtractScalar(arr: number[], scalar: number): number[] {
    const wasm = loadWasmModuleSync();
    const float64Arr = new Float64Array(arr);
    return Array.from(wasm.array_subtract_scalar(float64Arr, scalar));
  }

  // === Fonctions de multiplication ===

  static arrayMultiply(a: number[], b: number[]): number[] {
    const wasm = loadWasmModuleSync();
    const float64A = new Float64Array(a);
    const float64B = new Float64Array(b);
    return Array.from(wasm.array_multiply(float64A, float64B));
  }

  static arrayMultiplyScalar(arr: number[], scalar: number): number[] {
    const wasm = loadWasmModuleSync();
    const float64Arr = new Float64Array(arr);
    return Array.from(wasm.array_multiply_scalar(float64Arr, scalar));
  }

  // === Fonctions de division ===

  static arrayDivide(a: number[], b: number[]): number[] {
    const wasm = loadWasmModuleSync();
    const float64A = new Float64Array(a);
    const float64B = new Float64Array(b);
    return Array.from(wasm.array_divide(float64A, float64B));
  }

  static arrayDivideScalar(arr: number[], scalar: number): number[] {
    const wasm = loadWasmModuleSync();
    const float64Arr = new Float64Array(arr);
    return Array.from(wasm.array_divide_scalar(float64Arr, scalar));
  }

  // === Fonctions statistiques ===

  static arrayMean(arr: number[]): number {
    const wasm = loadWasmModuleSync();
    const float64Arr = new Float64Array(arr);
    return wasm.array_mean(float64Arr);
  }

  static arrayMin(arr: number[]): number {
    const wasm = loadWasmModuleSync();
    const float64Arr = new Float64Array(arr);
    return wasm.array_min(float64Arr);
  }

  static arrayMax(arr: number[]): number {
    const wasm = loadWasmModuleSync();
    const float64Arr = new Float64Array(arr);
    return wasm.array_max(float64Arr);
  }

  static arrayStd(arr: number[]): number {
    const wasm = loadWasmModuleSync();
    const float64Arr = new Float64Array(arr);
    return wasm.array_std(float64Arr);
  }

  static arrayVariance(arr: number[]): number {
    const wasm = loadWasmModuleSync();
    const float64Arr = new Float64Array(arr);
    return wasm.array_variance(float64Arr);
  }

  // === Fonctions legacy (compatibilité) ===

  static fastSum(numbers: number[]): number {
    const wasm = loadWasmModuleSync();
    return wasm.fast_sum(new Float64Array(numbers));
  }

  static fastAverage(numbers: number[]): number {
    const wasm = loadWasmModuleSync();
    return wasm.fast_average(new Float64Array(numbers));
  }

  static fastSort(numbers: number[]): number[] {
    const wasm = loadWasmModuleSync();
    return Array.from(wasm.fast_sort(new Float64Array(numbers)));
  }

  // === Méthodes utilitaires ===

  static isAvailable(): boolean {
    try {
      loadWasmModuleSync();
      return true;
    } catch {
      return false;
    }
  }

  static getInfo(): { available: boolean; error?: string } {
    try {
      const wasm = loadWasmModuleSync();
      return { available: true };
    } catch (error) {
      return {
        available: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}