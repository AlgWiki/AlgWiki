export interface User {
  id: string;
  name: string;
  avatarUrl: string;
}

export type TestCasePrimitive = string | number | boolean;
export type TestCaseValue = TestCasePrimitive | TestCasePrimitive[] | TestCasePrimitive[][];

export enum ValueType {
  Integer,
  Float,
  String,
  Array,
}

export type Value =
  | {
      type: Exclude<ValueType, ValueType.Array>;
      value: string;
    }
  | {
      type: ValueType.Array;
      value: Value[];
    };

export type MethodId = string;
export interface Method {
  id: MethodId;
  name: string;
  parameters: Parameter[];
}

export type TestCaseCallId = string;
export interface TestCaseCall {
  id: TestCaseCallId;
  methodId: MethodId;
  input: Value[];
  expectedOutput: Value | null;
}

export interface Parameter {
  name: string;
  type: ValueType;
  constraints: string | null;
}

export type TestCaseId = string;
export interface TestCase {
  id: TestCaseId;
  name: string | null;
  isHidden: boolean;
  isActive: boolean;
  calls: TestCaseCall[];
}

export type TaskId = string;
export interface Task {
  id: TaskId;
  description: string;
  methods: Method[];
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
