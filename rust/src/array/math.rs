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
            .map(|(x, y)| {
                if *y == 0.0 {
                    f64::INFINITY
                } else {
                    x / y
                }
            })
            .collect();
    }

    a.iter().zip(b.iter()).map(|(x, y)| {
        if *y == 0.0 {
            f64::INFINITY
        } else {
            x / y
        }
    }).collect()
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
        return f64::NAN;
    }
    array_sum(arr) / arr.len() as f64
}

/// Calcul du minimum d'un tableau
#[wasm_bindgen]
pub fn array_min(arr: &[f64]) -> f64 {
    if arr.is_empty() {
        return f64::NAN;
    }
    *arr.iter().min_by(|a, b| a.partial_cmp(b).unwrap()).unwrap()
}

/// Calcul du maximum d'un tableau
#[wasm_bindgen]
pub fn array_max(arr: &[f64]) -> f64 {
    if arr.is_empty() {
        return f64::NAN;
    }
    *arr.iter().max_by(|a, b| a.partial_cmp(b).unwrap()).unwrap()
}

/// Calcul de l'écart-type d'un tableau
#[wasm_bindgen]
pub fn array_std(arr: &[f64]) -> f64 {
    if arr.len() < 2 {
        return f64::NAN;
    }
    let mean = array_mean(arr);
    let variance = arr.iter().map(|x| (x - mean).powi(2)).sum::<f64>() / (arr.len() as f64 - 1.0);
    variance.sqrt()
}

/// Calcul de la variance d'un tableau
#[wasm_bindgen]
pub fn array_variance(arr: &[f64]) -> f64 {
    if arr.len() < 2 {
        return f64::NAN;
    }
    let mean = array_mean(arr);
    arr.iter().map(|x| (x - mean).powi(2)).sum::<f64>() / (arr.len() as f64 - 1.0)
}

// ============ NOUVELLES FONCTIONS ============

/// Filtre les éléments d'un tableau selon une condition
#[wasm_bindgen]
pub fn array_filter_gt(arr: &[f64], threshold: f64) -> Vec<f64> {
    arr.iter().filter(|&&x| x > threshold).cloned().collect()
}

/// Filtre les éléments d'un tableau selon une condition
#[wasm_bindgen]
pub fn array_filter_lt(arr: &[f64], threshold: f64) -> Vec<f64> {
    arr.iter().filter(|&&x| x < threshold).cloned().collect()
}

/// Retourne les indices où la condition est vraie
#[wasm_bindgen]
pub fn array_where_gt(arr: &[f64], threshold: f64) -> Vec<usize> {
    arr.iter().enumerate()
        .filter_map(|(i, &x)| if x > threshold { Some(i) } else { None })
        .collect()
}

/// Tri croissant
#[wasm_bindgen]
pub fn array_sort(arr: &[f64]) -> Vec<f64> {
    let mut result = arr.to_vec();
    result.sort_by(|a, b| a.partial_cmp(b).unwrap());
    result
}

/// Tri décroissant
#[wasm_bindgen]
pub fn array_sort_desc(arr: &[f64]) -> Vec<f64> {
    let mut result = arr.to_vec();
    result.sort_by(|a, b| b.partial_cmp(a).unwrap());
    result
}

/// Calcul de la médiane
#[wasm_bindgen]
pub fn array_median(arr: &[f64]) -> f64 {
    if arr.is_empty() {
        return f64::NAN;
    }

    let mut sorted = arr.to_vec();
    sorted.sort_by(|a, b| a.partial_cmp(b).unwrap());

    let len = sorted.len();
    if len % 2 == 0 {
        (sorted[len / 2 - 1] + sorted[len / 2]) / 2.0
    } else {
        sorted[len / 2]
    }
}

