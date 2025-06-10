import { QuicklyArray } from './core/QuicklyArray';
export { loadWasm, isWasmAvailable } from './core/wasm-loader';

export const VERSION = '1.0.0';

export function testWasm(): boolean {
    try {
        const arr = new QuicklyArray([1, 2, 3]);
        const sum = arr.sum();

        if (sum === 6) {
            console.log('✅ Test WASM basique réussi');
            return true;
        } else {
            console.log(`❌ Test WASM échoué: attendu 6, reçu ${sum}`);
            return false;
        }
    } catch (error) {
        // @ts-ignore
        console.error('❌ WASM test failed:', error.message);
        return false;
    }
}