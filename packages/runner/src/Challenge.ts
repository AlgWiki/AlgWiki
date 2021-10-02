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
    userCode: string
  ): Promise<string> {
    const boundary = await Boundary.create();
    return renderer.createRunner(this, boundary, userCode);
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
