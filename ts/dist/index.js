"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VERSION = exports.isWasmAvailable = exports.loadWasm = void 0;
exports.testWasm = testWasm;
const QuicklyArray_1 = require("./core/QuicklyArray");
var wasm_loader_1 = require("./core/wasm-loader");
Object.defineProperty(exports, "loadWasm", { enumerable: true, get: function () { return wasm_loader_1.loadWasm; } });
Object.defineProperty(exports, "isWasmAvailable", { enumerable: true, get: function () { return wasm_loader_1.isWasmAvailable; } });
exports.VERSION = '1.0.0';
function testWasm() {
    try {
        const arr = new QuicklyArray_1.QuicklyArray([1, 2, 3]);
        const sum = arr.sum();
        if (sum === 6) {
            console.log('✅ Test WASM basique réussi');
            return true;
        }
        else {
            console.log(`❌ Test WASM échoué: attendu 6, reçu ${sum}`);
            return false;
        }
    }
    catch (error) {
        // @ts-ignore
        console.error('❌ WASM test failed:', error.message);
        return false;
    }
}
//# sourceMappingURL=index.js.map