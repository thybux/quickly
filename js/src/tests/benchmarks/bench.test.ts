import { QuicklyArray } from '../core/QuicklyArray';
import { WasmBindings } from '../wasm/bindings';
import { isWasmReady } from '../index';

// Interface pour les résultats de benchmark
interface BenchmarkResult {
  name: string;
  duration: number;
  operations: number;
  opsPerSecond: number;
}

// Classe pour gérer les benchmarks
class BenchmarkSuite {
  private results: BenchmarkResult[] = [];

  benchmark(name: string, fn: () => void, iterations: number = 1000): BenchmarkResult {
    // Warm-up
    const warmupIterations = Math.min(100, Math.floor(iterations / 10));
    for (let i = 0; i < warmupIterations; i++) {
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

  getResults(): BenchmarkResult[] {
    return [...this.results];
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
        const [js, wasm] = group.sort((a, b) =>
            a.name.includes('JavaScript') ? -1 : 1
        );
        const speedup = wasm.opsPerSecond / js.opsPerSecond;

        console.log(js.name.padEnd(40) +
            js.duration.toFixed(2).padEnd(15) +
            js.opsPerSecond.toFixed(0).padEnd(15) +
            '1.00x');
        console.log(wasm.name.padEnd(40) +
            wasm.duration.toFixed(2).padEnd(15) +
            wasm.opsPerSecond.toFixed(0).padEnd(15) +
            `${speedup.toFixed(2)}x`);
        console.log('');
      } else {
        group.forEach(result => {
          console.log(result.name.padEnd(40) +
              result.duration.toFixed(2).padEnd(15) +
              result.opsPerSecond.toFixed(0).padEnd(15) +
              'N/A');
        });
        console.log('');
      }
    });
  }

  getSpeedup(wasmName: string, jsName: string): number {
    const wasmResult = this.results.find(r => r.name === wasmName);
    const jsResult = this.results.find(r => r.name === jsName);

    if (!wasmResult || !jsResult) return 0;
    return wasmResult.opsPerSecond / jsResult.opsPerSecond;
  }
}

