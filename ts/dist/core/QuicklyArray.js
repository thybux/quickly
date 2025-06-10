"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuicklyArray = void 0;
const wasm_loader_1 = require("./wasm-loader");
class QuicklyArray {
    constructor(data) {
        this.data = [...data];
    }
    get length() {
        return this.data.length;
    }
    get values() {
        return [...this.data];
    }
    // === Opérations mathématiques ===
    add(other) {
        const wasm = (0, wasm_loader_1.loadWasm)();
        const a = new Float64Array(this.data);
        const b = new Float64Array(other);
        return Array.from(wasm.array_add(a, b));
    }
    addScalar(scalar) {
        const wasm = (0, wasm_loader_1.loadWasm)();
        const arr = new Float64Array(this.data);
        return Array.from(wasm.array_add_scalar(arr, scalar));
    }
    sum() {
        const wasm = (0, wasm_loader_1.loadWasm)();
        const arr = new Float64Array(this.data);
        return wasm.array_sum(arr);
    }
    subtract(other) {
        const wasm = (0, wasm_loader_1.loadWasm)();
        const a = new Float64Array(this.data);
        const b = new Float64Array(other);
        return Array.from(wasm.array_subtract(a, b));
    }
    multiply(other) {
        const wasm = (0, wasm_loader_1.loadWasm)();
        const a = new Float64Array(this.data);
        const b = new Float64Array(other);
        return Array.from(wasm.array_multiply(a, b));
    }
    mean() {
        const wasm = (0, wasm_loader_1.loadWasm)();
        const arr = new Float64Array(this.data);
        return wasm.array_mean(arr);
    }
    min() {
        const wasm = (0, wasm_loader_1.loadWasm)();
        const arr = new Float64Array(this.data);
        return wasm.array_min(arr);
    }
    max() {
        const wasm = (0, wasm_loader_1.loadWasm)();
        const arr = new Float64Array(this.data);
        return wasm.array_max(arr);
    }
    toString() {
        return `QuicklyArray(${this.length}) [${this.data.join(', ')}]`;
    }
    static fromArray(data) {
        return new QuicklyArray(data);
    }
}
exports.QuicklyArray = QuicklyArray;
//# sourceMappingURL=QuicklyArray.js.map