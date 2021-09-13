import { ChallengeFunction, TestCase, TestCaseType } from "../types";

export interface RunnerContext<
  Input extends TestCaseType[],
  Output extends TestCaseType
> {
  challengeFunction: ChallengeFunction<Input, Output>;
  testCases: TestCase<Input, Output>[];
  code: string;
}
