import MyPerformanceLib from './index';
import { VanillaLib } from './vanilla';

interface TestResult {
  name: string;
  rustResult: any;
  vanillaResult: any;
  passed: boolean;
}

class TestSuite {
  private rustLib = new MyPerformanceLib();
  private vanillaLib = new VanillaLib();
  private results: TestResult[] = [];

  private async testSum() {
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    const rustResult = await this.rustLib.sum(numbers);
    const vanillaResult = this.vanillaLib.sum(numbers);

    this.results.push({
      name: 'Sum Test',
      rustResult,
      vanillaResult,
      passed: Math.abs(rustResult - vanillaResult) < 0.0001
    });
  }

  private async testAverage() {
    const numbers = [10, 20, 30, 40, 50];

    const rustResult = await this.rustLib.average(numbers);
    const vanillaResult = this.vanillaLib.average(numbers);

    this.results.push({
      name: 'Average Test',
      rustResult,
      vanillaResult,
      passed: Math.abs(rustResult - vanillaResult) < 0.0001
    });
  }

  private async testSort() {
    const numbers = [5, 2, 8, 1, 9, 3];

    const rustResult = await this.rustLib.sort(numbers);
    const vanillaResult = this.vanillaLib.sort(numbers);

    const passed = rustResult.length === vanillaResult.length &&
      rustResult.every((val, i) => Math.abs(val - vanillaResult[i]) < 0.0001);

    this.results.push({
      name: 'Sort Test',
      rustResult,
      vanillaResult,
      passed
    });
  }

  private async testEdgeCases() {
    // Test avec tableau vide
    const emptyArray: number[] = [];
    const rustEmpty = await this.rustLib.sum(emptyArray);
    const vanillaEmpty = this.vanillaLib.sum(emptyArray);

    this.results.push({
      name: 'Empty Array Test',
      rustResult: rustEmpty,
      vanillaResult: vanillaEmpty,
      passed: rustEmpty === vanillaEmpty
    });

    // Test avec un seul élément
    const singleElement = [42];
    const rustSingle = await this.rustLib.average(singleElement);
    const vanillaSingle = this.vanillaLib.average(singleElement);

    this.results.push({
      name: 'Single Element Test',
      rustResult: rustSingle,
      vanillaResult: vanillaSingle,
      passed: Math.abs(rustSingle - vanillaSingle) < 0.0001
    });
  }

  public async runAll() {
    console.log('🧪 Lancement des tests de fonctionnalité...\n');

    await this.testSum();
    await this.testAverage();
    await this.testSort();
    await this.testEdgeCases();

    this.printResults();
  }

  private printResults() {
    console.log('📊 Résultats des tests:\n');

    this.results.forEach(result => {
      const status = result.passed ? '✅ PASS' : '❌ FAIL';
      console.log(`${status} ${result.name}`);
      console.log(`  Rust:    ${JSON.stringify(result.rustResult)}`);
      console.log(`  Vanilla: ${JSON.stringify(result.vanillaResult)}`);
      console.log('');
    });

    const passedTests = this.results.filter(r => r.passed).length;
    const totalTests = this.results.length;

    console.log(`📈 Résumé: ${passedTests}/${totalTests} tests réussis`);

    if (passedTests === totalTests) {
      console.log('🎉 Tous les tests sont passés avec succès !');
    } else {
      console.log('⚠️  Certains tests ont échoué.');
      process.exit(1);
    }
  }
}

// Exécution des tests
const testSuite = new TestSuite();
testSuite.runAll().catch(console.error);
