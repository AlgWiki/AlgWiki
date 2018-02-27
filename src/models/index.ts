export interface User {
  name: string;
  avatarURL: string;
}

export type TestCasePrimitive = string | number | boolean;
export type TestCaseValue = TestCasePrimitive | TestCasePrimitive[] | TestCasePrimitive[][];

export interface TestCaseInput {
  name: string;
  value: TestCaseValue;
}

export interface TestCase {
  input: TestCaseInput[];
  output: TestCaseValue;
}

export interface Task {
  description: string;
  testCases: TestCase[];
}

export interface Solution {
  user: User;
  code: string;
  submitDate?: number;
  explanation?: string;
}

export interface Comment {
  user: User;
  text: string;
  submitDate: number;
  editDate?: number;
  replies: Comment[];
}

export interface Challenge {
  task: Task;
  startDate: number;
  endDate: number;
  solutions: Solution[];
  comments: Comment[];
}
