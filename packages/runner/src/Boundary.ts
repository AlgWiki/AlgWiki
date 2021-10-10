import { randomBytes } from "crypto";
import { promisify } from "util";

export interface IBoundary {
  readonly marker: string;
  readonly linkedList: string;
  readonly dictionary: string;
  readonly input: string;
  readonly error: string;
  readonly start: string;
  readonly end: string;
}

export class Boundary implements IBoundary {
  public readonly linkedList: string;
  public readonly dictionary: string;
  public readonly input: string;
  public readonly error: string;
  public readonly start: string;
  public readonly end: string;

  public static async create(): Promise<Boundary> {
    const buf = await promisify(randomBytes)(16);
    return new Boundary(buf.toString("hex"));
  }

  private constructor(public readonly marker: string) {
    this.linkedList = `${this.marker}_linkedList`;
    this.dictionary = `${this.marker}_dictionary`;
    this.input = `${this.marker}_input`;
    this.error = `${this.marker}_error`;
    this.start = `${this.marker}_start`;
    this.end = `${this.marker}_end`;
  }

  public toString(): string {
    return this.marker;
  }
}
