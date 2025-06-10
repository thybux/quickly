import {
  array_subtract,
  array_subtract_scalar,
  array_multiply,
  array_multiply_scalar,
  array_divide,
  array_divide_scalar,
  array_mean,
  array_min,
  array_max,
  array_std,
  array_variance
} from '../../../../pkg/quickly';

describe('Extended Math Operations (Direct WASM)', () => {
  describe('Subtraction', () => {
    it('should subtract arrays element-wise', () => {
      const a = new Float64Array([10, 8, 6, 4]);
      const b = new Float64Array([1, 2, 3, 4]);
      const result = Array.from(array_subtract(a, b));
      expect(result).toEqual([9, 6, 3, 0]);
    });

    it('should subtract scalar from array', () => {
      const arr = new Float64Array([10, 20, 30]);
      const result = Array.from(array_subtract_scalar(arr, 5));
      expect(result).toEqual([5, 15, 25]);
    });
  });

  describe('Multiplication', () => {
    it('should multiply arrays element-wise', () => {
      const a = new Float64Array([2, 3, 4]);
      const b = new Float64Array([5, 6, 7]);
      const result = Array.from(array_multiply(a, b));
      expect(result).toEqual([10, 18, 28]);
    });

    it('should multiply array by scalar', () => {
      const arr = new Float64Array([1, 2, 3, 4]);
      const result = Array.from(array_multiply_scalar(arr, 3));
      expect(result).toEqual([3, 6, 9, 12]);
    });
  });

  describe('Division', () => {
    it('should divide arrays element-wise', () => {
      const a = new Float64Array([10, 15, 20]);
      const b = new Float64Array([2, 3, 4]);
      const result = Array.from(array_divide(a, b));
      expect(result).toEqual([5, 5, 5]);
    });

    it('should divide array by scalar', () => {
      const arr = new Float64Array([10, 20, 30]);
      const result = Array.from(array_divide_scalar(arr, 5));
      expect(result).toEqual([2, 4, 6]);
    });

    it('should throw error when dividing by zero scalar', () => {
      const arr = new Float64Array([1, 2, 3]);
      expect(() => array_divide_scalar(arr, 0)).toThrow();
    });
  });

  describe('Statistical Functions', () => {
    const testData = new Float64Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

    it('should calculate mean correctly', () => {
      const result = array_mean(testData);
      expect(result).toBe(5.5); // (1+2+...+10)/10
    });

    it('should find minimum value', () => {
      const result = array_min(testData);
      expect(result).toBe(1);
    });

    it('should find maximum value', () => {
      const result = array_max(testData);
      expect(result).toBe(10);
    });

    it('should calculate variance correctly', () => {
      // Pour [1,2,3,4,5], moyenne = 3
      // Variance = [(1-3)² + (2-3)² + (3-3)² + (4-3)² + (5-3)²] / (5-1)
      //          = [4 + 1 + 0 + 1 + 4] / 4 = 10/4 = 2.5
      const simpleData = new Float64Array([1, 2, 3, 4, 5]);
      const result = array_variance(simpleData);
      expect(result).toBeCloseTo(2.5, 10);
    });

    it('should calculate standard deviation correctly', () => {
      const simpleData = new Float64Array([1, 2, 3, 4, 5]);
      const result = array_std(simpleData);
      const expectedStd = Math.sqrt(2.5); // sqrt(variance)
      expect(result).toBeCloseTo(expectedStd, 10);
    });

    it('should handle edge cases for statistical functions', () => {
      // Test avec un seul élément (doit lever une erreur pour std/variance)
      const singleElement = new Float64Array([5]);
      expect(() => array_std(singleElement)).toThrow();
      expect(() => array_variance(singleElement)).toThrow();

      // Mais mean, min, max doivent fonctionner
      expect(array_mean(singleElement)).toBe(5);
      expect(array_min(singleElement)).toBe(5);
      expect(array_max(singleElement)).toBe(5);
    });

    it('should handle negative numbers', () => {
      const negativeData = new Float64Array([-5, -2, 0, 2, 5]);
      expect(array_mean(negativeData)).toBe(0);
      expect(array_min(negativeData)).toBe(-5);
      expect(array_max(negativeData)).toBe(5);
    });
  });

  describe('Array Length Mismatch Handling', () => {
    it('should handle different length arrays in operations', () => {
      const short = new Float64Array([1, 2]);
      const long = new Float64Array([10, 20, 30, 40]);

      // Doit utiliser la longueur minimale
      const addResult = Array.from(array_subtract(long, short));
      expect(addResult).toEqual([9, 18]); // Seulement les 2 premiers

      const mulResult = Array.from(array_multiply(short, long));
      expect(mulResult).toEqual([10, 40]); // 1*10, 2*20
    });
  });
});
