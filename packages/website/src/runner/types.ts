import { ChallengeFunction, TestCase, TestCaseType } from "@alg-wiki/types";

export interface RunnerContext<
  Input extends TestCaseType[],
  Output extends TestCaseType
> {
  challengeFunction: ChallengeFunction<Input, Output>;
  testCases: TestCase<Input, Output>[];
  code: string;
}
