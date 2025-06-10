import { QuicklyArray } from '../../src/core/Array';
import { WasmBindings } from '../../src/wasm/bindings';

describe('Array Math Operations', () => {
  describe('QuicklyArray', () => {
    let arr1: QuicklyArray;
    let arr2: QuicklyArray;

    beforeEach(() => {
      arr1 = new QuicklyArray([1, 2, 3, 4, 5]);
      arr2 = new QuicklyArray([2, 3, 4, 5, 6]);
    });

    describe('Constructor and Properties', () => {
      it('should create array from number[]', () => {
        const arr = new QuicklyArray([1, 2, 3]);
        expect(arr.length).toBe(3);
        expect(arr.values).toEqual([1, 2, 3]);
      });

      it('should create array from Float64Array', () => {
        const arr = new QuicklyArray(new Float64Array([1, 2, 3]));
        expect(arr.length).toBe(3);
        expect(arr.values).toEqual([1, 2, 3]);
      });

      it('should return immutable copy of values', () => {
        const arr = new QuicklyArray([1, 2, 3]);
        const values = arr.values;
        values[0] = 999;
        expect(arr.values[0]).toBe(1); // Doit rester inchangé
      });
    });

    describe('Addition Operations', () => {
      it('should add two arrays element-wise', () => {
        const result = arr1.add(arr2.values);
        expect(result).toEqual([3, 5, 7, 9, 11]);
      });

      it('should add arrays of different lengths (use min length)', () => {
        const arr3 = new QuicklyArray([1, 2]);
        const result = arr1.add(arr3.values);
        expect(result).toEqual([2, 4]); // Seulement les 2 premiers éléments
      });

      it('should add scalar to all elements', () => {
        const result = arr1.addScalar(10);
        expect(result).toEqual([11, 12, 13, 14, 15]);
      });

      it('should handle negative scalar addition', () => {
        const result = arr1.addScalar(-1);
        expect(result).toEqual([0, 1, 2, 3, 4]);
      });

      it('should handle zero scalar addition', () => {
        const result = arr1.addScalar(0);
        expect(result).toEqual([1, 2, 3, 4, 5]);
      });
    });

    describe('Sum Operation', () => {
      it('should calculate sum correctly', () => {
        const result = arr1.sum();
        expect(result).toBe(15); // 1+2+3+4+5
      });

      it('should handle empty array sum', () => {
        const emptyArr = new QuicklyArray([]);
        const result = emptyArr.sum();
        expect(result).toBe(0);
      });

      it('should handle single element sum', () => {
        const singleArr = new QuicklyArray([42]);
        const result = singleArr.sum();
        expect(result).toBe(42);
      });

      it('should handle decimal numbers', () => {
        const decimalArr = new QuicklyArray([1.1, 2.2, 3.3]);
        const result = decimalArr.sum();
        expect(result).toBeCloseTo(6.6, 10);
      });
    });

    describe('Utility Methods', () => {
      it('should create from array using static method', () => {
        const arr = QuicklyArray.fromArray([10, 20, 30]);
        expect(arr.length).toBe(3);
        expect(arr.values).toEqual([10, 20, 30]);
      });

      it('should display correct toString for small arrays', () => {
        const arr = new QuicklyArray([1, 2, 3]);
        const str = arr.toString();
        expect(str).toBe('QuicklyArray(3) [1, 2, 3]');
      });

      it('should display correct toString for large arrays', () => {
        const largeArray = Array.from({ length: 20 }, (_, i) => i + 1);
        const arr = new QuicklyArray(largeArray);
        const str = arr.toString();
        expect(str).toContain('QuicklyArray(20)');
        expect(str).toContain('...');
        expect(str).toContain('1, 2, 3, 4, 5'); // Premiers éléments
        expect(str).toContain('16, 17, 18, 19, 20'); // Derniers éléments
      });
    });
  });

  describe('WasmBindings Direct Tests', () => {
    describe('Array Addition', () => {
      it('should add arrays correctly via WASM', () => {
        const a = [1, 2, 3];
        const b = [4, 5, 6];
        const result = WasmBindings.arrayAdd(a, b);
        expect(result).toEqual([5, 7, 9]);
      });

      it('should handle empty arrays', () => {
        const result = WasmBindings.arrayAdd([], []);
        expect(result).toEqual([]);
      });

      it('should handle mismatched array lengths', () => {
        const a = [1, 2, 3, 4];
        const b = [5, 6];
        const result = WasmBindings.arrayAdd(a, b);
        expect(result).toEqual([6, 8]); // Utilise la longueur minimale
      });
    });

    describe('Scalar Addition', () => {
      it('should add scalar correctly via WASM', () => {
        const arr = [1, 2, 3];
        const result = WasmBindings.arrayAddScalar(arr, 5);
        expect(result).toEqual([6, 7, 8]);
      });

      it('should handle negative scalars', () => {
        const arr = [10, 20, 30];
        const result = WasmBindings.arrayAddScalar(arr, -5);
        expect(result).toEqual([5, 15, 25]);
      });
    });

    describe('Sum Operation', () => {
      it('should calculate sum correctly via WASM', () => {
        const arr = [1, 2, 3, 4, 5];
        const result = WasmBindings.arraySum(arr);
        expect(result).toBe(15);
      });

      it('should handle decimals', () => {
        const arr = [1.5, 2.5, 3.0];
        const result = WasmBindings.arraySum(arr);
        expect(result).toBeCloseTo(7.0, 10);
      });
    });
  });

  describe('Performance Edge Cases', () => {
    it('should handle large arrays efficiently', () => {
      const size = 100000;
      const largeArray1 = Array.from({ length: size }, (_, i) => i);
      const largeArray2 = Array.from({ length: size }, (_, i) => i * 2);

      const arr = new QuicklyArray(largeArray1);

      const start = performance.now();
      const result = arr.add(largeArray2);
      const end = performance.now();

      expect(result.length).toBe(size);
      expect(result[0]).toBe(0); // 0 + 0
      expect(result[1]).toBe(3); // 1 + 2
      expect(result[size - 1]).toBe((size - 1) * 3); // (n-1) + 2*(n-1)

      console.log(`Large array addition took ${end - start} ms`);
      expect(end - start).toBeLessThan(1000); // Doit être rapide
    });

    it('should handle NaN and Infinity', () => {
      const arr = new QuicklyArray([1, NaN, Infinity, -Infinity, 5]);
      const result = arr.addScalar(1);

      expect(result[0]).toBe(2);
      expect(result[1]).toBeNaN();
      expect(result[2]).toBe(Infinity);
      expect(result[3]).toBe(-Infinity);
      expect(result[4]).toBe(6);
    });
  });
});
