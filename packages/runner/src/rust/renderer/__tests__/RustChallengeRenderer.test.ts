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

  const boundary: IBoundary = {
    marker: "B_",
    start: "B_START",
    end: "B_END",
    error: "B_ERROR",
  };

  it("can render default input", () => {
    const defaultCode = new RustChallengeRenderer().createDefaultCode(
      challenge
    );
    expect(defaultCode).toMatchSnapshot();
  });

  it("can render challenge", () => {
    const userCode = "Hello, User!";

    const runnerCode = new RustChallengeRenderer().createRunner(
      challenge,
      boundary,
      userCode
    );
    expect(runnerCode).toMatchSnapshot();
  });

  it("can serialise a linked list", () => {
    const runnerCode = new RustChallengeRenderer().createRunner(
      new Challenge(
        "aLinkedList",
        [Type.linkedList(Primitive.Integer, [1, 2, 3])],
        Type.linkedList(Primitive.Integer)
      ),
      boundary,
      "USER_CODE_HERE"
    );
    expect(runnerCode).toMatchSnapshot();
  });

  it("can serialise a dictionary", () => {
    const runnerCode = new RustChallengeRenderer().createRunner(
      new Challenge(
        "aDictionary",
        [
          Type.dictionary(
            { key: Primitive.Integer, value: Primitive.Integer },
            new Map([
              [1, 1],
              [2, 2],
              [3, 3],
            ])
          ),
        ],
        Type.dictionary({ key: Primitive.Integer, value: Primitive.Integer })
      ),
      boundary,
      "USER_CODE_HERE"
    );
    expect(runnerCode).toMatchSnapshot();
  });
});
