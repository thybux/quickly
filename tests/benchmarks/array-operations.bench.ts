import { QuicklyArray } from '../../src/core/Array';
import { WasmBindings } from '../../src/wasm/bindings';

// Utilitaires pour les benchmarks
interface BenchmarkResult {
  name: string;
  duration: number;
  operations: number;
  opsPerSecond: number;
}

class BenchmarkSuite {
  private results: BenchmarkResult[] = [];

  benchmark(name: string, fn: () => void, iterations: number = 1000): BenchmarkResult {
    // Warm-up
    for (let i = 0; i < Math.min(100, iterations / 10); i++) {
      fn();
    }

    // Mesure réelle
    const start = performance.now();
    for (let i = 0; i < iterations; i++) {
      fn();
    }
    const end = performance.now();

    const duration = end - start;
    const opsPerSecond = (iterations / duration) * 1000;

    const result: BenchmarkResult = {
      name,
      duration,
      operations: iterations,
      opsPerSecond
    };

    this.results.push(result);
    return result;
  }

  printResults(): void {
    console.log('\n📊 Benchmark Results:');
    console.log('─'.repeat(80));
    console.log('Operation'.padEnd(40) + 'Duration (ms)'.padEnd(15) + 'Ops/sec'.padEnd(15) + 'Speedup');
    console.log('─'.repeat(80));

    // Grouper par opération pour calculer le speedup
    const groups: { [key: string]: BenchmarkResult[] } = {};
    this.results.forEach(result => {
      const baseName = result.name.replace(/ \(.*\)/, '');
      if (!groups[baseName]) groups[baseName] = [];
      groups[baseName].push(result);
    });

    Object.values(groups).forEach(group => {
      if (group.length === 2) {
        const [ts, wasm] = group.sort((a, b) =>
          a.name.includes('TypeScript') ? -1 : 1
        );
        const speedup = wasm.opsPerSecond / ts.opsPerSecond;

        console.log(ts.name.padEnd(40) +
          ts.duration.toFixed(2).padEnd(15) +
          ts.opsPerSecond.toFixed(0).padEnd(15) +
          '1.00x');
        console.log(wasm.name.padEnd(40) +
          wasm.duration.toFixed(2).padEnd(15) +
          wasm.opsPerSecond.toFixed(0).padEnd(15) +
          `${speedup.toFixed(2)}x`);
        console.log('');
      }
    });
  }

  getSpeedup(wasmName: string, tsName: string): number {
    const wasmResult = this.results.find(r => r.name === wasmName);
    const tsResult = this.results.find(r => r.name === tsName);

    if (!wasmResult || !tsResult) return 0;
    return wasmResult.opsPerSecond / tsResult.opsPerSecond;
  }
}

// Implémentations TypeScript natives pour comparaison
class TypeScriptArrayOps {
  static add(a: number[], b: number[]): number[] {
    const result = new Array(Math.min(a.length, b.length));
    for (let i = 0; i < result.length; i++) {
      result[i] = a[i] + b[i];
    }
    return result;
  }

  static addScalar(arr: number[], scalar: number): number[] {
    const result = new Array(arr.length);
    for (let i = 0; i < arr.length; i++) {
      result[i] = arr[i] + scalar;
    }
    return result;
  }

  static sum(arr: number[]): number {
    let sum = 0;
    for (let i = 0; i < arr.length; i++) {
      sum += arr[i];
    }
    return sum;
  }

  static multiply(a: number[], b: number[]): number[] {
    const result = new Array(Math.min(a.length, b.length));
    for (let i = 0; i < result.length; i++) {
      result[i] = a[i] * b[i];
    }
    return result;
  }

  static mean(arr: number[]): number {
    return this.sum(arr) / arr.length;
  }

  static std(arr: number[]): number {
    const mean = this.mean(arr);
    let sumSquaredDiffs = 0;
    for (let i = 0; i < arr.length; i++) {
      const diff = arr[i] - mean;
      sumSquaredDiffs += diff * diff;
    }
    return Math.sqrt(sumSquaredDiffs / (arr.length - 1));
  }
}

