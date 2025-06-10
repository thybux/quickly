import { NumericArray, ArrayMath, ArrayConstructorOptions, StatisticalResult } from '../types/array';
import { WasmBindings } from '../wasm/bindings';

/**
 * QuicklyArray - Classe principale pour les opérations sur arrays
 * Style pandas Series avec backend Rust/WASM
 */
export class QuicklyArray implements ArrayMath {
    private data: number[];
    private readonly options: ArrayConstructorOptions;

    constructor(data: NumericArray, options: ArrayConstructorOptions = {}) {
        this.options = {
            validateInput: true,
            convertToFloat64: true,
            ...options
        };

        // Convertir tous les types en number[]
        if (Array.isArray(data)) {
            this.data = [...data];
        } else {
            this.data = Array.from(data);
        }

        if (this.options.validateInput) {
            this.validateData();
        }
    }

    // === Getters ===

    get length(): number {
        return this.data.length;
    }

    get values(): number[] {
        return [...this.data]; // Copie pour éviter les mutations
    }

    get isEmpty(): boolean {
        return this.data.length === 0;
    }

    // === Validation ===

    private validateData(): void {
        if (this.data.some(val => typeof val !== 'number')) {
            throw new Error('All elements must be numbers');
        }
    }

    // === Opérations binaires ===

    add(other: NumericArray): number[] {
        const otherArray = Array.isArray(other) ? other : Array.from(other);
        return WasmBindings.arrayAdd(this.data, otherArray);
    }

    subtract(other: NumericArray): number[] {
        const otherArray = Array.isArray(other) ? other : Array.from(other);
        return WasmBindings.arraySubtract(this.data, otherArray);
    }

    multiply(other: NumericArray): number[] {
        const otherArray = Array.isArray(other) ? other : Array.from(other);
        return WasmBindings.arrayMultiply(this.data, otherArray);
    }

    divide(other: NumericArray): number[] {
        const otherArray = Array.isArray(other) ? other : Array.from(other);
        return WasmBindings.arrayDivide(this.data, otherArray);
    }

    // === Opérations avec scalaires ===

    addScalar(scalar: number): number[] {
        return WasmBindings.arrayAddScalar(this.data, scalar);
    }

    subtractScalar(scalar: number): number[] {
        return WasmBindings.arraySubtractScalar(this.data, scalar);
    }

    multiplyScalar(scalar: number): number[] {
        return WasmBindings.arrayMultiplyScalar(this.data, scalar);
    }

    divideScalar(scalar: number): number[] {
        return WasmBindings.arrayDivideScalar(this.data, scalar);
    }

    // === Agrégations ===

    sum(): number {
        return WasmBindings.arraySum(this.data);
    }

    mean(): number {
        return WasmBindings.arrayMean(this.data);
    }

    min(): number {
        return WasmBindings.arrayMin(this.data);
    }

    max(): number {
        return WasmBindings.arrayMax(this.data);
    }

    std(): number {
        return WasmBindings.arrayStd(this.data);
    }

    variance(): number {
        return WasmBindings.arrayVariance(this.data);
    }

    // === Méthodes de commodité ===

    /**
     * Obtient toutes les statistiques en une fois
     */
    describe(): StatisticalResult {
        return {
            mean: this.mean(),
            min: this.min(),
            max: this.max(),
            std: this.std(),
            variance: this.variance(),
            sum: this.sum(),
            count: this.length
        };
    }

    /**
     * Applique une fonction à chaque élément (immutable)
     */
    map(fn: (value: number, index: number) => number): QuicklyArray {
        const newData = this.data.map(fn);
        return new QuicklyArray(newData, this.options);
    }

    /**
     * Filtre les éléments (immutable)
     */
    filter(fn: (value: number, index: number) => boolean): QuicklyArray {
        const newData = this.data.filter(fn);
        return new QuicklyArray(newData, this.options);
    }

    /**
     * Crée une copie de l'array
     */
    copy(): QuicklyArray {
        return new QuicklyArray(this.data, this.options);
    }

    /**
     * Convertit en array JavaScript standard
     */
    toArray(): number[] {
        return this.values;
    }

    // === Méthodes statiques ===

    /**
     * Crée un nouveau QuicklyArray à partir d'un array
     */
    static fromArray(data: number[], options?: ArrayConstructorOptions): QuicklyArray {
        return new QuicklyArray(data, options);
    }

    /**
     * Crée un array rempli de zéros
     */
    static zeros(length: number, options?: ArrayConstructorOptions): QuicklyArray {
        return new QuicklyArray(new Array(length).fill(0), options);
    }

    /**
     * Crée un array rempli de uns
     */
    static ones(length: number, options?: ArrayConstructorOptions): QuicklyArray {
        return new QuicklyArray(new Array(length).fill(1), options);
    }

    /**
     * Crée un array avec une séquence de nombres
     */
    static range(start: number, stop: number, step: number = 1, options?: ArrayConstructorOptions): QuicklyArray {
        const data: number[] = [];
        for (let i = start; i < stop; i += step) {
            data.push(i);
        }
        return new QuicklyArray(data, options);
    }

    /**
     * Crée un array avec des nombres aléatoires
     */
    static random(length: number, min: number = 0, max: number = 1, options?: ArrayConstructorOptions): QuicklyArray {
        const data = Array.from({ length }, () => Math.random() * (max - min) + min);
        return new QuicklyArray(data, options);
    }

    // === Affichage ===

    toString(): string {
        if (this.isEmpty) {
            return 'QuicklyArray(0) []';
        }

        const preview = this.data.length > 10
            ? `[${this.data.slice(0, 5).join(', ')}, ..., ${this.data.slice(-5).join(', ')}]`
            : `[${this.data.join(', ')}]`;

        return `QuicklyArray(${this.length}) ${preview}`;
    }

    /**
     * Affichage détaillé avec statistiques
     */
    info(): string {
        if (this.isEmpty) {
            return 'QuicklyArray vide';
        }

        const stats = this.describe();
        return `
QuicklyArray Information:
========================
Length: ${this.length}
Sum: ${stats.sum.toFixed(3)}
Mean: ${stats.mean.toFixed(3)}
Std: ${stats.std.toFixed(3)}
Min: ${stats.min.toFixed(3)}
Max: ${stats.max.toFixed(3)}
`.trim();
    }
}