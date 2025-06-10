// Types pour le module WASM généré par wasm-pack
declare module '../wasm-pkg/quickly' {
    // Fonctions mathématiques de base
    export function array_add(a: Float64Array, b: Float64Array): Float64Array;
    export function array_add_scalar(arr: Float64Array, scalar: number): Float64Array;
    export function array_sum(arr: Float64Array): number;

    export function array_subtract(a: Float64Array, b: Float64Array): Float64Array;
    export function array_subtract_scalar(arr: Float64Array, scalar: number): Float64Array;

    export function array_multiply(a: Float64Array, b: Float64Array): Float64Array;
    export function array_multiply_scalar(arr: Float64Array, scalar: number): Float64Array;

    export function array_divide(a: Float64Array, b: Float64Array): Float64Array;
    export function array_divide_scalar(arr: Float64Array, scalar: number): Float64Array;

    // Fonctions statistiques
    export function array_mean(arr: Float64Array): number;
    export function array_min(arr: Float64Array): number;
    export function array_max(arr: Float64Array): number;
    export function array_std(arr: Float64Array): number;
    export function array_variance(arr: Float64Array): number;

    // Fonctions legacy
    export function fast_sum(numbers: Float64Array): number;
    export function fast_average(numbers: Float64Array): number;
    export function fast_sort(numbers: Float64Array): Float64Array;

    // Fonctions d'initialisation WASM
    export default function init(): Promise<void>;
    export function initSync(module: WebAssembly.Module): void;
}