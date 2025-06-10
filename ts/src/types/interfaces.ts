// ========== INTERFACES WASM ==========

import {QuicklyArray} from "../core/QuicklyArray";

export interface WasmModule {
    // === Opérations mathématiques de base ===
    array_add: (a: Float64Array, b: Float64Array) => Float64Array;
    array_add_scalar: (arr: Float64Array, scalar: number) => Float64Array;
    array_subtract: (a: Float64Array, b: Float64Array) => Float64Array;
    array_subtract_scalar: (arr: Float64Array, scalar: number) => Float64Array;
    array_multiply: (a: Float64Array, b: Float64Array) => Float64Array;
    array_multiply_scalar: (arr: Float64Array, scalar: number) => Float64Array;
    array_divide: (a: Float64Array, b: Float64Array) => Float64Array;
    array_divide_scalar: (arr: Float64Array, scalar: number) => Float64Array;

    // === Fonctions mathématiques ===
    array_abs: (arr: Float64Array) => Float64Array;
    array_sqrt: (arr: Float64Array) => Float64Array;
    array_log: (arr: Float64Array) => Float64Array;
    array_exp: (arr: Float64Array) => Float64Array;
    array_sin: (arr: Float64Array) => Float64Array;
    array_cos: (arr: Float64Array) => Float64Array;
    array_tan: (arr: Float64Array) => Float64Array;
    array_floor: (arr: Float64Array) => Float64Array;
    array_ceil: (arr: Float64Array) => Float64Array;
    array_round: (arr: Float64Array) => Float64Array;
    array_power: (arr: Float64Array, exponent: number) => Float64Array;

    // === Statistiques ===
    array_sum: (arr: Float64Array) => number;
    array_mean: (arr: Float64Array) => number;
    array_min: (arr: Float64Array) => number;
    array_max: (arr: Float64Array) => number;
    array_std: (arr: Float64Array) => number;
    array_variance: (arr: Float64Array) => number;
    array_median: (arr: Float64Array) => number;
    array_percentile: (arr: Float64Array, percentile: number) => number;
    array_skewness: (arr: Float64Array) => number;
    array_kurtosis: (arr: Float64Array) => number;

    // === Fonctions cumulatives ===
    array_cumsum: (arr: Float64Array) => Float64Array;
    array_cumprod: (arr: Float64Array) => Float64Array;
    array_cummax: (arr: Float64Array) => Float64Array;
    array_cummin: (arr: Float64Array) => Float64Array;
    array_diff: (arr: Float64Array) => Float64Array;
    array_pct_change: (arr: Float64Array) => Float64Array;

    // === Tri et filtrage ===
    array_sort: (arr: Float64Array) => Float64Array;
    array_sort_desc: (arr: Float64Array) => Float64Array;
    array_argsort: (arr: Float64Array) => Uint32Array;
    array_filter_gt: (arr: Float64Array, threshold: number) => Float64Array;
    array_filter_lt: (arr: Float64Array, threshold: number) => Float64Array;
    array_filter_eq: (arr: Float64Array, value: number) => Float64Array;
    array_where_gt: (arr: Float64Array, threshold: number) => Uint32Array;
    array_where_lt: (arr: Float64Array, threshold: number) => Uint32Array;
    array_where_eq: (arr: Float64Array, value: number) => Uint32Array;

    // === Manipulation de tableaux ===
    array_slice: (arr: Float64Array, start: number, end: number) => Float64Array;
    array_concat: (a: Float64Array, b: Float64Array) => Float64Array;
    array_repeat: (arr: Float64Array, times: number) => Float64Array;
    array_reverse: (arr: Float64Array) => Float64Array;
    array_unique: (arr: Float64Array) => Float64Array;
    array_unique_count: (arr: Float64Array) => number;

    // === Gestion des valeurs manquantes ===
    array_fillna: (arr: Float64Array, value: number) => Float64Array;
    array_dropna: (arr: Float64Array) => Float64Array;
    array_count_nan: (arr: Float64Array) => number;
    array_isna: (arr: Float64Array) => Uint8Array;

    // === Opérations par fenêtre (rolling) ===
    array_rolling_mean: (arr: Float64Array, window: number) => Float64Array;
    array_rolling_sum: (arr: Float64Array, window: number) => Float64Array;
    array_rolling_std: (arr: Float64Array, window: number) => Float64Array;
    array_rolling_min: (arr: Float64Array, window: number) => Float64Array;
    array_rolling_max: (arr: Float64Array, window: number) => Float64Array;

    // === Interpolation ===
    array_interpolate_linear: (arr: Float64Array) => Float64Array;
    array_interpolate_cubic: (arr: Float64Array) => Float64Array;

    // === Corrélation et covariance ===
    array_correlation: (a: Float64Array, b: Float64Array) => number;
    array_covariance: (a: Float64Array, b: Float64Array) => number;

