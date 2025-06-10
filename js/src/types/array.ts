// Types pour les opérations sur les arrays

export type NumericArray = number[] | Float64Array | Float32Array | Int32Array;

export interface ArrayMathOptions {
  skipNaN?: boolean;
  precision?: number;
}

export interface StatisticalResult {
  mean: number;
  min: number;
  max: number;
  std: number;
  variance: number;
  sum: number;
  count: number;
}

// Interface pour les opérations mathématiques sur arrays
export interface ArrayMath {
  // Opérations binaires
  add(other: NumericArray): number[];
  subtract(other: NumericArray): number[];
  multiply(other: NumericArray): number[];
  divide(other: NumericArray): number[];

  // Opérations avec scalaires
  addScalar(scalar: number): number[];
  subtractScalar(scalar: number): number[];
  multiplyScalar(scalar: number): number[];
  divideScalar(scalar: number): number[];

  // Agrégations
  sum(): number;
  mean(): number;
  min(): number;
  max(): number;
  std(): number;
  variance(): number;
}

export interface ArrayConstructorOptions {
  validateInput?: boolean;
  convertToFloat64?: boolean;
}