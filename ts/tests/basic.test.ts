import { isWasmAvailable, testWasm } from '../src';
import { QuicklyArray } from '../src/core/QuicklyArray';

const describeWasm = isWasmAvailable() ? describe : describe.skip;

describe('Quickly Library - Basic Tests', () => {

    describe('Setup', () => {
        it('should detect WASM availability', () => {
            const available = isWasmAvailable();
            expect(typeof available).toBe('boolean');

            if (available) {
                console.log('✅ WASM module available');
            } else {
                console.log('❌ WASM module not available');
            }
        });

        it('should pass basic WASM test if available', () => {
            if (isWasmAvailable()) {
                expect(testWasm()).toBe(true);
            } else {
                console.log('⏭️  Skipping WASM test - module not available');
                expect(true).toBe(true);
            }
        });
    });

    describeWasm('QuicklyArray', () => {
        let arr: QuicklyArray;

        beforeEach(() => {
            arr = new QuicklyArray([1, 2, 3, 4, 5]);
        });

        describe('Constructor', () => {
            it('should create array from numbers', () => {
                expect(arr.length).toBe(5);
                expect(arr.values).toEqual([1, 2, 3, 4, 5]);
            });

            it('should return immutable values', () => {
                const values = arr.values;
                values[0] = 999;
                expect(arr.values[0]).toBe(1);
            });
        });

        describe('Math Operations', () => {
            it('should add arrays', () => {
                const result = arr.add([1, 1, 1, 1, 1]);
                expect(result).toEqual([2, 3, 4, 5, 6]);
            });

            it('should add scalar', () => {
                const result = arr.addScalar(10);
                expect(result).toEqual([11, 12, 13, 14, 15]);
            });

            it('should calculate sum', () => {
                expect(arr.sum()).toBe(15);
            });

            it('should subtract arrays', () => {
                const result = arr.subtract([1, 1, 1, 1, 1]);
                expect(result).toEqual([0, 1, 2, 3, 4]);
            });

            it('should multiply arrays', () => {
                const result = arr.multiply([2, 2, 2, 2, 2]);
                expect(result).toEqual([2, 4, 6, 8, 10]);
            });

            it('should calculate mean', () => {
                expect(arr.mean()).toBe(3);
            });

            it('should find min and max', () => {
                expect(arr.min()).toBe(1);
                expect(arr.max()).toBe(5);
            });
        });

        describe('Edge Cases', () => {
            it('should handle empty arrays', () => {
                const empty = new QuicklyArray([]);
                expect(empty.length).toBe(0);

                // Utiliser toBeCloseTo pour gérer -0 vs 0
                expect(empty.sum()).toBeCloseTo(0, 10);
            });

            it('should handle single element', () => {
                const single = new QuicklyArray([42]);
                expect(single.sum()).toBe(42);
                expect(single.mean()).toBe(42);
            });

            it('should handle negative numbers', () => {
                const negative = new QuicklyArray([-1, -2, -3]);
                expect(negative.sum()).toBe(-6);
                expect(negative.mean()).toBe(-2);
            });

            it('should handle zeros correctly', () => {
                const zeros = new QuicklyArray([0, 0, 0]);
                expect(zeros.sum()).toBeCloseTo(0, 10);
                expect(zeros.mean()).toBeCloseTo(0, 10);
            });
        });

        describe('String representation', () => {
            it('should display correctly', () => {
                const str = arr.toString();
                expect(str).toBe('QuicklyArray(5) [1, 2, 3, 4, 5]');
            });

            it('should display empty array correctly', () => {
                const empty = new QuicklyArray([]);
                expect(empty.toString()).toBe('QuicklyArray(0) []');
            });

            it('should truncate large arrays', () => {
                const large = new QuicklyArray(Array.from({length: 20}, (_, i) => i));
                const str = large.toString();
                expect(str).toContain('...');
                expect(str).toContain('QuicklyArray(20)');
            });
        });
    });

    describe('Fallback when WASM unavailable', () => {
        it('should handle missing WASM gracefully', () => {
            if (!isWasmAvailable()) {
                expect(() => {
                    new QuicklyArray([1, 2, 3]).sum();
                }).toThrow(/WASM/);
            } else {
                // Si WASM est disponible, ce test est N/A
                expect(true).toBe(true);
            }
        });
    });
});