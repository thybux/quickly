import { loadWasm } from '../../core/wasm-loader';

/**
 * Classe pour les opérations mathématiques sur les tableaux
 */
export class MathOps {
    /**
     * Addition élément par élément ou scalaire
     */
    static add(a: Float64Array, b: Float64Array | number): Float64Array {
        const wasm = loadWasm();

        if (typeof b === 'number') {
            return wasm.array_add_scalar(a, b);
        } else {
            return wasm.array_add(a, b);
        }
    }

    /**
     * Soustraction élément par élément ou scalaire
     */
    static subtract(a: Float64Array, b: Float64Array | number): Float64Array {
        const wasm = loadWasm();

        if (typeof b === 'number') {
            return wasm.array_subtract_scalar(a, b);
        } else {
            return wasm.array_subtract(a, b);
        }
    }

    /**
     * Multiplication élément par élément ou scalaire
     */
    static multiply(a: Float64Array, b: Float64Array | number): Float64Array {
        const wasm = loadWasm();

        if (typeof b === 'number') {
            return wasm.array_multiply_scalar(a, b);
        } else {
            return wasm.array_multiply(a, b);
        }
    }

    /**
     * Division élément par élément ou scalaire
     */
    static divide(a: Float64Array, b: Float64Array | number): Float64Array {
        const wasm = loadWasm();

        if (typeof b === 'number') {
            return wasm.array_divide_scalar(a, b);
        } else {
            return wasm.array_divide(a, b);
        }
    }

    /**
     * Valeur absolue
     */
    static abs(arr: Float64Array): Float64Array {
        const wasm = loadWasm();
        return wasm.array_abs(arr);
    }

    /**
     * Racine carrée
     */
    static sqrt(arr: Float64Array): Float64Array {
        const wasm = loadWasm();
        return wasm.array_sqrt(arr);
    }

    /**
     * Logarithme naturel
     */
    static log(arr: Float64Array): Float64Array {
        const wasm = loadWasm();
        return wasm.array_log(arr);
    }

    /**
     * Exponentielle
     */
    static exp(arr: Float64Array): Float64Array {
        const wasm = loadWasm();
        return wasm.array_exp(arr);
    }

    /**
     * Puissance (TODO: à implémenter en Rust)
     */
    static power(arr: Float64Array, exponent: number): Float64Array {
        // Version JavaScript temporaire
        return new Float64Array(Array.from(arr).map(x => Math.pow(x, exponent)));
    }
}