    // === Opérations matricielles 2D ===
    matrix_multiply: (a: Float64Array, b: Float64Array, rows_a: number, cols_a: number, cols_b: number) => Float64Array;
    matrix_transpose: (matrix: Float64Array, rows: number, cols: number) => Float64Array;
    matrix_determinant: (matrix: Float64Array, size: number) => number;
    matrix_inverse: (matrix: Float64Array, size: number) => Float64Array;
}

// ========== INTERFACES DE DONNÉES ==========

export interface DescriptiveStats {
    count: number;
    mean: number;
    std: number;
    min: number;
    q25: number;
    median: number;
    q75: number;
    max: number;
    variance: number;
    skewness?: number;
    kurtosis?: number;
}

export interface FrequencyResult {
    value: number;
    count: number;
    frequency: number;
    percentage: number;
}

export interface HistogramBin {
    min: number;
    max: number;
    count: number;
    frequency: number;
    midpoint: number;
}

export interface OutlierResult {
    outliers: number[];
    lowerBound: number;
    upperBound: number;
    q1: number;
    q3: number;
    iqr: number;
}

export interface CorrelationMatrix {
    matrix: number[][];
    columns: string[];
    pValues?: number[][];
}

export interface RollingWindow {
    mean: number[];
    std: number[];
    min: number[];
    max: number[];
    sum: number[];
}

// ========== INTERFACES DES MODULES ==========

export interface MathOperations {
    add(a: Float64Array, b: Float64Array | number): Float64Array;
    subtract(a: Float64Array, b: Float64Array | number): Float64Array;
    multiply(a: Float64Array, b: Float64Array | number): Float64Array;
    divide(a: Float64Array, b: Float64Array | number): Float64Array;
    abs(arr: Float64Array): Float64Array;
    sqrt(arr: Float64Array): Float64Array;
    log(arr: Float64Array): Float64Array;
    exp(arr: Float64Array): Float64Array;
    power(arr: Float64Array, exponent: number): Float64Array;
    sin(arr: Float64Array): Float64Array;
    cos(arr: Float64Array): Float64Array;
    tan(arr: Float64Array): Float64Array;
    floor(arr: Float64Array): Float64Array;
    ceil(arr: Float64Array): Float64Array;
    round(arr: Float64Array): Float64Array;
}

export interface StatisticalOperations {
    sum(arr: Float64Array): number;
    mean(arr: Float64Array): number;
    min(arr: Float64Array): number;
    max(arr: Float64Array): number;
    std(arr: Float64Array): number;
    variance(arr: Float64Array): number;
    median(arr: Float64Array): number;
    percentile(arr: Float64Array, p: number): number;
    quartiles(arr: Float64Array): { q1: number; q2: number; q3: number };
    describe(arr: Float64Array): DescriptiveStats;
    skewness(arr: Float64Array): number;
    kurtosis(arr: Float64Array): number;
    mode(arr: Float64Array): { value: number; count: number };
    range(arr: Float64Array): number;
    iqr(arr: Float64Array): number;
    coefficientOfVariation(arr: Float64Array): number;
}

export interface ArrayOperations {
    sort(arr: Float64Array): Float64Array;
    sortDesc(arr: Float64Array): Float64Array;
    argsort(arr: Float64Array): Uint32Array;
    reverse(arr: Float64Array): Float64Array;
    unique(arr: Float64Array): Float64Array;
    uniqueCount(arr: Float64Array): number;
    slice(arr: Float64Array, start: number, end?: number): Float64Array;
    concat(a: Float64Array, b: Float64Array): Float64Array;
    repeat(arr: Float64Array, times: number): Float64Array;
    sample(arr: Float64Array, n: number, replace?: boolean): Float64Array;
    shuffle(arr: Float64Array): Float64Array;
    head(arr: Float64Array, n?: number): Float64Array;
    tail(arr: Float64Array, n?: number): Float64Array;
}

export interface FilterOperations {
    filterGt(arr: Float64Array, threshold: number): Float64Array;
    filterLt(arr: Float64Array, threshold: number): Float64Array;
    filterEq(arr: Float64Array, value: number): Float64Array;
    filterBetween(arr: Float64Array, min: number, max: number): Float64Array;
    whereGt(arr: Float64Array, threshold: number): Uint32Array;
    whereLt(arr: Float64Array, threshold: number): Uint32Array;
    whereEq(arr: Float64Array, value: number): Uint32Array;
    whereBetween(arr: Float64Array, min: number, max: number): Uint32Array;
}

export interface MissingValueOperations {
    fillna(arr: Float64Array, value: number): Float64Array;
    dropna(arr: Float64Array): Float64Array;
    countNaN(arr: Float64Array): number;
    isna(arr: Float64Array): Uint8Array;
    interpolateLinear(arr: Float64Array): Float64Array;
    interpolateCubic(arr: Float64Array): Float64Array;
    forwardFill(arr: Float64Array): Float64Array;
    backwardFill(arr: Float64Array): Float64Array;
}