// Implémentations JavaScript natives pour comparaison
class JavaScriptArrayOps {
  static add(a: number[], b: number[]): number[] {
    const minLength = Math.min(a.length, b.length);
    const result = new Array(minLength);
    for (let i = 0; i < minLength; i++) {
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

  static mean(arr: number[]): number {
    return this.sum(arr) / arr.length;
  }

  static multiply(a: number[], b: number[]): number[] {
    const minLength = Math.min(a.length, b.length);
    const result = new Array(minLength);
    for (let i = 0; i < minLength; i++) {
      result[i] = a[i] * b[i];
    }
    return result;
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

// Tests de performance conditionnels
const describePerf = isWasmReady() ? describe : describe.skip;

describePerf('Performance Benchmarks: JavaScript vs WASM', () => {
  const suite = new BenchmarkSuite();

  // Différentes tailles pour tester la scalabilité
  const dataSizes = [
    { name: 'Small', size: 1000, iterations: 1000 },
    { name: 'Medium', size: 10000, iterations: 200 },
    { name: 'Large', size: 100000, iterations: 50 }
  ];

  dataSizes.forEach(({ name: sizeName, size, iterations }) => {
    describe(`${sizeName} Arrays (${size.toLocaleString()} elements)`, () => {
      let data1: number[];
      let data2: number[];

      beforeAll(() => {
        // Générer des données de test reproductibles
        data1 = Array.from({ length: size }, (_, i) => Math.sin(i * 0.01) * 100);
        data2 = Array.from({ length: size }, (_, i) => Math.cos(i * 0.01) * 100);
      });

      it('should benchmark array addition', () => {
        const jsResult = suite.benchmark(
            `Array Addition (JavaScript) - ${sizeName}`,
            () => JavaScriptArrayOps.add(data1, data2),
            iterations
        );

        const wasmResult = suite.benchmark(
            `Array Addition (WASM) - ${sizeName}`,
            () => WasmBindings.arrayAdd(data1, data2),
            iterations
        );

        // Vérifier que les résultats sont équivalents
        const jsSum = JavaScriptArrayOps.add(data1.slice(0, 10), data2.slice(0, 10));
        const wasmSum = WasmBindings.arrayAdd(data1.slice(0, 10), data2.slice(0, 10));

        for (let i = 0; i < jsSum.length; i++) {
          expect(wasmSum[i]).toBeCloseTo(jsSum[i], 10);
        }

        const speedup = wasmResult.opsPerSecond / jsResult.opsPerSecond;
        console.log(`📈 Addition ${sizeName}: WASM is ${speedup.toFixed(2)}x faster`);
      });

      it('should benchmark scalar addition', () => {
        const scalar = 42.5;

        const jsResult = suite.benchmark(
            `Scalar Addition (JavaScript) - ${sizeName}`,
            () => JavaScriptArrayOps.addScalar(data1, scalar),
            iterations
        );

        const wasmResult = suite.benchmark(
            `Scalar Addition (WASM) - ${sizeName}`,
            () => WasmBindings.arrayAddScalar(data1, scalar),
            iterations
        );

        const speedup = wasmResult.opsPerSecond / jsResult.opsPerSecond;
        console.log(`📈 Scalar Addition ${sizeName}: WASM is ${speedup.toFixed(2)}x faster`);
      });

      it('should benchmark sum operation', () => {
        const jsResult = suite.benchmark(
            `Sum (JavaScript) - ${sizeName}`,
            () => JavaScriptArrayOps.sum(data1),
            iterations * 2 // Sum is faster, so more iterations
        );

        const wasmResult = suite.benchmark(
            `Sum (WASM) - ${sizeName}`,
            () => WasmBindings.arraySum(data1),
            iterations * 2
        );

        // Vérifier l'exactitude
        const jsSum = JavaScriptArrayOps.sum(data1.slice(0, 100));
        const wasmSum = WasmBindings.arraySum(data1.slice(0, 100));
        expect(wasmSum).toBeCloseTo(jsSum, 8);

        const speedup = wasmResult.opsPerSecond / jsResult.opsPerSecond;
        console.log(`📈 Sum ${sizeName}: WASM is ${speedup.toFixed(2)}x faster`);
      });

      if (size <= 10000) { // Éviter les opérations lentes sur de gros datasets
        it('should benchmark statistical operations', () => {
          const reducedIterations = Math.max(10, Math.floor(iterations / 10));

          const jsResult = suite.benchmark(
              `Standard Deviation (JavaScript) - ${sizeName}`,
              () => JavaScriptArrayOps.std(data1),
              reducedIterations
          );

          const wasmResult = suite.benchmark(
              `Standard Deviation (WASM) - ${sizeName}`,
              () => WasmBindings.arrayStd(data1),
              reducedIterations
          );

          // Vérifier l'exactitude
          const jsStd = JavaScriptArrayOps.std(data1.slice(0, 100));
          const wasmStd = WasmBindings.arrayStd(data1.slice(0, 100));
          expect(wasmStd).toBeCloseTo(jsStd, 10);

          const speedup = wasmResult.opsPerSecond / jsResult.opsPerSecond;
          console.log(`📈 Std Dev ${sizeName}: WASM is ${speedup.toFixed(2)}x faster`);
        });
      }
    });
  });

  afterAll(() => {
    suite.printResults();

    // Assertions sur les performances attendues
    const results = suite.getResults();

    // WASM devrait être au moins aussi rapide que JavaScript
    const additionSpeedups = results
        .filter(r => r.name.includes('Addition'))
        .reduce((groups: any, result) => {
          const size = result.name.includes('Small') ? 'Small' :
              result.name.includes('Medium') ? 'Medium' : 'Large';
          if (!groups[size]) groups[size] = {};
          if (result.name.includes('JavaScript')) groups[size].js = result.opsPerSecond;
          if (result.name.includes('WASM')) groups[size].wasm = result.opsPerSecond;
          return groups;
        }, {});

    Object.entries(additionSpeedups).forEach(([size, speeds]: [string, any]) => {
      if (speeds.js && speeds.wasm) {
        const speedup = speeds.wasm / speeds.js;
        console.log(`\n✅ ${size} array addition speedup: ${speedup.toFixed(2)}x`);

        // WASM devrait être au moins 80% aussi rapide que JS (parfois les overheads peuvent ralentir)
        expect(speedup).toBeGreaterThanOrEqual(0.8);
      }
    });

    console.log('\n🎯 Performance Benchmarks Summary:');
    console.log('───────────────────────────────────');
    console.log('✅ All performance tests completed successfully');
    console.log('📊 Detailed results shown above');
    console.log('🚀 WASM backend is performing as expected');
  });
});

describe('Memory and Stress Tests', () => {
  // Ces tests s'exécutent même sans WASM pour tester la robustesse

  it('should handle edge cases gracefully', () => {
    if (!isWasmReady()) {
      // Test que les erreurs sont bien gérées quand WASM n'est pas disponible
      expect(() => {
        new QuicklyArray([1, 2, 3]).sum();
      }).toThrow();
      return;
    }

    // Tests avec WASM disponible
    const arr = new QuicklyArray([1, NaN, Infinity, -Infinity, 5]);
    const result = arr.addScalar(1);

    expect(result[0]).toBe(2);
    expect(result[1]).toBeNaN();
    expect(result[2]).toBe(Infinity);
    expect(result[3]).toBe(-Infinity);
    expect(result[4]).toBe(6);
  });

  if (isWasmReady()) {
    it('should handle repeated operations without memory leaks', () => {
      const size = 10000;
      const iterations = 20;

      console.log(`🧪 Memory stress test: ${iterations} iterations of ${size.toLocaleString()} elements`);

      for (let i = 0; i < iterations; i++) {
        const data1 = Array.from({ length: size }, () => Math.