interface WasmModule {
    // Opérations de base
    array_add: (a: Float64Array, b: Float64Array) => Float64Array;
    array_add_scalar: (arr: Float64Array, scalar: number) => Float64Array;
    array_sum: (arr: Float64Array) => number;
    array_subtract: (a: Float64Array, b: Float64Array) => Float64Array;
    array_subtract_scalar: (arr: Float64Array, scalar: number) => Float64Array;
    array_multiply: (a: Float64Array, b: Float64Array) => Float64Array;
    array_multiply_scalar: (arr: Float64Array, scalar: number) => Float64Array;
    array_divide: (a: Float64Array, b: Float64Array) => Float64Array;
    array_divide_scalar: (arr: Float64Array, scalar: number) => Float64Array;

    // Statistiques
    array_mean: (arr: Float64Array) => number;
    array_min: (arr: Float64Array) => number;
    array_max: (arr: Float64Array) => number;
    array_std: (arr: Float64Array) => number;
    array_variance: (arr: Float64Array) => number;
    array_median: (arr: Float64Array) => number;
    array_percentile: (arr: Float64Array, percentile: number) => number;

    // Filtrage et tri
    array_filter_gt: (arr: Float64Array, threshold: number) => Float64Array;
    array_filter_lt: (arr: Float64Array, threshold: number) => Float64Array;
    array_where_gt: (arr: Float64Array, threshold: number) => Uint32Array;
    array_sort: (arr: Float64Array) => Float64Array;
    array_sort_desc: (arr: Float64Array) => Float64Array;

    // Fonctions mathématiques
    array_abs: (arr: Float64Array) => Float64Array;
    array_sqrt: (arr: Float64Array) => Float64Array;
    array_log: (arr: Float64Array) => Float64Array;
    array_exp: (arr: Float64Array) => Float64Array;

    // Fonctions cumulatives
    array_cumsum: (arr: Float64Array) => Float64Array;
    array_cumprod: (arr: Float64Array) => Float64Array;
    array_diff: (arr: Float64Array) => Float64Array;

    // Manipulation
    array_slice: (arr: Float64Array, start: number, end: number) => Float64Array;
    array_concat: (a: Float64Array, b: Float64Array) => Float64Array;
    array_repeat: (arr: Float64Array, times: number) => Float64Array;

    // Gestion des valeurs manquantes
    array_fillna: (arr: Float64Array, value: number) => Float64Array;
    array_dropna: (arr: Float64Array) => Float64Array;
    array_count_nan: (arr: Float64Array) => number;
    array_unique_count: (arr: Float64Array) => number;
}

let wasmModule: WasmModule | null = null;
let wasmPromise: Promise<WasmModule> | null = null;

export async function loadWasmAsync(): Promise<WasmModule> {
    if (wasmModule) {
        return wasmModule;
    }

    if (wasmPromise) {
        return wasmPromise;
    }

    wasmPromise = new Promise(async (resolve, reject) => {
        try {
            // Essayez différents chemins selon votre structure de projet
            const wasmPaths = [
                '../../../rust/pkg/quickly.js',
                './rust/pkg/quickly.js',
                '@/rust/pkg/quickly.js',
                process.env.NODE_ENV === 'production' ? './wasm/quickly.js' : '../../../rust/pkg/quickly.js'
            ];

            let loadedModule = null;
            let lastError = null;

            for (const path of wasmPaths) {
                try {
                    loadedModule = await import(path);
                    break;
                } catch (error) {
                    lastError = error;
                    continue;
                }
            }

            if (!loadedModule) {
                throw new Error(
                    `Impossible de charger le module WASM. Dernière erreur: ${lastError}\n` +
                    'Chemins tentés: ' + wasmPaths.join(', ') + '\n' +
                    'Assurez-vous que le WASM a été compilé avec: cd rust && wasm-pack build --target bundler --out-dir pkg'
                );
            }

            // Initialisation du module WASM si nécessaire
            if (typeof loadedModule.default === 'function') {
                await loadedModule.default();
            }

            wasmModule = loadedModule;
            resolve(loadedModule);
        } catch (error) {
            wasmPromise = null; // Reset pour permettre une nouvelle tentative
            reject(error);
        }
    });

    return wasmPromise;
}

// Version synchrone (pour compatibilité avec votre code existant)
export function loadWasm(): WasmModule {
    if (wasmModule) {
        return wasmModule;
    }

    try {
        // Essayez le chargement synchrone
        const loadedModule = require('../../../rust/pkg/quickly.js');
        wasmModule = loadedModule;
        return loadedModule;
    } catch (error) {
        throw new Error(
            `Impossible de charger le module WASM de manière synchrone: ${error}\n` +
            'Utilisez loadWasmAsync() pour un chargement asynchrone, ou assurez-vous que le WASM a été compilé avec: cd rust && wasm-pack build --target bundler --out-dir pkg'
        );
    }
}

export function isWasmAvailable(): boolean {
    try {
        loadWasm();
        return true;
    } catch {
        return false;
    }
}

export async function isWasmAvailableAsync(): Promise<boolean> {
    try {
        await loadWasmAsync();
        return true;
    } catch {
        return false;
    }
}

// Fonction utilitaire pour benchmarking
export function benchmarkWasm<T>(fn: () => T, iterations: number = 1000): { result: T; avgTime: number; totalTime: number } {
    const start = performance.now();
    let result: T;

    for (let i = 0; i < iterations; i++) {
        result = fn();
    }

    const end = performance.now();
    const totalTime = end - start;

    return {
        result: result!,
        avgTime: totalTime / iterations,
        totalTime
    };
}

// Fonction pour vérifier la performance WASM vs JS natif
export function comparePerformance(data: number[], iterations: number = 100) {
    const arr = new Float64Array(data);

    // Test WASM
    const wasmResult = benchmarkWasm(() => {
        const wasm = loadWasm();
        return wasm.array_sum(arr);
    }, iterations);

    // Test JS natif
    const jsResult = benchmarkWasm(() => {
        return data.reduce((a, b) => a + b, 0);
    }, iterations);

    return {
        wasm: wasmResult,
        js: jsResult,
        speedup: jsResult.avgTime / wasmResult.avgTime
    };
}