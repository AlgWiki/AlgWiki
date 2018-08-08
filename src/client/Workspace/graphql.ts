import gql from 'graphql-tag';

export const GET_TASK = gql`
  query GetTask($id: String!) {
    taskById(id: $id) {
      name
      description
      methods {
        id
        name
        description
        parameters
      }
      testCases {
        id
        name
        isHidden
        isActive
        calls {
          id
          methodId
          input
          expectedOutput
        }
      }
    }
  }
`;

export const PUT_DESCRIPTION = gql`
  mutation PutDescription($id: String!, $name: String!, $description: JSON!) {
    taskDescription(id: $id, name: $name, description: $description) {
      _id
      name
      description
    }
  }
`;
