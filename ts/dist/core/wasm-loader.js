"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadWasm = loadWasm;
exports.isWasmAvailable = isWasmAvailable;
let wasmModule = null;
function loadWasm() {
    if (wasmModule) {
        return wasmModule;
    }
    try {
        wasmModule = require('../../../rust/pkg/quickly.js');
        return wasmModule;
    }
    catch (error) {
        throw new Error(`Impossible de charger le module WASM: ${error}\n` +
            'Assurez-vous que le WASM a été compilé avec: cd rust && wasm-pack build --target bundler --out-dir pkg');
    }
}
function isWasmAvailable() {
    try {
        loadWasm();
        return true;
    }
    catch {
        return false;
    }
}
//# sourceMappingURL=wasm-loader.js.map