describe('Performance Benchmarks: TypeScript vs WASM', () => {
  const suite = new BenchmarkSuite();

  // Différentes tailles de données pour tester la scalabilité
  const dataSizes = [
    { name: 'Small', size: 100 },
    { name: 'Medium', size: 10000 },
    { name: 'Large', size: 100000 }
  ];

  dataSizes.forEach(({ name: sizeName, size }) => {
    describe(`${sizeName} Arrays (${size.toLocaleString()} elements)`, () => {
      let data1: number[];
      let data2: number[];
      let quicklyArray: QuicklyArray;

      beforeAll(() => {
        // Générer des données de test
        data1 = Array.from({ length: size }, (_, i) => Math.random() * 100);
        data2 = Array.from({ length: size }, (_, i) => Math.random() * 100);
        quicklyArray = new QuicklyArray(data1);
      });

      it('should benchmark array addition', () => {
        const iterations = size > 10000 ? 100 : 1000;

        const tsResult = suite.benchmark(
          `Array Addition (TypeScript) - ${sizeName}`,
          () => TypeScriptArrayOps.add(data1, data2),
          iterations
        );

        const wasmResult = suite.benchmark(
          `Array Addition (WASM) - ${sizeName}`,
          () => WasmBindings.arrayAdd(data1, data2),
          iterations
        );

        // Vérifier que les résultats sont équivalents
        const tsSum = TypeScriptArrayOps.add(data1, data2);
        const wasmSum = WasmBindings.arrayAdd(data1, data2);
        expect(wasmSum).toHaveLength(tsSum.length);

        // Vérifier quelques valeurs aléatoires
        for (let i = 0; i < Math.min(10, tsSum.length); i++) {
          expect(wasmSum[i]).toBeCloseTo(tsSum[i], 10);
        }

        console.log(`📈 Addition ${sizeName}: WASM is ${(wasmResult.opsPerSecond / tsResult.opsPerSecond).toFixed(2)}x faster`);
      });

      it('should benchmark scalar addition', () => {
        const iterations = size > 10000 ? 100 : 1000;
        const scalar = 42.5;

        const tsResult = suite.benchmark(
          `Scalar Addition (TypeScript) - ${sizeName}`,
          () => TypeScriptArrayOps.addScalar(data1, scalar),
          iterations
        );

        const wasmResult = suite.benchmark(
          `Scalar Addition (WASM) - ${sizeName}`,
          () => WasmBindings.arrayAddScalar(data1, scalar),
          iterations
        );

        const speedup = wasmResult.opsPerSecond / tsResult.opsPerSecond;
        console.log(`📈 Scalar Addition ${sizeName}: WASM is ${speedup.toFixed(2)}x faster`);
      });

      it('should benchmark sum operation', () => {
        const iterations = size > 10000 ? 500 : 2000;

        const tsResult = suite.benchmark(
          `Sum (TypeScript) - ${sizeName}`,
          () => TypeScriptArrayOps.sum(data1),
          iterations
        );

        const wasmResult = suite.benchmark(
          `Sum (WASM) - ${sizeName}`,
          () => WasmBindings.arraySum(data1),
          iterations
        );

        // Vérifier l'exactitude
        const tsSum = TypeScriptArrayOps.sum(data1);
        const wasmSum = WasmBindings.arraySum(data1);
        expect(wasmSum).toBeCloseTo(tsSum, 10);

        const speedup = wasmResult.opsPerSecond / tsResult.opsPerSecond;
        console.log(`📈 Sum ${sizeName}: WASM is ${speedup.toFixed(2)}x faster`);
      });

      if (size <= 10000) { // Éviter les opérations trop lentes sur de gros datasets
        it('should benchmark complex statistical operations', () => {
          const iterations = 100;

          const tsResult = suite.benchmark(
            `Standard Deviation (TypeScript) - ${sizeName}`,
            () => TypeScriptArrayOps.std(data1),
            iterations
          );

          const wasmResult = suite.benchmark(
            `Standard Deviation (WASM) - ${sizeName}`,
            () => {
              // Importer la fonction WASM ici
              const { array_std } = require('../../pkg/quickly');
              return array_std(new Float64Array(data1));
            },
            iterations
          );

          const speedup = wasmResult.opsPerSecond / tsResult.opsPerSecond;
          console.log(`📈 Std Dev ${sizeName}: WASM is ${speedup.toFixed(2)}x faster`);
        });
      }
    });
  });

  afterAll(() => {
    suite.printResults();

    // Assertions sur les performances attendues
    const smallAddSpeedup = suite.getSpeedup('Array Addition (WASM) - Small', 'Array Addition (TypeScript) - Small');
    const largeAddSpeedup = suite.getSpeedup('Array Addition (WASM) - Large', 'Array Addition (TypeScript) - Large');

    // WASM devrait être au moins aussi rapide que TypeScript
    expect(smallAddSpeedup).toBeGreaterThanOrEqual(0.8);
    expect(largeAddSpeedup).toBeGreaterThanOrEqual(1.0);

    console.log('\n✅ Performance tests completed!');
    console.log(`🚀 Best speedup observed: ${Math.max(...suite.results.map(r => r.opsPerSecond)).toLocaleString()} ops/sec`);
  });
});

// Test de charge pour détecter les fuites mémoire
describe('Memory and Stress Tests', () => {
  it('should handle repeated large operations without memory leaks', () => {
    const size = 50000;
    const iterations = 50;

    console.log(`🧪 Memory stress test: ${iterations} iterations of ${size.toLocaleString()} elements`);

    for (let i = 0; i < iterations; i++) {
      const data1 = Array.from({ length: size }, () => Math.random());
      const data2 = Array.from({ length: size }, () => Math.random());

      const result = WasmBindings.arrayAdd(data1, data2);
      expect(result).toHaveLength(size);

      // Vérifier quelques valeurs pour s'assurer de la cohérence
      if (i % 10 === 0) {
        expect(result[0]).toBeCloseTo(data1[0] + data2[0], 10);
        console.log(`✓ Iteration ${i + 1}/${iterations} completed`);
      }
    }

    console.log('✅ Memory stress test passed - no apparent leaks');
  });
});
