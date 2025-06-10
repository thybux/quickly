# MVP Functions List - Quickly Library

## 🎯 Priorité 1 - Core Array Operations

### Math Operations (`src/rust/array/math.rs`)
- [x] `add()` - Addition élément par élément ✅
- [x] `addScalar()` - Addition scalaire ✅  
- [x] `sum()` - Somme totale ✅
- [ ] `subtract()` - Soustraction élément par élément
- [ ] `subtractScalar()` - Soustraction scalaire
- [ ] `multiply()` - Multiplication élément par élément
- [ ] `multiplyScalar()` - Multiplication scalaire
- [ ] `divide()` - Division élément par élément
- [ ] `divideScalar()` - Division scalaire
- [ ] `mean()` - Moyenne
- [ ] `min()` / `max()` - Min/Max
- [ ] `std()` - Écart-type
- [ ] `variance()` - Variance

### Sort & Search (`src/rust/array/sort.rs`)
- [ ] `sort()` - Tri croissant/décroissant
- [ ] `argsort()` - Indices de tri
- [ ] `unique()` - Valeurs uniques
- [ ] `indexOf()` - Recherche d'élément
- [ ] `contains()` - Test de présence

### Filter & Transform (`src/rust/array/filter.rs`)
- [ ] `filter()` - Filtrage avec condition
- [ ] `map()` - Transformation élément par élément
- [ ] `slice()` - Extraction de sous-array
- [ ] `reverse()` - Inversion
- [ ] `shuffle()` - Mélange aléatoire

## 🧹 Priorité 2 - Data Cleaning

### Missing Data (`src/rust/cleaning/missing.rs`)
- [ ] `isNull()` - Détection valeurs manquantes
- [ ] `fillna()` - Remplissage valeurs manquantes
- [ ] `dropna()` - Suppression valeurs manquantes
- [ ] `interpolate()` - Interpolation linéaire
- [ ] `forwardFill()` - Propagation avant
- [ ] `backwardFill()` - Propagation arrière

### Duplicates (`src/rust/cleaning/duplicates.rs`)
- [ ] `duplicated()` - Détection doublons
- [ ] `dropDuplicates()` - Suppression doublons
- [ ] `getDuplicates()` - Extraction doublons

### Outliers (`src/rust/cleaning/outliers.rs`)
- [ ] `detectOutliers()` - Détection par IQR
- [ ] `detectOutliersZScore()` - Détection par Z-score
- [ ] `removeOutliers()` - Suppression outliers
- [ ] `clipOutliers()` - Écrêtage outliers

### Data Validation (`src/rust/cleaning/validation.rs`)
- [ ] `validateNumeric()` - Validation numérique
- [ ] `validateRange()` - Validation de plage
- [ ] `validateFormat()` - Validation de format
- [ ] `sanitizeString()` - Nettoyage chaînes

## 📊 Priorité 3 - DataFrame Basics

### Core DataFrame (`src/rust/dataframe/core.rs`)
- [ ] `new()` - Création DataFrame
- [ ] `shape()` - Dimensions (rows, cols)
- [ ] `head()` / `tail()` - Aperçu début/fin
- [ ] `info()` - Informations générales
- [ ] `dtypes()` - Types de colonnes
- [ ] `columns()` - Noms colonnes
- [ ] `rename()` - Renommer colonnes

### Indexing (`src/rust/dataframe/indexing.rs`)
- [ ] `select()` - Sélection colonnes
- [ ] `filter()` - Filtrage lignes
- [ ] `iloc()` - Indexation par position
- [ ] `loc()` - Indexation par label
- [ ] `slice()` - Extraction sous-DataFrame

### Basic Operations (`src/rust/dataframe/operations.rs`)
- [ ] `merge()` - Jointure DataFrames
- [ ] `concat()` - Concaténation
- [ ] `groupby()` - Groupement (version simple)
- [ ] `sort()` - Tri par colonnes
- [ ] `pivot()` - Tableau croisé dynamique

## 📈 Priorité 4 - Statistics

### Descriptive Stats (`src/rust/array/stats.rs`)
- [ ] `describe()` - Statistiques descriptives
- [ ] `quantile()` - Quantiles/percentiles
- [ ] `mode()` - Mode
- [ ] `skewness()` - Asymétrie
- [ ] `kurtosis()` - Aplatissement
- [ ] `correlation()` - Corrélation
- [ ] `covariance()` - Covariance

### Rolling Operations (`src/rust/array/rolling.rs`)
- [ ] `rollingMean()` - Moyenne mobile
- [ ] `rollingSum()` - Somme mobile
- [ ] `rollingMin()` / `rollingMax()` - Min/Max mobile
- [ ] `rollingStd()` - Écart-type mobile

## 💾 Priorité 5 - I/O Operations

### CSV Support (`src/rust/dataframe/io.rs`)
- [ ] `readCsv()` - Lecture CSV
- [ ] `toCsv()` - Export CSV
- [ ] `parseNumeric()` - Parsing automatique
- [ ] `inferTypes()` - Inférence de types

### JSON Support
- [ ] `readJson()` - Lecture JSON
- [ ] `toJson()` - Export JSON

## 🔧 Priorité 6 - Utilities

### Type Conversion (`src/rust/utils/conversion.rs`)
- [ ] `asFloat()` - Conversion float
- [ ] `asInt()` - Conversion entier
- [ ] `asString()` - Conversion string
- [ ] `asBoolean()` - Conversion booléen

### Performance (`src/rust/utils/performance.rs`)
- [ ] `profile()` - Profilage performance
- [ ] `benchmark()` - Benchmark intégré
- [ ] `memoryUsage()` - Usage mémoire

## 🎯 Roadmap MVP (ordre recommandé)

### Phase 1 : Array Foundation
1. Compléter les math operations (subtract, multiply, divide)
2. Ajouter mean, min, max
3. Implémenter sort et unique

### Phase 2 : Data Cleaning Core
1. Missing data (fillna, dropna)
2. Duplicates (dropDuplicates)
3. Basic outlier detection

### Phase 3 : DataFrame Basic
1. DataFrame creation et indexing
2. Select, filter, head/tail
3. Basic merge et concat

### Phase 4 : Stats & I/O
1. Descriptive statistics
2. CSV read/write
3. Basic groupby

## 📊 Métriques de Succès MVP

- [ ] **20+ fonctions array** implémentées
- [ ] **10+ fonctions cleaning** disponibles  
- [ ] **DataFrame de base** fonctionnel
- [ ] **CSV I/O** opérationnel
- [ ] **Benchmarks** sur toutes les fonctions core
- [ ] **Documentation** et exemples
- [ ] **Tests unitaires** > 90% coverage

## 🚀 Nice-to-have (Post-MVP)

- Machine Learning basique (régression, clustering)
- Support formats Parquet, Excel
- Plotting intégré
- Parallel processing
- GPU acceleration (via CUDA/OpenCL)
- Time series analysis
- String operations avancées
- Geographic data support


----------------------------------------------------------------------------------------------------------------


# info de compilation

# Pour Node.js
  wasm-pack build --target nodejs --out-dir pkg

# Pour le web (sans bundler)
wasm-pack build --target web --out-dir pkg

# Pour usage universel
wasm-pack build --target bundler --out-dir pkg

j'ai maintenant mon dossier pkg ou dedans j'ai mon interface js, le module WebAssembly compilé la definition de Typescript et les métadonnées

faire cette commande pour tester si le module ce charge bien

```
node -e "const wasm = require('./pkg/quickly_bg.js'); console.log('WASM loaded successfully');"
```

dans notre cas il faut la target nodejs