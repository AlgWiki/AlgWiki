export const resolvers = {
  Query: {
    async user(_, { id }) {
      return fakeDb.users[id];
    },
    async users() {
      return Object.values(fakeDb.users);
    },
  },
  Mutation: {
    async userSignup(_, { user }) {
      const id = (Math.random() * 1e9) | 0;
      const newUser = {
        id,
        displayName: user.displayName,
        email: user.email,
        passwordHash: user.password + '-hash',
      };
      fakeDb.users[id] = newUser;
      return newUser;
    },
  },
};

const fakeDb = {
  users: {
    123: {
      id: 123,
      email: 'terry@test.com',
      displayName: 'T-Dog',
      passwordHash: 'deadbeef',
    },
    543: {
      id: 543,
      email: 'sally@t2.org',
      displayName: 'Salinity',
      passwordHash: 'aaaaaa',
    },
  },
};
