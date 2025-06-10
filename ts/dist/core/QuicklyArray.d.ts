export declare class QuicklyArray {
    private data;
    constructor(data: number[]);
    get length(): number;
    get values(): number[];
    add(other: number[]): number[];
    addScalar(scalar: number): number[];
    sum(): number;
    subtract(other: number[]): number[];
    multiply(other: number[]): number[];
    mean(): number;
    min(): number;
    max(): number;
    toString(): string;
    static fromArray(data: number[]): QuicklyArray;
}
