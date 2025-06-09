import MyPerformanceLib from './index';
import { VanillaLib } from './vanilla';

interface BenchmarkResult {
  name: string;
  dataSize: number;
  rustTime: number;
  vanillaTime: number;
  rustMemory: number;
  vanillaMemory: number;
  speedup: number;
}

class BenchmarkSuite {
  private rustLib = new MyPerformanceLib();
  private vanillaLib = new VanillaLib();
  private results: BenchmarkResult[] = [];

  private generateRandomArray(size: number): number[] {
    return Array.from({ length: size }, () => Math.random() * 1000);
  }

  private getMemoryUsage(): number {
    if (typeof process !== 'undefined' && process.memoryUsage) {
      return process.memoryUsage().heapUsed / 1024 / 1024; // MB
    }
    return 0;
  }

  private async benchmarkSum(size: number) {
    const data = this.generateRandomArray(size);

    // Benchmark Vanilla
    const vanillaMemStart = this.getMemoryUsage();
    const vanillaStart = performance.now();
    this.vanillaLib.sum(data);
    const vanillaEnd = performance.now();
    const vanillaMemEnd = this.getMemoryUsage();

    // Petite pause pour la stabilité
    await new Promise(resolve => setTimeout(resolve, 10));

    // Benchmark Rust
    const rustMemStart = this.getMemoryUsage();
    const rustStart = performance.now();
    await this.rustLib.sum(data);
    const rustEnd = performance.now();
    const rustMemEnd = this.getMemoryUsage();

    const vanillaTime = vanillaEnd - vanillaStart;
    const rustTime = rustEnd - rustStart;

    this.results.push({
      name: 'Sum',
      dataSize: size,
      rustTime,
      vanillaTime,
      rustMemory: Math.abs(rustMemEnd - rustMemStart),
      vanillaMemory: Math.abs(vanillaMemEnd - vanillaMemStart),
      speedup: vanillaTime / rustTime
    });
  }

  private async benchmarkSort(size: number) {
    const data = this.generateRandomArray(size);

    // Benchmark Vanilla
    const vanillaMemStart = this.getMemoryUsage();
    const vanillaStart = performance.now();
    this.vanillaLib.sort(data);
    const vanillaEnd = performance.now();
    const vanillaMemEnd = this.getMemoryUsage();

    await new Promise(resolve => setTimeout(resolve, 10));

    // Benchmark Rust
    const rustMemStart = this.getMemoryUsage();
    const rustStart = performance.now();
    await this.rustLib.sort(data);
    const rustEnd = performance.now();
    const rustMemEnd = this.getMemoryUsage();

    const vanillaTime = vanillaEnd - vanillaStart;
    const rustTime = rustEnd - rustStart;

    this.results.push({
      name: 'Sort',
      dataSize: size,
      rustTime,
      vanillaTime,
      rustMemory: Math.abs(rustMemEnd - rustMemStart),
      vanillaMemory: Math.abs(vanillaMemEnd - vanillaMemStart),
      speedup: vanillaTime / rustTime
    });
  }

  private async benchmarkAverage(size: number) {
    const data = this.generateRandomArray(size);

    // Benchmark Vanilla
    const vanillaMemStart = this.getMemoryUsage();
    const vanillaStart = performance.now();
    this.vanillaLib.average(data);
    const vanillaEnd = performance.now();
    const vanillaMemEnd = this.getMemoryUsage();

    await new Promise(resolve => setTimeout(resolve, 10));

    // Benchmark Rust
    const rustMemStart = this.getMemoryUsage();
    const rustStart = performance.now();
    await this.rustLib.average(data);
    const rustEnd = performance.now();
    const rustMemEnd = this.getMemoryUsage();

    const vanillaTime = vanillaEnd - vanillaStart;
    const rustTime = rustEnd - rustStart;

    this.results.push({
      name: 'Average',
      dataSize: size,
      rustTime,
      vanillaTime,
      rustMemory: Math.abs(rustMemEnd - rustMemStart),
      vanillaMemory: Math.abs(vanillaMemEnd - vanillaMemStart),
      speedup: vanillaTime / rustTime
    });
  }

  public async runBenchmarks() {
    console.log('🚀 Lancement des benchmarks de performance...\n');
    console.log('⚡ Comparaison TypeScript Vanilla vs Rust+WASM\n');

    const sizes = [1000, 10000, 100000, 500000];

    for (const size of sizes) {
      console.log(`📊 Testing avec ${size.toLocaleString()} éléments...`);

      await this.benchmarkSum(size);
      await this.benchmarkAverage(size);
      await this.benchmarkSort(size);

      // Pause entre les tailles pour la stabilité
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    this.printResults();
  }

  private printResults() {
    console.log('\n📈 Résultats des benchmarks:\n');

    // Grouper par taille de données
    const groupedResults = this.results.reduce((acc, result) => {
      if (!acc[result.dataSize]) {
        acc[result.dataSize] = [];
      }
      acc[result.dataSize].push(result);
      return acc;
    }, {} as Record<number, BenchmarkResult[]>);

    Object.entries(groupedResults).forEach(([size, results]) => {
      console.log(`🔬 Taille des données: ${parseInt(size).toLocaleString()} éléments`);
      console.log('━'.repeat(60));

      results.forEach(result => {
        const speedupText = result.speedup > 1
          ? `🟢 ${result.speedup.toFixed(2)}x plus rapide`
          : `🔴 ${(1 / result.speedup).toFixed(2)}x plus lent`;

        console.log(`${result.name}:`);
        console.log(`  ⏱️  Temps:`);
        console.log(`     Rust:    ${result.rustTime.toFixed(3)}ms`);
        console.log(`     Vanilla: ${result.vanillaTime.toFixed(3)}ms`);
        console.log(`     Speedup: ${speedupText}`);

        if (result.rustMemory > 0 || result.vanillaMemory > 0) {
          console.log(`  💾 Mémoire:`);
          console.log(`     Rust:    ${result.rustMemory.toFixed(2)}MB`);
          console.log(`     Vanilla: ${result.vanillaMemory.toFixed(2)}MB`);
        }
        console.log('');
      });
    });

    // Statistiques globales
    const avgSpeedup = this.results.reduce((sum, r) => sum + r.speedup, 0) / this.results.length;
    const maxSpeedup = Math.max(...this.results.map(r => r.speedup));
    const minSpeedup = Math.min(...this.results.map(r => r.speedup));

    console.log('📊 Statistiques globales:');
    console.log(`   Speedup moyen:  ${avgSpeedup.toFixed(2)}x`);
    console.log(`   Speedup max:    ${maxSpeedup.toFixed(2)}x`);
    console.log(`   Speedup min:    ${minSpeedup.toFixed(2)}x`);

    if (avgSpeedup > 1) {
      console.log('\n🎉 Rust/WASM est en moyenne plus performant !');
    } else {
      console.log('\n⚠️  TypeScript vanilla est en moyenne plus performant.');
      console.log('   (Cela peut être dû à l\'overhead de WASM pour de petites données)');
    }
  }
}

// Exécution des benchmarks
const benchmarkSuite = new BenchmarkSuite();
benchmarkSuite.runBenchmarks().catch(console.error);
