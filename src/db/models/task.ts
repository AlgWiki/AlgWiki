import { Schema, model, Document } from 'mongoose';
import { isValidValueShape, isValidValue } from '../../client/common/model/validators/task';
import { Value, Task } from '../../client/common/model';

const { Types } = Schema;

export const parameter = new Schema({
  name: { type: Types.String, required: true },
  description: { type: Types.Mixed },
  type: {
    type: Types.Mixed,
    required: true,
    validate: isValidValueShape,
  },
});

export const method = new Schema({
  id: { type: Types.String, required: true },
  name: { type: Types.String, required: true },
  description: { type: Types.Mixed },
  parameters: { type: [parameter], required: true },
});

export const testCaseCall = new Schema({
  id: { type: Types.String, required: true },
  methodId: { type: Types.String, required: true },
  input: {
    type: [Types.Mixed],
    required: true,
    validate: (inputs: Value[]) => inputs.every(isValidValue),
  },
  expectedOutput: { type: Types.Mixed, validate: isValidValue },
});

export const testCase = new Schema({
  id: { type: Types.String, required: true },
  name: { type: Types.String },
  isHidden: { type: Types.Boolean, required: true },
  isActive: { type: Types.Boolean, required: true },
  calls: { type: [testCaseCall], required: true },
});

export const task = new Schema({
  name: { type: Types.String, required: true },
  description: { type: Types.Mixed, required: true },
  methods: { type: [method], required: true },
  testCases: { type: [testCase], required: true },
});

export interface TaskModel extends Task, Document {}
export default model<TaskModel>('Task', task);
