# Model

_Typescript types/validators, GraphQL resolvers/queries and database models._

A _model_ is the collection of TypeScript types, database schemas, GraphQL resolvers, validators, etc. assocated with a type of data. It defines the _shape_ of the data as well as providing helpers for using it.

Each directory under `src` (except `util`) is a model.

**TypeScript Types**

The `type.ts` file for a model contains TypeScript types and validators for the model. [io-ts](https://github.com/gcanti/io-ts) is used to define both the validation and TypeScript type. All types should be exported as both the TypeScript and io-ts types.

`util/type-builders.ts` contains io-ts type builder helper functions. **Use these instead of creating io-ts types directly in `type.ts`**, since these will catch all cases (eg. validating string char and UTF-8 length) which may otherwise be accidentally skipped.

If a helper doesn't exist yet, create it instead of building the type in the file consuming it.
