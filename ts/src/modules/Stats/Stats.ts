import { loadWasm } from '../../core/wasm-loader';

/**
 * Interface pour les résultats statistiques descriptifs
 */
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
}

/**
 * Classe pour les opérations statistiques
 */
export class StatsOps {
    /**
     * Somme de tous les éléments
     */
    static sum(arr: Float64Array): number {
        const wasm = loadWasm();
        return wasm.array_sum(arr);
    }

    /**
     * Moyenne arithmétique
     */
    static mean(arr: Float64Array): number {
        const wasm = loadWasm();
        return wasm.array_mean(arr);
    }

    /**
     * Valeur minimale
     */
    static min(arr: Float64Array): number {
        const wasm = loadWasm();
        return wasm.array_min(arr);
    }

    /**
     * Valeur maximale
     */
    static max(arr: Float64Array): number {
        const wasm = loadWasm();
        return wasm.array_max(arr);
    }

    /**
     * Écart-type
     */
    static std(arr: Float64Array): number {
        const wasm = loadWasm();
        return wasm.array_std(arr);
    }

    /**
     * Variance
     */
    static variance(arr: Float64Array): number {
        const wasm = loadWasm();
        return wasm.array_variance(arr);
    }

    /**
     * Médiane
     */
    static median(arr: Float64Array): number {
        const wasm = loadWasm();
        return wasm.array_median(arr);
    }

    /**
     * Percentile
     */
    static percentile(arr: Float64Array, p: number): number {
        const wasm = loadWasm();
        return wasm.array_percentile(arr, p);
    }

    /**
     * Quartiles (Q1, Q2/médiane, Q3)
     */
    static quartiles(arr: Float64Array): { q1: number; q2: number; q3: number } {
        return {
            q1: this.percentile(arr, 25),
            q2: this.median(arr),
            q3: this.percentile(arr, 75)
        };
    }

    /**
     * Statistiques descriptives complètes
     */
    static describe(arr: Float64Array): DescriptiveStats {
        const quartiles = this.quartiles(arr);

        return {
            count: arr.length,
            mean: this.mean(arr),
            std: this.std(arr),
            min: this.min(arr),
            q25: quartiles.q1,
            median: quartiles.q2,
            q75: quartiles.q3,
            max: this.max(arr),
            variance: this.variance(arr)
        };
    }

    /**
     * Somme cumulative
     */
    static cumsum(arr: Float64Array): Float64Array {
        const wasm = loadWasm();
        return wasm.array_cumsum(arr);
    }

    /**
     * Produit cumulatif
     */
    static cumprod(arr: Float64Array): Float64Array {
        const wasm = loadWasm();
        return wasm.array_cumprod(arr);
    }

    /**
     * Différences entre éléments consécutifs
     */
    static diff(arr: Float64Array): Float64Array {
        const wasm = loadWasm();
        return wasm.array_diff(arr);
    }

    /**
     * Nombre de valeurs uniques
     */
    static uniqueCount(arr: Float64Array): number {
        const wasm = loadWasm();
        return wasm.array_unique_count(arr);
    }

    /**
     * Coefficient de variation (écart-type / moyenne)
     */
    static coefficientOfVariation(arr: Float64Array): number {
        const mean = this.mean(arr);
        const std = this.std(arr);
        return mean !== 0 ? std / Math.abs(mean) : NaN;
    }

    /**
     * Étendue (max - min)
     */
    static range(arr: Float64Array): number {
        return this.max(arr) - this.min(arr);
    }
}