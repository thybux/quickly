import { QuicklyArray } from '../../typescript/core/Array';

interface BenchmarkResult {
  operation: string;
  dataSize: number;
  rustTime: number;
  vanillaTime: number;
  speedup: number;
}

class ArrayAdditionBenchmark {
  private results: BenchmarkResult[] = [];

  private generateRandomArray(size: number): number[] {
    return Array.from({ length: size }, () => Math.random() * 1000);
  }

  // Implémentation vanilla JavaScript pour comparaison
  private vanillaArrayAdd(a: number[], b: number[]): number[] {
    const minLen = Math.min(a.length, b.length);
    return a.slice(0, minLen).map((val, i) => val + b[i]);
  }

  private vanillaArrayAddScalar(arr: number[], scalar: number): number[] {
    return arr.map(x => x + scalar);
  }

  private vanillaArraySum(arr: number[]): number {
    return arr.reduce((sum, val) => sum + val, 0);
  }

  private async benchmarkArrayAddition(size: number) {
    const dataA = this.generateRandomArray(size);
    const dataB = this.generateRandomArray(size);

    // Benchmark Vanilla JS
    const vanillaStart = performance.now();
    this.vanillaArrayAdd(dataA, dataB);
    const vanillaEnd = performance.now();
    const vanillaTime = vanillaEnd - vanillaStart;

    // Petite pause pour stabilité
    await new Promise(resolve => setTimeout(resolve, 10));

    // Benchmark Rust/WASM
    const rustArray = new QuicklyArray(dataA);
    const rustStart = performance.now();
    rustArray.add(dataB);
    const rustEnd = performance.now();
    const rustTime = rustEnd - rustStart;

    this.results.push({
      operation: 'Array Addition',
      dataSize: size,
      rustTime,
      vanillaTime,
      speedup: vanillaTime / rustTime
    });
  }

  private async benchmarkScalarAddition(size: number) {
    const data = this.generateRandomArray(size);
    const scalar = 42;

    // Benchmark Vanilla JS
    const vanillaStart = performance.now();
    this.vanillaArrayAddScalar(data, scalar);
    const vanillaEnd = performance.now();
    const vanillaTime = vanillaEnd - vanillaStart;

    await new Promise(resolve => setTimeout(resolve, 10));

    // Benchmark Rust/WASM
    const rustArray = new QuicklyArray(data);
    const rustStart = performance.now();
    rustArray.addScalar(scalar);
    const rustEnd = performance.now();
    const rustTime = rustEnd - rustStart;

    this.results.push({
      operation: 'Scalar Addition',
      dataSize: size,
      rustTime,
      vanillaTime,
      speedup: vanillaTime / rustTime
    });
  }

  private async benchmarkArraySum(size: number) {
    const data = this.generateRandomArray(size);

    // Benchmark Vanilla JS
    const vanillaStart = performance.now();
    this.vanillaArraySum(data);
    const vanillaEnd = performance.now();
    const vanillaTime = vanillaEnd - vanillaStart;

    await new Promise(resolve => setTimeout(resolve, 10));

    // Benchmark Rust/WASM
    const rustArray = new QuicklyArray(data);
    const rustStart = performance.now();
    rustArray.sum();
    const rustEnd = performance.now();
    const rustTime = rustEnd - rustStart;

    this.results.push({
      operation: 'Array Sum',
      dataSize: size,
      rustTime,
      vanillaTime,
      speedup: vanillaTime / rustTime
    });
  }

  public async runBenchmarks() {
    console.log('🚀 Benchmark des opérations d\'addition...\n');
    console.log('⚡ Comparaison Rust/WASM vs JavaScript Vanilla\n');

    const sizes = [1000, 10000, 100000, 500000];

    for (const size of sizes) {
      console.log(`📊 Testing avec ${size.toLocaleString()} éléments...`);

      await this.benchmarkArrayAddition(size);
      await this.benchmarkScalarAddition(size);
      await this.benchmarkArraySum(size);

      // Pause entre les tailles
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    this.printResults();
  }

  private printResults() {
    console.log('\n📈 Résultats des benchmarks d\'addition:\n');

    // Grouper par taille
    const groupedResults = this.results.reduce((acc, result) => {
      if (!acc[result.dataSize]) {
        acc[result.dataSize] = [];
      }
      acc[result.dataSize].push(result);
      return acc;
    }, {} as Record<number, BenchmarkResult[]>);

    Object.entries(groupedResults).forEach(([size, results]) => {
      console.log(`🔬 Taille: ${parseInt(size).toLocaleString()} éléments`);
      console.log('━'.repeat(50));

      results.forEach(result => {
        const speedupText = result.speedup > 1
          ? `🟢 ${result.speedup.toFixed(2)}x plus rapide`
          : `🔴 ${(1 / result.speedup).toFixed(2)}x plus lent`;

        console.log(`${result.operation}:`);
        console.log(`  Rust:    ${result.rustTime.toFixed(3)}ms`);
        console.log(`  Vanilla: ${result.vanillaTime.toFixed(3)}ms`);
        console.log(`  Speedup: ${speedupText}\n`);
      });
    });

    // Statistiques globales
    const avgSpeedup = this.results.reduce((sum, r) => sum + r.speedup, 0) / this.results.length;
    const maxSpeedup = Math.max(...this.results.map(r => r.speedup));
    const minSpeedup = Math.min(...this.results.map(r => r.speedup));

    console.log('📊 Statistiques globales des opérations d\'addition:');
    console.log(`   Speedup moyen:  ${avgSpeedup.toFixed(2)}x`);
    console.log(`   Speedup max:    ${maxSpeedup.toFixed(2)}x`);
    console.log(`   Speedup min:    ${minSpeedup.toFixed(2)}x`);

    if (avgSpeedup > 1) {
      console.log('\n🎉 Rust/WASM est plus performant pour les additions !');
    } else {
      console.log('\n⚠️  JavaScript vanilla est plus performant.');
      console.log('   (Overhead WASM pour petites opérations)');
    }
  }
}

// Exécution du benchmark
const benchmark = new ArrayAdditionBenchmark();
benchmark.runBenchmarks().catch(console.error);
