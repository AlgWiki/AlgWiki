import { randomBytes } from "crypto";
import { promisify } from "util";

export class Boundary {
  public readonly error: string;
  public readonly start: string;
  public readonly end: string;

  public static async create(): Promise<Boundary> {
    const buf = await promisify(randomBytes)(16);
    return new Boundary(`_${buf.toString("hex")}_`);
  }

  private constructor(public readonly marker: string) {
    this.error = `${this.marker}error`;
    this.start = `${this.marker}start`;
    this.end = `${this.marker}end`;
  }

  public toString(): string {
    return this.marker;
  }
}
