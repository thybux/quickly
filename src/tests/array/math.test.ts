import { QuicklyArray } from '../../typescript/core/Array';

interface TestResult {
  name: string;
  passed: boolean;
  expected: any;
  actual: any;
  error?: string;
}

class ArrayMathTests {
  private results: TestResult[] = [];

  private assert(name: string, expected: any, actual: any, tolerance = 0.0001) {
    let passed = false;
    let error: string | undefined;

    try {
      if (Array.isArray(expected) && Array.isArray(actual)) {
        passed = expected.length === actual.length &&
          expected.every((val, i) => Math.abs(val - actual[i]) < tolerance);
      } else if (typeof expected === 'number' && typeof actual === 'number') {
        passed = Math.abs(expected - actual) < tolerance;
      } else {
        passed = expected === actual;
      }
    } catch (e) {
      error = e instanceof Error ? e.message : String(e);
      passed = false;
    }

    this.results.push({
      name,
      passed,
      expected,
      actual,
      error
    });
  }

  async testArrayAddition() {
    console.log('🧪 Test: Addition de deux arrays...');

    const arr1 = new QuicklyArray([1, 2, 3, 4, 5]);
    const arr2 = new QuicklyArray([10, 20, 30, 40, 50]);

    const result = arr1.add(arr2.values);
    const expected = [11, 22, 33, 44, 55];

    this.assert('Array addition', expected, result);
  }

  async testScalarAddition() {
    console.log('🧪 Test: Addition scalaire...');

    const arr = new QuicklyArray([1, 2, 3, 4, 5]);
    const result = arr.addScalar(10);
    const expected = [11, 12, 13, 14, 15];

    this.assert('Scalar addition', expected, result);
  }

  async testArraySum() {
    console.log('🧪 Test: Somme d\'array...');

    const arr = new QuicklyArray([1, 2, 3, 4, 5]);
    const result = arr.sum();
    const expected = 15;

    this.assert('Array sum', expected, result);
  }

  async testEdgeCases() {
    console.log('🧪 Test: Cas limites...');

    // Array vide
    const emptyArr = new QuicklyArray([]);
    this.assert('Empty array sum', 0, emptyArr.sum());

    // Arrays de tailles différentes
    const arr1 = new QuicklyArray([1, 2, 3]);
    const arr2 = [10, 20, 30, 40, 50];
    const result = arr1.add(arr2);
    this.assert('Different size arrays', [11, 22, 33], result);

    // Nombres négatifs
    const negArr = new QuicklyArray([-1, -2, -3]);
    this.assert('Negative numbers sum', -6, negArr.sum());
  }

  async runAll() {
    console.log('🚀 Lancement des tests Array Math...\n');

    await this.testArrayAddition();
    await this.testScalarAddition();
    await this.testArraySum();
    await this.testEdgeCases();

    this.printResults();
  }

  private printResults() {
    console.log('\n📊 Résultats des tests Array Math:\n');

    this.results.forEach(result => {
      const status = result.passed ? '✅ PASS' : '❌ FAIL';
      console.log(`${status} ${result.name}`);

      if (!result.passed) {
        console.log(`  Attendu: ${JSON.stringify(result.expected)}`);
        console.log(`  Reçu:    ${JSON.stringify(result.actual)}`);
        if (result.error) {
          console.log(`  Erreur:  ${result.error}`);
        }
      }
      console.log('');
    });

    const passedTests = this.results.filter(r => r.passed).length;
    const totalTests = this.results.length;

    console.log(`📈 Résumé: ${passedTests}/${totalTests} tests réussis`);

    if (passedTests === totalTests) {
      console.log('🎉 Tous les tests Array Math sont passés !');
    } else {
      console.log('⚠️  Certains tests ont échoué.');
      process.exit(1);
    }
  }
}

// Export pour être utilisé par le runner de tests principal
export { ArrayMathTests };

// Si exécuté directement, lancer les tests
if (require.main === module) {
  const testSuite = new ArrayMathTests();
  testSuite.runAll().catch(console.error);
}
