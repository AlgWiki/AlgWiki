import * as t from 'io-ts';
import { ThrowReporter } from 'io-ts/lib/ThrowReporter';

type DbRecord<P extends {}> = {
  pk: string;
} & P;

const createDbRecordType = <P extends t.Props, R extends DbRecord<t.TypeOfProps<P>>>(
  name: string,
  props: P,
  convertToDbRecord: (value: t.TypeOfProps<P>) => R,
  convertFromDbRecord: (record: R) => t.TypeOfProps<P>,
) => {
  const Type = t.type(props, name);
  return {
    type: Type,
    convertToDbRecord(value: t.TypeOfProps<P>) {
      const res = Type.decode(value);
      if (res.isLeft()) {
        ThrowReporter.report(res);
      }
      return convertToDbRecord(value);
    },
    convertFromDbRecord(record: R) {
      const value = convertFromDbRecord(record);
      const res = Type.decode(value);
      if (res.isLeft()) {
        ThrowReporter.report(res);
      }
      return value;
    },
  };
};

export const User = createDbRecordType(
  'User',
  {
    id: t.number,
    displayName: t.string,
    email: t.string,
    /**
     * User's password after being SHA hashed on the client but before being Argon hashed on the
     * server.
     */
    passwordHash: t.string,
  },
  value => ({
    ...value,
    pk: `${value.id}`,
  }),
  ({ id, displayName, email, passwordHash }) => ({
    id,
    displayName,
    email,
    passwordHash,
  }),
);

export const Challenge = t.type(
  {
    id: t.number,
  },
  'Challenge',
);
