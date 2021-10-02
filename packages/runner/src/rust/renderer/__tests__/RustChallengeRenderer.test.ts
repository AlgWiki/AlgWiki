import { IBoundary } from "../../../Boundary";
import { Challenge } from "../../../Challenge";
import { Primitive, Type } from "../../../Type";
import { RustChallengeRenderer } from "../RustChallengeRenderer";

// TODO: tests for throwIfNeedsValue

describe("RustChallengeRenderer", () => {
  const challenge = new Challenge(
    "parseStr",
    [1, 2, 3].map((x) => Type.single(Primitive.String, x.toString())),
    Type.single(Primitive.Integer)
  );

  it("can render default input", () => {
    const defaultCode = new RustChallengeRenderer().createDefaultCode(
      challenge
    );
    expect(defaultCode).toMatchSnapshot();
  });

  it("can render challenge", () => {
    const userCode = "Hello, User!";
    const boundary: IBoundary = {
      marker: "B_",
      start: "B_START",
      end: "B_END",
      error: "B_ERROR",
    };
    const runnerCode = new RustChallengeRenderer().createRunner(
      challenge,
      boundary,
      userCode
    );
    expect(runnerCode).toMatchSnapshot();
  });
});
