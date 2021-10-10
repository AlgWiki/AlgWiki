import { Boundary } from "./Boundary";
import { Type, Variant } from "./Type";

export class Challenge<Input extends Variant, Output extends Variant> {
  public constructor(
    public readonly name: string,
    public readonly inputs: Type<Input>[],
    public readonly output: Type<Output>
  ) {}

  public createDefaultCode(renderer: ChallengeRenderer<Input, Output>): string {
    return renderer.createDefaultCode(this);
  }

  public async createRunner(
    renderer: ChallengeRenderer<Input, Output>,
    boundary: Boundary,
    userCode: string
  ): Promise<string> {
    return renderer.createRunner(this, boundary, userCode);
  }

  public inputJsonString(): string {
    return JSON.stringify(
      this.inputs.map((inp) => {
        if (!inp.inner.value) {
          throw new Error(
            "tried to serialise Type to JSON, but had no inner value!"
          );
        }

        if (inp.isDictionary()) {
          const inner = inp.inner.value as Map<unknown, unknown>;
          return [...inner.entries()].map(([k, v]) => [k, v]);
        }

        return inp.inner.value;
      })
    );
  }
}

export interface ChallengeRenderer<
  Input extends Variant,
  Output extends Variant
> {
  // The base template for the user code
  createDefaultCode(challenge: Challenge<Input, Output>): string;
  // The outputted template for the runner
  createRunner(
    challenge: Challenge<Input, Output>,
    boundary: Boundary,
    userCode: string
  ): string;
}
