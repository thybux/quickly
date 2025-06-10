export * from './array';
export * from './wasm.d';

export interface QuicklyConfig {
  wasmPath?: string;
  enableLogging?: boolean;
  autoInit?: boolean;
}

export interface QuicklyInfo {
  version: string;
  wasmReady: boolean;
  buildDate: string;
  features: string[];
}