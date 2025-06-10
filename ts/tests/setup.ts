// Configuration des tests
import { isWasmAvailable } from '../src';

console.log('🧪 Test setup...');

if (!isWasmAvailable()) {
    console.warn('⚠️  WASM module not available - some tests will be skipped');
    console.warn('   Run: cd rust && wasm-pack build --target bundler --out-dir pkg');
}