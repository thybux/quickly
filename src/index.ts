import { fast_sum, fast_average, fast_sort } from '../pkg/quickly.js';

// Interface pour notre bibliothèque
export interface PerformanceLib {
  sum: (numbers: number[]) => Promise<number>;
  average: (numbers: number[]) => Promise<number>;
  sort: (numbers: number[]) => Promise<number[]>;
}

// Classe principale de la bibliothèque
export class MyPerformanceLib implements PerformanceLib {
  constructor() {
    console.log('🦀 Rust/WASM library initialized!');
  }

  /**
   * Calcule la somme d'un tableau de nombres avec Rust
   */
  public async sum(numbers: number[]): Promise<number> {
    return fast_sum(new Float64Array(numbers));
  }

  /**
   * Calcule la moyenne d'un tableau de nombres avec Rust
   */
  public async average(numbers: number[]): Promise<number> {
    return fast_average(new Float64Array(numbers));
  }

  /**
   * Trie un tableau de nombres avec Rust
   */
  public async sort(numbers: number[]): Promise<number[]> {
    // fast_sort attend un Vec<f64>, on passe directement le tableau
    return Array.from(fast_sort(new Float64Array(numbers)));
  }
}

// Export par défaut pour faciliter l'utilisation
export default MyPerformanceLib;

// Export des fonctions individuelles pour un usage direct
export { fast_sum, fast_average, fast_sort };
