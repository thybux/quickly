import { describe, it, expect, beforeAll } from '@jest/globals';
import * as wasm from '../pkg/quickly';

describe('WASM Math Functions', () => {
  beforeAll(async () => {
    // Initialiser WASM si nécessaire
  });

  describe('Addition', () => {
    it('should add two arrays element-wise', () => {
      const a = [1, 2, 3, 4];
      const b = [5, 6, 7, 8];
      const result = wasm.array_add(a, b);
      expect(Array.from(result)).toEqual([6, 8, 10, 12]);
    });

    it('should handle arrays of different lengths', () => {
      const a = [1, 2, 3];
      const b = [4, 5];
      const result = wasm.array_add(a, b);
      expect(Array.from(result)).toEqual([5, 7]);
    });

    it('should add scalar to array', () => {
      const arr = [1, 2, 3, 4];
      const scalar = 10;
      const result = wasm.array_add_scalar(arr, scalar);
      expect(Array.from(result)).toEqual([11, 12, 13, 14]);
    });

    it('should sum all elements', () => {
      const arr = [1, 2, 3, 4, 5];
      const result = wasm.array_sum(arr);
      expect(result).toBe(15);
    });
  });

  describe('Subtraction', () => {
    it('should subtract two arrays element-wise', () => {
      const a = [10, 8, 6, 4];
      const b = [1, 2, 3, 4];
      const result = wasm.array_subtract(a, b);
      expect(Array.from(result)).toEqual([9, 6, 3, 0]);
    });

    it('should subtract scalar from array', () => {
      const arr = [10, 20, 30, 40];
      const scalar = 5;
      const result = wasm.array_subtract_scalar(arr, scalar);
      expect(Array.from(result)).toEqual([5, 15, 25, 35]);
    });
  });

  describe('Multiplication', () => {
    it('should multiply two arrays element-wise', () => {
      const a = [2, 3, 4, 5];
      const b = [1, 2, 3, 4];
      const result = wasm.array_multiply(a, b);
      expect(Array.from(result)).toEqual([2, 6, 12, 20]);
    });

    it('should multiply array by scalar', () => {
      const arr = [1, 2, 3, 4];
      const scalar = 3;
      const result = wasm.array_multiply_scalar(arr, scalar);
      expect(Array.from(result)).toEqual([3, 6, 9, 12]);
    });
  });

  describe('Division', () => {
    it('should divide two arrays element-wise', () => {
      const a = [10, 15, 20, 25];
      const b = [2, 3, 4, 5];
      const result = wasm.array_divide(a, b);
      expect(Array.from(result)).toEqual([5, 5, 5, 5]);
    });

    it('should divide array by scalar', () => {
      const arr = [10, 20, 30, 40];
      const scalar = 2;
      const result = wasm.array_divide_scalar(arr, scalar);
      expect(Array.from(result)).toEqual([5, 10, 15, 20]);
    });

    it('should throw on division by zero scalar', () => {
      const arr = [1, 2, 3];
      expect(() => wasm.array_divide_scalar(arr, 0)).toThrow();
    });

    it('should throw on empty arrays', () => {
      expect(() => wasm.array_divide([], [1, 2, 3])).toThrow();
    });
  });

  describe('Statistics', () => {
    const testArray = [1, 2, 3, 4, 5];

    it('should calculate mean correctly', () => {
      const result = wasm.array_mean(testArray);
      expect(result).toBe(3);
    });

    it('should find minimum value', () => {
      const result = wasm.array_min(testArray);
      expect(result).toBe(1);
    });

    it('should find maximum value', () => {
      const result = wasm.array_max(testArray);
      expect(result).toBe(5);
    });

    it('should calculate variance correctly', () => {
      const result = wasm.array_variance(testArray);
      expect(result).toBeCloseTo(2.5, 5); // variance of [1,2,3,4,5]
    });

    it('should calculate standard deviation correctly', () => {
      const result = wasm.array_std(testArray);
      expect(result).toBeCloseTo(Math.sqrt(2.5), 5);
    });

    it('should throw on empty array for statistics', () => {
      expect(() => wasm.array_mean([])).toThrow();
      expect(() => wasm.array_min([])).toThrow();
      expect(() => wasm.array_max([])).toThrow();
    });

    it('should throw on insufficient data for variance/std', () => {
      expect(() => wasm.array_variance([1])).toThrow();
      expect(() => wasm.array_std([1])).toThrow();
    });
  });
});