export interface WindowOperations {
    rollingMean(arr: Float64Array, window: number): Float64Array;
    rollingSum(arr: Float64Array, window: number): Float64Array;
    rollingStd(arr: Float64Array, window: number): Float64Array;
    rollingMin(arr: Float64Array, window: number): Float64Array;
    rollingMax(arr: Float64Array, window: number): Float64Array;
    expandingMean(arr: Float64Array): Float64Array;
    expandingSum(arr: Float64Array): Float64Array;
    ewm(arr: Float64Array, span: number): Float64Array;
}

export interface FrequencyOperations {
    valueFrequency(arr: Float64Array): FrequencyResult[];
    histogram(arr: Float64Array, bins?: number): HistogramBin[];
    histogramByWidth(arr: Float64Array, binWidth: number): HistogramBin[];
    percentiles(arr: Float64Array, percentilesList: number[]): { [key: number]: number };
    detectOutliers(arr: Float64Array, method?: 'iqr' | 'zscore'): OutlierResult;
    distributionSummary(arr: Float64Array): {
        skewness: number;
        kurtosis: number;
        isApproximatelyNormal: boolean;
    };
}

export interface MatrixOperations {
    multiply(a: Float64Array, b: Float64Array, shapeA: [number, number], shapeB: [number, number]): Float64Array;
    transpose(matrix: Float64Array, rows: number, cols: number): Float64Array;
    determinant(matrix: Float64Array, size: number): number;
    inverse(matrix: Float64Array, size: number): Float64Array;
    eigenvalues(matrix: Float64Array, size: number): Float64Array;
    eigenvectors(matrix: Float64Array, size: number): Float64Array;
    correlation(a: Float64Array, b: Float64Array): number;
    covariance(a: Float64Array, b: Float64Array): number;
    correlationMatrix(data: Float64Array[], columns: string[]): CorrelationMatrix;
}

// ========== INTERFACES DE CONFIGURATION ==========

export interface QuicklyConfig {
    wasmPath?: string;
    enableLogging?: boolean;
    defaultPrecision?: number;
    chunkSize?: number;
}

export interface BenchmarkResult {
    result: any;
    avgTime: number;
    totalTime: number;
    iterations: number;
}

export interface PerformanceComparison {
    wasm: BenchmarkResult;
    js: BenchmarkResult;
    speedup: number;
    operation: string;
}

// ========== TYPES UTILITAIRES ==========

export type ArrayLike = number[] | Float64Array | QuicklyArray;
export type ScalarOrArray = number | ArrayLike;
export type SortOrder = 'asc' | 'desc';
export type InterpolationMethod = 'linear' | 'cubic' | 'nearest' | 'polynomial';
export type AggregationFunction = 'sum' | 'mean' | 'min' | 'max' | 'std' | 'var' | 'count';
export type OutlierMethod = 'iqr' | 'zscore' | 'modified_zscore';

// ========== INTERFACE PRINCIPALE QUICKLYARRAY ==========

export interface QuicklyArrayLike {
    // Propriétés
    readonly length: number;
    readonly values: number[];
    readonly float64Array: Float64Array;

    // Accès aux données
    get(index: number): number;
    set(index: number, value: number): QuicklyArray;
    slice(start: number, end?: number): QuicklyArray;

    // Opérations mathématiques de base (chainables)
    add(other: ScalarOrArray): QuicklyArray;
    subtract(other: ScalarOrArray): QuicklyArray;
    multiply(other: ScalarOrArray): QuicklyArray;
    divide(other: ScalarOrArray): QuicklyArray;

    // Statistiques de base
    sum(): number;
    mean(): number;
    min(): number;
    max(): number;
    std(): number;
    variance(): number;

    // Utilitaires
    copy(): QuicklyArray;
    equals(other: ArrayLike): boolean;
    toString(): string;

    // Accès aux modules spécialisés
    readonly math: MathOperations;
    readonly stats: StatisticalOperations;
    readonly array: ArrayOperations;
    readonly filter: FilterOperations;
    readonly na: MissingValueOperations;
    readonly window: WindowOperations;
    readonly freq: FrequencyOperations;
}

// ========== INTERFACES DES FACTORIES ==========

export interface QuicklyFactoryMethods {
    fromArray(data: number[]): QuicklyArray;
    zeros(length: number): QuicklyArray;
    ones(length: number): QuicklyArray;
    full(length: number, value: number): QuicklyArray;
    range(start: number, end: number, step?: number): QuicklyArray;
    linspace(start: number, end: number, num: number): QuicklyArray;
    random(length: number, min?: number, max?: number): QuicklyArray;
    normal(mean: number, std: number, size: number): QuicklyArray;
    uniform(min: number, max: number, size: number): QuicklyArray;
    exponential(lambda: number, size: number): QuicklyArray;
}

// ========== INTERFACE POUR LES EXTENSIONS FUTURES ==========

export interface QuicklyExtension {
    name: string;
    version: string;
    methods: { [key: string]: Function };
    initialize?(config?: any): void;
    cleanup?(): void;
}

export interface QuicklyPlugin {
    install(QuicklyArray: any, options?: any): void;
    uninstall?(): void;
}