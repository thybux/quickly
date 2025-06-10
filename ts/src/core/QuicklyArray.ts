import wasm from "wasm";
import { ArrayOps, StatsOps, MathOps } from "../modules";

export class QuicklyArray {
  public array: ArrayOps;
  public stats: StatsOps;
  public math: MathOps;

  constructor() {
    this.array = new ArrayOps();
    this.stats = new StatsOps();
    this.math = new MathOps();
  }
}
