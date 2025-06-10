// ts/debug-simple.js
const path = require('path');
const fs = require('fs');

console.log('🔍 Diagnostic simple WASM');
console.log('=========================');
console.log('📁 Working dir:', process.cwd());

// Test 1: Vérifier structure fichiers
const rustPkg = path.resolve(__dirname, '../rust/pkg');
console.log('📂 Rust pkg path:', rustPkg);
console.log('📂 Existe?', fs.existsSync(rustPkg));

if (fs.existsSync(rustPkg)) {
    const files = fs.readdirSync(rustPkg);
    console.log('📋 Fichiers:', files);
}

// Test 2: Essayer de charger le module
try {
    console.log('\n🧪 Test chargement module...');
    const wasmModule = require('../rust/pkg/quickly.js');
    console.log('✅ Module chargé!');
    console.log('📋 Exports:', Object.keys(wasmModule));

    // Test fonction
    if (wasmModule.array_sum) {
        const result = wasmModule.array_sum(new Float64Array([1, 2, 3]));
        console.log('🧮 Test sum([1,2,3]):', result);
    }
} catch (error) {
    console.error('❌ Erreur chargement:', error.message);
    console.error('📍 Stack complet:', error.stack);
}