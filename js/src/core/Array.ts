import { NumericArray, ArrayMath } from '../types/array';
import { WasmBindings } from '../wasm/bindings';

/**
 * QuicklyArray - Classe principale pour les opérations sur arrays
 * Style pandas Series avec backend Rust/WASM
 */
export class QuicklyArray implements ArrayMath {
  private data: number[];

  constructor(data: NumericArray) {
    // Convertir tous les types en number[]
    this.data = Array.isArray(data) ? data : Array.from(data);
  }

  // === Getters ===

  get length(): number {
    return this.data.length;
  }

  get values(): number[] {
    return [...this.data]; // Copie pour éviter les mutations
  }

  // === Opérations d'addition ===

  /**
   * Additionne cet array avec un autre array élément par élément
   * @param other - Array à additionner
   * @returns Nouveau QuicklyArray avec les résultats
   */
  add(other: NumericArray): number[] {
    const otherArray = Array.isArray(other) ? other : Array.from(other);
    return WasmBindings.arrayAdd(this.data, otherArray);
  }

  /**
   * Additionne un scalaire à tous les éléments
   * @param scalar - Nombre à additionner à chaque élément
   * @returns Nouveau array avec les résultats
   */
  addScalar(scalar: number): number[] {
    return WasmBindings.arrayAddScalar(this.data, scalar);
  }

  /**
   * Calcule la somme de tous les éléments
   * @returns Somme totale
   */
  sum(): number {
    return WasmBindings.arraySum(this.data);
  }

  // === Méthodes utilitaires ===

  /**
   * Crée un nouveau QuicklyArray à partir du résultat d'une opération
   */
  static fromArray(data: number[]): QuicklyArray {
    return new QuicklyArray(data);
  }

  /**
   * Affichage pour debug
   */
  toString(): string {
    const preview = this.data.length > 10
      ? `[${this.data.slice(0, 5).join(', ')}, ..., ${this.data.slice(-5).join(', ')}]`
      : `[${this.data.join(', ')}]`;

    return `QuicklyArray(${this.length}) ${preview}`;
  }
}
