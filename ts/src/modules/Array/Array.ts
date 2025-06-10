import { loadWasm } from '../../core/wasm-loader';

/**
 * Classe pour la manipulation de tableaux
 */
export class ArrayOps {
    /**
     * Trie en ordre croissant
     */
    static sort(arr: Float64Array): Float64Array {
        const wasm = loadWasm();
        return wasm.array_sort(arr);
    }

    /**
     * Trie en ordre décroissant
     */
    static sortDesc(arr: Float64Array): Float64Array {
        const wasm = loadWasm();
        return wasm.array_sort_desc(arr);
    }

    /**
     * Filtre les valeurs supérieures à un seuil
     */
    static filterGt(arr: Float64Array, threshold: number): Float64Array {
        const wasm = loadWasm();
        return wasm.array_filter_gt(arr, threshold);
    }

    /**
     * Filtre les valeurs inférieures à un seuil
     */
    static filterLt(arr: Float64Array, threshold: number): Float64Array {
        const wasm = loadWasm();
        return wasm.array_filter_lt(arr, threshold);
    }

    /**
     * Retourne les indices où les valeurs sont supérieures au seuil
     */
    static whereGt(arr: Float64Array, threshold: number): Uint32Array {
        const wasm = loadWasm();
        return wasm.array_where_gt(arr, threshold);
    }

    /**
     * Extrait une portion du tableau
     */
    static slice(arr: Float64Array, start: number, end?: number): Float64Array {
        const wasm = loadWasm();
        const endIndex = end ?? arr.length;
        return wasm.array_slice(arr, start, endIndex);
    }

    /**
     * Concatène deux tableaux
     */
    static concat(a: Float64Array, b: Float64Array): Float64Array {
        const wasm = loadWasm();
        return wasm.array_concat(a, b);
    }

    /**
     * Répète un tableau n fois
     */
    static repeat(arr: Float64Array, times: number): Float64Array {
        const wasm = loadWasm();
        return wasm.array_repeat(arr, times);
    }

    /**
     * Remplace les valeurs NaN par une valeur donnée
     */
    static fillna(arr: Float64Array, fillValue: number): Float64Array {
        const wasm = loadWasm();
        return wasm.array_fillna(arr, fillValue);
    }

    /**
     * Supprime les valeurs NaN
     */
    static dropna(arr: Float64Array): Float64Array {
        const wasm = loadWasm();
        return wasm.array_dropna(arr);
    }

    /**
     * Compte les valeurs NaN
     */
    static countNaN(arr: Float64Array): number {
        const wasm = loadWasm();
        return wasm.array_count_nan(arr);
    }

    /**
     * Inverse l'ordre des éléments
     */
    static reverse(arr: Float64Array): Float64Array {
        return new Float64Array(Array.from(arr).reverse());
    }

    /**
     * Trouve l'index du premier élément égal à la valeur
     */
    static indexOf(arr: Float64Array, value: number): number {
        for (let i = 0; i < arr.length; i++) {
            if (arr[i] === value) return i;
        }
        return -1;
    }

    /**
     * Vérifie si le tableau contient une valeur
     */
    static includes(arr: Float64Array, value: number): boolean {
        return this.indexOf(arr, value) !== -1;
    }

    /**
     * Retourne les premiers n éléments
     */
    static head(arr: Float64Array, n: number = 5): Float64Array {
        return this.slice(arr, 0, n);
    }

    /**
     * Retourne les derniers n éléments
     */
    static tail(arr: Float64Array, n: number = 5): Float64Array {
        return this.slice(arr, Math.max(0, arr.length - n));
    }

    /**
     * Échantillonnage aléatoire
     */
    static sample(arr: Float64Array, n: number): Float64Array {
        if (n >= arr.length) return new Float64Array(arr);

        const indices = Array.from({ length: arr.length }, (_, i) => i);
        const sampledIndices = [];

        for (let i = 0; i < n; i++) {
            const randomIndex = Math.floor(Math.random() * indices.length);
            sampledIndices.push(indices.splice(randomIndex, 1)[0]);
        }

        return new Float64Array(sampledIndices.map(i => arr[i]));
    }

    /**
     * Mélange aléatoirement les éléments
     */
    static shuffle(arr: Float64Array): Float64Array {
        const result = Array.from(arr);
        for (let i = result.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [result[i], result[j]] = [result[j], result[i]];
        }
        return new Float64Array(result);
    }
}