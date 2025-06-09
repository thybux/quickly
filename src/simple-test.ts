import MyPerformanceLib from './index';

async function testBasic() {
  console.log('🧪 Test basique de la lib...');

  const lib = new MyPerformanceLib();

  // Test simple avec quelques nombres
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  try {
    const sum = await lib.sum(numbers);
    console.log(`✅ Somme de [1..10]: ${sum} (attendu: 55)`);

    const average = await lib.average(numbers);
    console.log(`✅ Moyenne de [1..10]: ${average} (attendu: 5.5)`);

    const sorted = await lib.sort([5, 2, 8, 1, 9]);
    console.log(`✅ Tri de [5,2,8,1,9]: [${sorted}] (attendu: [1,2,5,8,9])`);

    console.log('🎉 Tous les tests basiques passent !');

  } catch (error) {
    console.error('❌ Erreur:', error);
  }
}

testBasic();
