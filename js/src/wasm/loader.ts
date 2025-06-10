// Loader pour le module WASM avec gestion d'erreurs

let wasmModule: any = null;
let isLoading = false;
let loadError: Error | null = null;

/**
 * Charge le module WASM de manière asynchrone
 */
export async function loadWasmModule(): Promise<any> {
    if (wasmModule) {
        return wasmModule;
    }

    if (loadError) {
        throw loadError;
    }

    if (isLoading) {
        // Attendre que le chargement en cours se termine
        while (isLoading && !wasmModule && !loadError) {
            await new Promise(resolve => setTimeout(resolve, 10));
        }
        if (wasmModule) return wasmModule;
        if (loadError) throw loadError;
    }

    isLoading = true;

    try {
        // Essayer de charger le module WASM
        const wasmPkg = await import('../wasm-pkg/quickly');

        // Initialiser le module si nécessaire (pour les versions bundler)
        if (typeof wasmPkg.default === 'function') {
            await wasmPkg.default();
        }

        wasmModule = wasmPkg;
        isLoading = false;
        return wasmModule;
    } catch (error) {
        isLoading = false;
        loadError = new Error(
            `Impossible de charger le module WASM: ${error instanceof Error ? error.message : error}\n` +
            'Assurez-vous que le module WASM a été compilé avec "npm run build:wasm"'
        );
        throw loadError;
    }
}

/**
 * Charge le module WASM de manière synchrone (pour Node.js)
 */
export function loadWasmModuleSync(): any {
    if (wasmModule) {
        return wasmModule;
    }

    if (loadError) {
        throw loadError;
    }

    try {
        // Chargement synchrone pour Node.js
        wasmModule = require('../wasm-pkg/quickly');
        return wasmModule;
    } catch (error) {
        loadError = new Error(
            `Impossible de charger le module WASM (sync): ${error instanceof Error ? error.message : error}\n` +
            'Vérifiez que le module WASM existe dans wasm-pkg/'
        );
        throw loadError;
    }
}

/**
 * Vérifie si le module WASM est disponible
 */
export function isWasmAvailable(): boolean {
    try {
        loadWasmModuleSync();
        return true;
    } catch {
        return false;
    }
}

/**
 * Obtient des informations sur le statut du module WASM
 */
export function getWasmStatus(): { loaded: boolean; error?: string } {
    if (wasmModule) {
        return { loaded: true };
    }

    if (loadError) {
        return { loaded: false, error: loadError.message };
    }

    try {
        loadWasmModuleSync();
        return { loaded: true };
    } catch (error) {
        return {
            loaded: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        };
    }
}

/**
 * Reset le cache (utile pour les tests)
 */
export function resetWasmModule(): void {
    wasmModule = null;
    isLoading = false;
    loadError = null;
}