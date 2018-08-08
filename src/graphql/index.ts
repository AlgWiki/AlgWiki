import { gql, makeExecutableSchema, IResolvers } from 'apollo-server';
import GraphQLJSON from 'graphql-type-json';
import taskModel from '../db/models/task';
import { Task } from '../client/common/model';
import { ADDoc } from '../../node_modules/@atlaskit/editor-common';
import { model } from 'mongoose';

export const typeDefs = gql`
  scalar JSON

  type Parameter {
    name: String!
    description: JSON
    type: Int!
    constraints: String
  }

  type Method {
    id: ID!
    name: String!
    description: JSON
    parameters: [JSON!]!
  }

  type TestCaseCall {
    id: ID!
    methodId: String!
    input: [JSON!]!
    expectedOutput: JSON
  }

  type TestCase {
    id: ID!
    name: String
    isHidden: Boolean!
    isActive: Boolean!
    calls: [TestCaseCall!]!
  }

  type Task {
    _id: ID!
    name: String!
    description: JSON!
    methods: [Method!]!
    testCases: [TestCase!]!
  }

  type Query {
    tasks(start: Int = 0, limit: Int = 10): [Task!]!
    taskById(id: String!): Task
  }

  input MethodInput {
    id: ID!
    name: String
    description: JSON
    parameters: [JSON!]
  }

  input TestCaseCallInput {
    id: ID!
    methodId: String
    input: [JSON!]
    expectedOutput: JSON
  }

  input TestCaseInput {
    id: ID!
    name: String
    isHidden: Boolean
    isActive: Boolean
    calls: [TestCaseCallInput!]
  }

  input TaskInput {
    _id: ID!
    name: String
    description: JSON
    methods: [MethodInput!]
    testCases: [TestCaseInput!]
  }

  type Mutation {
    task(task: TaskInput!): Task!
    taskDescription(id: String!, name: String!, description: JSON!): Task
  }
`;

export const resolvers: IResolvers = {
  JSON: GraphQLJSON,
  Query: {
    async tasks(root, { start, limit }): Promise<Task[]> {
      return await taskModel
        .find()
        .skip(start)
        .limit(limit);
    },
    async taskById(root, { id }): Promise<Task | null> {
      return await taskModel.findById(id);
    },
  },
  Mutation: {
    async task(root, { task }): Promise<Task> {
      console.log({ task });
      const model = new taskModel(task);
      await model.save();
      return model.toObject();
    },
    async taskDescription(root, { id, name, description }): Promise<Task | null> {
      const model = await taskModel.findByIdAndUpdate(id, { name, description }, { new: true });
      // TODO: Only return object if a task was updated
      if (!model) return null;
      const task = model.toObject();
      return task;
    },
  },
};

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});
