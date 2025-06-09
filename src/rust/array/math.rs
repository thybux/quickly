use wasm_bindgen::prelude::*;

/// Additionne deux tableaux élément par élément
/// Retourne un nouveau tableau avec les résultats
#[wasm_bindgen]
pub fn array_add(a: &[f64], b: &[f64]) -> Vec<f64> {
    if a.len() != b.len() {
        // En cas de tailles différentes, on prend la plus petite
        let min_len = a.len().min(b.len());
        return a[..min_len]
            .iter()
            .zip(b[..min_len].iter())
            .map(|(x, y)| x + y)
            .collect();
    }
    
    a.iter()
        .zip(b.iter())
        .map(|(x, y)| x + y)
        .collect()
}

/// Additionne un scalaire à tous les éléments d'un tableau
#[wasm_bindgen]
pub fn array_add_scalar(arr: &[f64], scalar: f64) -> Vec<f64> {
    arr.iter().map(|x| x + scalar).collect()
}

/// Additionne tous les éléments d'un tableau (somme)
#[wasm_bindgen]
pub fn array_sum(arr: &[f64]) -> f64 {
    arr.iter().sum()
}
