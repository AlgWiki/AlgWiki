import { gql, makeExecutableSchema } from 'apollo-server';
import GraphQLJSON from 'graphql-type-json';
import { mockTask } from '../../mocks/challenge';

export const typeDefs = gql`
  scalar JSON

  type Parameter {
    name: String!
    description: JSON
    type: Int!
    constraints: String
  }

  type Method {
    id: String!
    name: String!
    description: JSON
    parameters: [JSON!]!
  }

  type TestCaseCall {
    id: String!
    methodId: String!
    input: [JSON!]!
    expectedOutput: JSON
  }

  type TestCase {
    id: String!
    name: String
    isHidden: Boolean!
    isActive: Boolean!
    calls: [TestCaseCall!]!
  }

  type Task {
    name: String!
    description: JSON!
    methods: [Method!]!
    testCases: [TestCase!]!
  }

  type Query {
    tasks: [Task!]!
  }
`;

export const resolvers = {
  JSON: GraphQLJSON,
  Query: {
    tasks: () => [mockTask],
  },
};

export const graphqlSchema = makeExecutableSchema({
  typeDefs,
  resolvers,
});
