use wasm_bindgen::prelude::*;

/// Additionne deux tableaux élément par élément
/// Retourne un nouveau tableau avec les résultats
#[wasm_bindgen]
pub fn array_add(a: &[f64], b: &[f64]) -> Vec<f64> {
    if a.len() != b.len() {
        let min_len = a.len().min(b.len());
        return a[..min_len]
            .iter()
            .zip(b[..min_len].iter())
            .map(|(x, y)| x + y)
            .collect();
    }

    a.iter().zip(b.iter()).map(|(x, y)| x + y).collect()
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

/// Soustrait deux tableaux élément par élément
#[wasm_bindgen]
pub fn array_subtract(a: &[f64], b: &[f64]) -> Vec<f64> {
    if a.len() != b.len() {
        let min_len = a.len().min(b.len());
        return a[..min_len]
            .iter()
            .zip(b[..min_len].iter())
            .map(|(x, y)| x - y)
            .collect();
    }

    a.iter().zip(b.iter()).map(|(x, y)| x - y).collect()
}

/// Soustrait un scalaire à tous les éléments d'un tableau
#[wasm_bindgen]
pub fn array_subtract_scalar(arr: &[f64], scalar: f64) -> Vec<f64> {
    arr.iter().map(|x| x - scalar).collect()
}

/// Multiplie deux tableaux élément par élément
#[wasm_bindgen]
pub fn array_multiply(a: &[f64], b: &[f64]) -> Vec<f64> {
    if a.len() != b.len() {
        let min_len = a.len().min(b.len());
        return a[..min_len]
            .iter()
            .zip(b[..min_len].iter())
            .map(|(x, y)| x * y)
            .collect();
    }

    a.iter().zip(b.iter()).map(|(x, y)| x * y).collect()
}

/// Multiplie un scalaire à tous les éléments d'un tableau
#[wasm_bindgen]
pub fn array_multiply_scalar(arr: &[f64], scalar: f64) -> Vec<f64> {
    arr.iter().map(|x| x * scalar).collect()
}

/// Divise deux tableaux élément par élément
#[wasm_bindgen]
pub fn array_divide(a: &[f64], b: &[f64]) -> Vec<f64> {
    if b.is_empty() || a.is_empty() {
        panic!("Cannot divide by an empty array");
    }

    if a.len() != b.len() {
        let min_len = a.len().min(b.len());
        return a[..min_len]
            .iter()
            .zip(b[..min_len].iter())
            .map(|(x, y)| x / y)
            .collect();
    }

    a.iter().zip(b.iter()).map(|(x, y)| x / y).collect()
}

/// Divise tous les éléments d'un tableau par un scalaire
#[wasm_bindgen]
pub fn array_divide_scalar(arr: &[f64], scalar: f64) -> Vec<f64> {
    if scalar == 0.0 {
        panic!("Division by zero is not allowed");
    }
    arr.iter().map(|x| x / scalar).collect()
}

/// Calcul de la moyenne d'un tableau
#[wasm_bindgen]
pub fn array_mean(arr: &[f64]) -> f64 {
    if arr.is_empty() {
        panic!("Cannot calculate mean of an empty array");
    }
    array_sum(arr) / arr.len() as f64
}

/// Calcul du minimum d'un tableau
#[wasm_bindgen]
pub fn array_min(arr: &[f64]) -> f64 {
    if arr.is_empty() {
        panic!("Cannot calculate min of an empty array");
    }
    *arr.iter().min_by(|a, b| a.partial_cmp(b).unwrap()).unwrap()
}

/// Calcul du maximum d'un tableau
#[wasm_bindgen]
pub fn array_max(arr: &[f64]) -> f64 {
    if arr.is_empty() {
        panic!("Cannot calculate max of an empty array");
    }
    *arr.iter().max_by(|a, b| a.partial_cmp(b).unwrap()).unwrap()
}

/// Calcul de l'écart-type d'un tableau
#[wasm_bindgen]
pub fn array_std(arr: &[f64]) -> f64 {
    if arr.len() < 2 {
        panic!("Cannot calculate standard deviation of an array with less than 2 elements");
    }
    let mean = array_mean(arr);
    let variance = arr.iter().map(|x| (x - mean).powi(2)).sum::<f64>() / (arr.len() as f64 - 1.0);
    variance.sqrt()
}

/// Calcul de la variance d'un tableau
#[wasm_bindgen]
pub fn array_variance(arr: &[f64]) -> f64 {
    if arr.len() < 2 {
        panic!("Cannot calculate variance of an array with less than 2 elements");
    }
    let mean = array_mean(arr);
    arr.iter().map(|x| (x - mean).powi(2)).sum::<f64>() / (arr.len() as f64 - 1.0)
}

// TODO:
/*
add() - Addition élément par élément ✅
addScalar() - Addition scalaire ✅
sum() - Somme totale ✅
subtract() - Soustraction élément par élément ✅
subtractScalar() - Soustraction scalaire ✅
multiply() - Multiplication élément par élément ✅
multiplyScalar() - Multiplication scalaire ✅
divide() - Division élément par éléments ✅
divideScalar() - Division scalaire ✅
mean() - Moyenne ✅
min() / max() - Min/Max ✅
std() - Écart-type ✅
variance() - Variance ✅
*/
