// Types pour les opérations sur les arrays

export type NumericArray = number[] | Float64Array | Float32Array;

export interface ArrayAddResult {
  result: number[];
  length: number;
}

export interface ArrayMathOptions {
  // Options pour les opérations mathématiques
  skipNaN?: boolean;
  precision?: number;
}

// Interface pour les opérations mathématiques sur arrays
export interface ArrayMath {
  // Addition
  add(other: NumericArray): number[];
  addScalar(scalar: number): number[];

  // Somme
  sum(): number;

  // Futur : autres opérations
  // subtract(other: NumericArray): number[];
  // multiply(other: NumericArray): number[];
  // divide(other: NumericArray): number[];
}
