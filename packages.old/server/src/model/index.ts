import { ADDoc } from '@atlaskit/editor-common';

export type UUID = string;

export interface User {
  name: string;
  avatarUrl: string;
}

export type TestCasePrimitive = string | number | boolean;
export type TestCaseValue = TestCasePrimitive | TestCasePrimitive[] | TestCasePrimitive[][];

export enum ValueType {
  Integer = 1,
  Float = 2,
  String = 3,
  List = 4,
  Tuple = 5,
  Map = 6,
}

export type Value =
  | {
      type: ValueType.Integer | ValueType.Float | ValueType.String;
      value: string;
    }
  | {
      type: ValueType.List | ValueType.Tuple;
      values: Value[];
    }
  | {
      type: ValueType.Map;
      pairs: { key: Value; value: Value }[];
    };

export type ValueShape =
  | {
      type: ValueType.Integer;
      constraints?: string[];
    }
  | {
      type: ValueType.Float;
      constraints?: string[];
    }
  | {
      type: ValueType.String;
      constraints?: string[];
    }
  | {
      type: ValueType.List;
      valueTypes: ValueShape[];
      constraints?: string[];
    }
  | {
      type: ValueType.Tuple;
      values: { name: string; type: ValueShape }[];
      constraints?: string[];
    }
  | {
      type: ValueType.Map;
      keyType: ValueShape;
      valueType: ValueShape;
      constraints?: string[];
    };

export type MethodId = UUID;
export interface Method {
  id: MethodId;
  name: string;
  description: ADDoc | null;
  parameters: {
    name: string;
    description: ADDoc | null;
    type: ValueShape;
  }[];
}

export type TestCaseCallId = UUID;
export interface TestCaseCall {
  id: TestCaseCallId;
  methodId: MethodId;
  input: Value[];
  expectedOutput: Value | null;
}

export type TestCaseId = UUID;
export interface TestCase {
  id: TestCaseId;
  name: string | null;
  isHidden: boolean;
  isActive: boolean;
  calls: TestCaseCall[];
}

export type TaskId = UUID;
export interface Task {
  id: TaskId;
  name: string;
  description: ADDoc;
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
