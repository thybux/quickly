import * as wasm from '../pkg/quickly.js';

interface BenchmarkResult {
  name: string;
  wasmTime: number;
  jsTime: number;
  speedup: number;
}

class Benchmark {
  private results: BenchmarkResult[] = [];

  // Générateurs de données de test
  private generateArray(size: number): number[] {
    return Array.from({ length: size }, () => Math.random() * 100);
  }

  private generateArrays(size: number): [number[], number[]] {
    return [this.generateArray(size), this.generateArray(size)];
  }

  // Fonctions JavaScript équivalentes
  private jsArrayAdd(a: number[], b: number[]): number[] {
    const minLen = Math.min(a.length, b.length);
    return a.slice(0, minLen).map((val, i) => val + b[i]);
  }

  private jsArrayMultiply(a: number[], b: number[]): number[] {
    const minLen = Math.min(a.length, b.length);
    return a.slice(0, minLen).map((val, i) => val * b[i]);
  }

  private jsArrayMean(arr: number[]): number {
    return arr.reduce((sum, val) => sum + val, 0) / arr.length;
  }

  private jsArrayStd(arr: number[]): number {
    const mean = this.jsArrayMean(arr);
    const variance = arr.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / (arr.length - 1);
    return Math.sqrt(variance);
  }

  // Utilitaire de mesure de temps
  private measureTime(fn: () => void, iterations: number = 1000): number {
    const start = performance.now();
    for (let i = 0; i < iterations; i++) {
      fn();
    }
    const end = performance.now();
    return end - start;
  }

  // Benchmarks individuels
  benchmarkAddition(size: number = 10000, iterations: number = 1000) {
    const [a, b] = this.generateArrays(size);

    const wasmTime = this.measureTime(() => {
      wasm.array_add(a, b);
    }, iterations);

    const jsTime = this.measureTime(() => {
      this.jsArrayAdd(a, b);
    }, iterations);

    this.results.push({
      name: `Array Addition (${size} elements)`,
      wasmTime,
      jsTime,
      speedup: jsTime / wasmTime
    });
  }

  benchmarkMultiplication(size: number = 10000, iterations: number = 1000) {
    const [a, b] = this.generateArrays(size);

    const wasmTime = this.measureTime(() => {
      wasm.array_multiply(a, b);
    }, iterations);

    const jsTime = this.measureTime(() => {
      this.jsArrayMultiply(a, b);
    }, iterations);

    this.results.push({
      name: `Array Multiplication (${size} elements)`,
      wasmTime,
      jsTime,
      speedup: jsTime / wasmTime
    });
  }

  benchmarkMean(size: number = 10000, iterations: number = 1000) {
    const arr = this.generateArray(size);

    const wasmTime = this.measureTime(() => {
      wasm.array_mean(arr);
    }, iterations);

    const jsTime = this.measureTime(() => {
      this.jsArrayMean(arr);
    }, iterations);

    this.results.push({
      name: `Array Mean (${size} elements)`,
      wasmTime,
      jsTime,
      speedup: jsTime / wasmTime
    });
  }

  benchmarkStandardDeviation(size: number = 10000, iterations: number = 1000) {
    const arr = this.generateArray(size);

    const wasmTime = this.measureTime(() => {
      wasm.array_std(arr);
    }, iterations);

    const jsTime = this.measureTime(() => {
      this.jsArrayStd(arr);
    }, iterations);

    this.results.push({
      name: `Array Standard Deviation (${size} elements)`,
      wasmTime,
      jsTime,
      speedup: jsTime / wasmTime
    });
  }

  // Exécuter tous les benchmarks
  runAll() {
    console.log('🚀 Starting WASM vs JavaScript Benchmarks...\n');

    // Benchmarks avec différentes tailles
    const sizes = [1000, 5000, 10000, 50000];

    sizes.forEach(size => {
      this.benchmarkAddition(size);
      this.benchmarkMultiplication(size);
      this.benchmarkMean(size);
      this.benchmarkStandardDeviation(size);
    });

    this.displayResults();
  }

  // Afficher les résultats
  private displayResults() {
    console.log('\n📊 Benchmark Results:');
    console.log('='.repeat(80));
    console.log('| Function'.padEnd(35) + '| WASM (ms)'.padEnd(12) + '| JS (ms)'.padEnd(10) + '| Speedup'.padEnd(10) + '|');
    console.log('='.repeat(80));

    this.results.forEach(result => {
      const speedupColor = result.speedup > 1 ? '🟢' : '🔴';
      const speedupText = `${speedupColor} ${result.speedup.toFixed(2)}x`;

      console.log(
        `| ${result.name.padEnd(33)}` +
        `| ${result.wasmTime.toFixed(2).padEnd(10)}` +
        `| ${result.jsTime.toFixed(2).padEnd(8)}` +
        `| ${speedupText.padEnd(8)} |`
      );
    });

    console.log('='.repeat(80));

    // Statistiques globales
    const avgSpeedup = this.results.reduce((sum, r) => sum + r.speedup, 0) / this.results.length;
    const maxSpeedup = Math.max(...this.results.map(r => r.speedup));
    const minSpeedup = Math.min(...this.results.map(r => r.speedup));

    console.log(`\n📈 Summary:`);
    console.log(`   Average Speedup: ${avgSpeedup.toFixed(2)}x`);
    console.log(`   Max Speedup: ${maxSpeedup.toFixed(2)}x`);
    console.log(`   Min Speedup: ${minSpeedup.toFixed(2)}x`);

    if (avgSpeedup > 1) {
      console.log(`   🎉 WASM is ${avgSpeedup.toFixed(2)}x faster on average!`);
    } else {
      console.log(`   ⚠️  JavaScript is ${(1 / avgSpeedup).toFixed(2)}x faster on average`);
    }
  }
}

// Script principal pour exécuter les benchmarks
if (require.main === module) {
  const benchmark = new Benchmark();
  benchmark.runAll();
}

export { Benchmark };
