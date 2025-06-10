// Bindings TypeScript pour les fonctions WASM
import {
  array_add,
  array_add_scalar,
  array_sum,
  fast_sum,
  fast_average,
  fast_sort
} from '../../../pkg/quickly';

export class WasmBindings {

  // === Nouvelles fonctions d'addition ===

  /**
   * Addition de deux arrays élément par élément
   */
  static arrayAdd(a: number[], b: number[]): number[] {
    const float64A = new Float64Array(a);
    const float64B = new Float64Array(b);
    return Array.from(array_add(float64A, float64B));
  }

  /**
   * Addition d'un scalaire à tous les éléments
   */
  static arrayAddScalar(arr: number[], scalar: number): number[] {
    const float64Arr = new Float64Array(arr);
    return Array.from(array_add_scalar(float64Arr, scalar));
  }

  /**
   * Somme de tous les éléments
   */
  static arraySum(arr: number[]): number {
    const float64Arr = new Float64Array(arr);
    return array_sum(float64Arr);
  }

  // === Anciennes fonctions (compatibilité) ===

  static fastSum(numbers: number[]): number {
    return fast_sum(new Float64Array(numbers));
  }

  static fastAverage(numbers: number[]): number {
    return fast_average(new Float64Array(numbers));
  }

  static fastSort(numbers: number[]): number[] {
    return Array.from(fast_sort(new Float64Array(numbers)));
  }
}
