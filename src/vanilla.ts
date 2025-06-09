// Implémentations TypeScript vanilla pour comparaison

export class VanillaLib {
  /**
   * Calcule la somme d'un tableau de nombres en TypeScript
   */
  public sum(numbers: number[]): number {
    return numbers.reduce((acc, num) => acc + num, 0);
  }

  /**
   * Calcule la moyenne d'un tableau de nombres en TypeScript
   */
  public average(numbers: number[]): number {
    if (numbers.length === 0) return 0;
    return this.sum(numbers) / numbers.length;
  }

  /**
   * Trie un tableau de nombres en TypeScript
   */
  public sort(numbers: number[]): number[] {
    return [...numbers].sort((a, b) => a - b);
  }
}