/// Calcul du percentile
#[wasm_bindgen]
pub fn array_percentile(arr: &[f64], percentile: f64) -> f64 {
    if arr.is_empty() || percentile < 0.0 || percentile > 100.0 {
        return f64::NAN;
    }

    let mut sorted = arr.to_vec();
    sorted.sort_by(|a, b| a.partial_cmp(b).unwrap());

    let index = (percentile / 100.0) * (sorted.len() - 1) as f64;
    let lower = index.floor() as usize;
    let upper = index.ceil() as usize;

    if lower == upper {
        sorted[lower]
    } else {
        let weight = index - lower as f64;
        sorted[lower] * (1.0 - weight) + sorted[upper] * weight
    }
}

/// Applique une fonction abs() à tous les éléments
#[wasm_bindgen]
pub fn array_abs(arr: &[f64]) -> Vec<f64> {
    arr.iter().map(|x| x.abs()).collect()
}

/// Applique une fonction sqrt() à tous les éléments
#[wasm_bindgen]
pub fn array_sqrt(arr: &[f64]) -> Vec<f64> {
    arr.iter().map(|x| x.sqrt()).collect()
}

/// Applique une fonction log() à tous les éléments
#[wasm_bindgen]
pub fn array_log(arr: &[f64]) -> Vec<f64> {
    arr.iter().map(|x| x.ln()).collect()
}

/// Applique une fonction exp() à tous les éléments
#[wasm_bindgen]
pub fn array_exp(arr: &[f64]) -> Vec<f64> {
    arr.iter().map(|x| x.exp()).collect()
}

/// Calcul du produit cumulé
#[wasm_bindgen]
pub fn array_cumsum(arr: &[f64]) -> Vec<f64> {
    let mut result = Vec::with_capacity(arr.len());
    let mut sum = 0.0;
    for &x in arr {
        sum += x;
        result.push(sum);
    }
    result
}

/// Calcul du produit cumulé
#[wasm_bindgen]
pub fn array_cumprod(arr: &[f64]) -> Vec<f64> {
    let mut result = Vec::with_capacity(arr.len());
    let mut prod = 1.0;
    for &x in arr {
        prod *= x;
        result.push(prod);
    }
    result
}

/// Différences entre éléments consécutifs
#[wasm_bindgen]
pub fn array_diff(arr: &[f64]) -> Vec<f64> {
    if arr.len() < 2 {
        return Vec::new();
    }

    arr.windows(2).map(|w| w[1] - w[0]).collect()
}

/// Slice d'un tableau
#[wasm_bindgen]
pub fn array_slice(arr: &[f64], start: usize, end: usize) -> Vec<f64> {
    let len = arr.len();
    let start = start.min(len);
    let end = end.min(len);

    if start >= end {
        return Vec::new();
    }

    arr[start..end].to_vec()
}

/// Concaténation de deux tableaux
#[wasm_bindgen]
pub fn array_concat(a: &[f64], b: &[f64]) -> Vec<f64> {
    let mut result = Vec::with_capacity(a.len() + b.len());
    result.extend_from_slice(a);
    result.extend_from_slice(b);
    result
}

/// Répète un tableau n fois
#[wasm_bindgen]
pub fn array_repeat(arr: &[f64], times: usize) -> Vec<f64> {
    let mut result = Vec::with_capacity(arr.len() * times);
    for _ in 0..times {
        result.extend_from_slice(arr);
    }
    result
}

/// Compte les valeurs uniques
#[wasm_bindgen]
pub fn array_unique_count(arr: &[f64]) -> usize {
    use std::collections::HashSet;
    let mut unique: HashSet<u64> = HashSet::new();

    for &x in arr {
        unique.insert(x.to_bits());
    }

    unique.len()
}

/// Remplace les NaN par une valeur
#[wasm_bindgen]
pub fn array_fillna(arr: &[f64], fill_value: f64) -> Vec<f64> {
    arr.iter().map(|&x| if x.is_nan() { fill_value } else { x }).collect()
}

/// Compte les valeurs NaN
#[wasm_bindgen]
pub fn array_count_nan(arr: &[f64]) -> usize {
    arr.iter().filter(|&&x| x.is_nan()).count()
}

/// Supprime les valeurs NaN
#[wasm_bindgen]
pub fn array_dropna(arr: &[f64]) -> Vec<f64> {
    arr.iter().filter(|&&x| !x.is_nan()).cloned().collect()
}