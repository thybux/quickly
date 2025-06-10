import { QuicklyArray } from '../core/QuicklyArray';
import { WasmBindings } from '../wasm/bindings';
import { isWasmReady } from '../index';

// Tests conditionnels basés sur la disponibilité de WASM
const describeWasm = isWasmReady() ? describe : describe.skip;

describe('Quickly Library - Math Operations', () => {

  describe('QuicklyArray Construction', () => {
    it('should create array from number[]', () => {
      const arr = new QuicklyArray([1, 2, 3, 4, 5]);
      expect(arr.length).toBe(5);
      expect(arr.values).toEqual([1, 2, 3, 4, 5]);
    });

    it('should create array from Float64Array', () => {
      const arr = new QuicklyArray(new Float64Array([1, 2, 3]));
      expect(arr.length).toBe(3);
      expect(arr.values).toEqual([1, 2, 3]);
    });

    it('should create empty array', () => {
      const arr = new QuicklyArray([]);
      expect(arr.length).toBe(0);
      expect(arr.isEmpty).toBe(true);
    });

    it('should validate input by default', () => {
      expect(() => {
        // @ts-ignore - Testing invalid input
        new QuicklyArray(['invalid', 2, 3]);
      }).toThrow('All elements must be numbers');
    });

    it('should return immutable copy of values', () => {
      const arr = new QuicklyArray([1, 2, 3]);
      const values = arr.values;
      values[0] = 999;
      expect(arr.values[0]).toBe(1); // Should remain unchanged
    });
  });

  describe('Static Factory Methods', () => {
    it('should create zeros array', () => {
      const arr = QuicklyArray.zeros(5);
      expect(arr.values).toEqual([0, 0, 0, 0, 0]);
    });

    it('should create ones array', () => {
      const arr = QuicklyArray.ones(3);
      expect(arr.values).toEqual([1, 1, 1]);
    });

    it('should create range array', () => {
      const arr = QuicklyArray.range(0, 5);
      expect(arr.values).toEqual([0, 1, 2, 3, 4]);
    });

    it('should create range with step', () => {
      const arr = QuicklyArray.range(0, 10, 2);
      expect(arr.values).toEqual([0, 2, 4, 6, 8]);
    });

    it('should create random array', () => {
      const arr = QuicklyArray.random(5, 0, 1);
      expect(arr.length).toBe(5);
      arr.values.forEach(val => {
        expect(val).toBeGreaterThanOrEqual(0);
        expect(val).toBeLessThan(1);
      });
    });
  });

  describeWasm('WASM Operations', () => {
    let arr1: QuicklyArray;
    let arr2: QuicklyArray;

    beforeEach(() => {
      arr1 = new QuicklyArray([1, 2, 3, 4, 5]);
      arr2 = new QuicklyArray([2, 3, 4, 5, 6]);
    });

    describe('Basic Addition', () => {
      it('should add arrays element-wise', () => {
        const result = arr1.add(arr2.values);
        expect(result).toEqual([3, 5, 7, 9, 11]);
      });

      it('should add scalar to array', () => {
        const result = arr1.addScalar(10);
        expect(result).toEqual([11, 12, 13, 14, 15]);
      });

      it('should handle negative scalars', () => {
        const result = arr1.addScalar(-1);
        expect(result).toEqual([0, 1, 2, 3, 4]);
      });
    });

    describe('Subtraction', () => {
      it('should subtract arrays element-wise', () => {
        const result = arr2.subtract(arr1.values);
        expect(result).toEqual([1, 1, 1, 1, 1]);
      });

      it('should subtract scalar from array', () => {
        const result = arr1.subtractScalar(1);
        expect(result).toEqual([0, 1, 2, 3, 4]);
      });
    });

    describe('Multiplication', () => {
      it('should multiply arrays element-wise', () => {
        const result = arr1.multiply(arr2.values);
        expect(result).toEqual([2, 6, 12, 20, 30]);
      });

      it('should multiply array by scalar', () => {
        const result = arr1.multiplyScalar(2);
        expect(result).toEqual([2, 4, 6, 8, 10]);
      });
    });

    describe('Division', () => {
      it('should divide arrays element-wise', () => {
        const arr3 = new QuicklyArray([10, 15, 20]);
        const arr4 = new QuicklyArray([2, 3, 4]);
        const result = arr3.divide(arr4.values);
        expect(result).toEqual([5, 5, 5]);
      });

      it('should divide array by scalar', () => {
        const arr = new QuicklyArray([10, 20, 30]);
        const result = arr.divideScalar(5);
        expect(result).toEqual([2, 4, 6]);
      });

      it('should throw error when dividing by zero', () => {
        expect(() => {
          arr1.divideScalar(0);
        }).toThrow();
      });
    });

    describe('Statistical Functions', () => {
      const testData = new QuicklyArray([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

      it('should calculate sum correctly', () => {
        expect(testData.sum()).toBe(55);
      });

      it('should calculate mean correctly', () => {
        expect(testData.mean()).toBe(5.5);
      });

      it('should find min and max', () => {
        expect(testData.min()).toBe(1);
        expect(testData.max()).toBe(10);
      });

      it('should calculate variance and std', () => {
        const simpleData = new QuicklyArray([1, 2, 3, 4, 5]);
        const variance = simpleData.variance();
        const std = simpleData.std();

        expect(variance).toBeCloseTo(2.5, 10);
        expect(std).toBeCloseTo(Math.sqrt(2.5), 10);
      });

      it('should describe array statistics', () => {
        const stats = testData.describe();
        expect(stats.mean).toBe(5.5);
        expect(stats.min).toBe(1);
        expect(stats.max).toBe(10);
        expect(stats.sum).toBe(55);
        expect(stats.count).toBe(10);
      });
    });

    describe('Array Utilities', () => {
      it('should map over elements', () => {
        const arr = new QuicklyArray([1, 2, 3]);
        const doubled = arr.map(x => x * 2);
        expect(doubled.values).toEqual([2, 4, 6]);
        expect(arr.values).toEqual([1, 2, 3]); // Original unchanged
      });

      it('should filter elements', () => {
        const arr = new QuicklyArray([1, 2, 3, 4, 5]);
        const even = arr.filter(x => x % 2 === 0);
        expect(even.values).toEqual([2, 4]);
      });

      it('should copy array', () => {
        const arr = new QuicklyArray([1, 2, 3]);
        const copy = arr.copy();
        expect(copy.values).toEqual(arr.values);
        expect(copy).not.toBe(arr);
      });
    });

    describe('String Representations', () => {
      it('should display small arrays completely', () => {
        const arr = new QuicklyArray([1, 2, 3]);
        expect(arr.toString()).toBe('QuicklyArray(3) [1, 2, 3]');
      });

      it('should truncate large arrays', () => {
        const largeArray = QuicklyArray.range(0, 20);
        const str = largeArray.toString();
        expect(str).toContain('QuicklyArray(20)');
        expect(str).toContain('...');
      });

      it('should show detailed info', () => {
        const arr = new QuicklyArray([1, 2, 3, 4, 5]);
        const info = arr.info();
        expect(info).toContain('Length: 5');
        expect(info).toContain('Mean: 3.000');
      });
    });
  });

  describeWasm('WasmBindings Direct Tests', () => {
    describe('Direct WASM Calls', () => {
      it('should call array operations directly', () => {
        const a = [1, 2, 3];
        const b = [4, 5, 6];

        const sum = WasmBindings.arrayAdd(a, b);
        expect(sum).toEqual([5, 7, 9]);

        const scalar = WasmBindings.arrayAddScalar(a, 10);
        expect(scalar).toEqual([11, 12, 13]);

        const total = WasmBindings.arraySum(a);
        expect(total).toBe(6);
      });

      it('should handle empty arrays', () => {
        const result = WasmBindings.arrayAdd([], []);
        expect(result).toEqual([]);

        const sum = WasmBindings.arraySum([]);
        expect(sum).toBe(0);
      });

      it('should handle mismatched lengths', () => {
        const short = [1, 2];
        const long = [10, 20, 30, 40];

        const result = WasmBindings.arrayAdd(short, long);
        expect(result).toEqual([11, 22]); // Uses minimum length
      });
    });

    describe('Statistical Operations', () => {
      const testData = [1, 2, 3, 4, 5];

      it('should compute statistics correctly', () => {
        expect(WasmBindings.arrayMean(testData)).toBe(3);
        expect(WasmBindings.arrayMin(testData)).toBe(1);
        expect(WasmBindings.arrayMax(testData)).toBe(5);
        expect(WasmBindings.arraySum(testData)).toBe(15);
      });

      it('should handle edge cases', () => {
        const single = [42];
        expect(WasmBindings.arrayMean(single)).toBe(42);
        expect(WasmBindings.arrayMin(single)).toBe(42);
        expect(WasmBindings.arrayMax(single)).toBe(42);

        // Std and variance should throw for single elements
        expect(() => WasmBindings.arrayStd(single)).toThrow();
        expect(() => WasmBindings.arrayVariance(single)).toThrow();
      });
    });
  });

  describe('Fallback Tests (when WASM unavailable)', () => {
    it('should provide helpful error messages', () => {
      if (!isWasmReady()) {
        expect(() => {
          new QuicklyArray([1, 2, 3]).sum();
        }).toThrow(/WASM/);
      }
    });

    it('should detect WASM availability', () => {
      const available = WasmBindings.isAvailable();
      expect(typeof available).toBe('boolean');

      const info = WasmBindings.getInfo();
      expect(info).toHaveProperty('available');
      if (!info.available) {
        expect(info).toHaveProperty('error');
      }
    });
  });
});