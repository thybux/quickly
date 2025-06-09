use wasm_bindgen::prelude::*;

// Import de la fonction console.log pour le debug
#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}

// Macro pour simplifier console.log
macro_rules! console_log {
    ($($t:tt)*) => (log(&format_args!($($t)*).to_string()))
}

// Fonction principale : calcul rapide de la somme d'un tableau
#[wasm_bindgen]
pub fn fast_sum(numbers: &[f64]) -> f64 {
    console_log!("Calcul de la somme de {} nombres avec Rust", numbers.len());
    // Utilisation de l'itérateur Rust pour une performance optimale
    numbers.iter().sum()
}

// Fonction bonus : calcul de la moyenne
#[wasm_bindgen]
pub fn fast_average(numbers: &[f64]) -> f64 {
    if numbers.is_empty() {
        return 0.0;
    }
    
    let sum: f64 = numbers.iter().sum();
    sum / numbers.len() as f64
}

// Fonction pour démontrer la vitesse : tri rapide
#[wasm_bindgen]
pub fn fast_sort(mut numbers: Vec<f64>) -> Vec<f64> {
    console_log!("Tri de {} nombres avec Rust", numbers.len());
    numbers.sort_by(|a, b| a.partial_cmp(b).unwrap());
    numbers
}
