import * as t from 'io-ts';

interface Index<P extends t.Props> {
  pk: keyof P;
  sk?: keyof P;
}

type Gsis<P extends t.Props> =
  | []
  | [Index<P>]
  | [Index<P>, Index<P>]
  | [Index<P>, Index<P>, Index<P>]
  | [Index<P>, Index<P>, Index<P>, Index<P>]
  | [Index<P>, Index<P>, Index<P>, Index<P>, Index<P>];

type PropFromKey<P extends t.Props, K extends keyof P | undefined> = K extends keyof P
  ? t.TypeOfProps<P>[K]
  : never;

type IndexProp<
  P extends t.Props,
  G extends Index<P> | undefined,
  K extends keyof Index<P>
> = G extends Index<P> ? PropFromKey<P, G[K]> : never;

type IndexProps<P extends t.Props, I extends Index<P>, G extends Gsis<P>> = {
  pk: IndexProp<P, I, 'pk'>;
  sk: IndexProp<P, I, 'sk'>;
  gsi1pk: IndexProp<P, G[0], 'pk'>;
  gsi1sk: IndexProp<P, G[0], 'sk'>;
  gsi2pk: IndexProp<P, G[1], 'pk'>;
  gsi2sk: IndexProp<P, G[1], 'sk'>;
  gsi3pk: IndexProp<P, G[2], 'pk'>;
  gsi3sk: IndexProp<P, G[2], 'sk'>;
  gsi4pk: IndexProp<P, G[3], 'pk'>;
  gsi4sk: IndexProp<P, G[3], 'sk'>;
  gsi5pk: IndexProp<P, G[4], 'pk'>;
  gsi5sk: IndexProp<P, G[4], 'sk'>;
};

const createDbRecordType = <P extends t.Props, I extends Index<P>, G extends Gsis<P>>(
  name: string,
  props: P,
  index: I,
  gsis: G,
): t.Type<t.TypeOfProps<P>, t.TypeOfProps<P> & IndexProps<P, I, G>> => {
  const TypeServer = t.type(props);

  const indexProps: { [key: string]: t.Mixed } = {};
  for (const [i, gsi] of gsis.entries()) {
    for (const key of ['pk', 'sk'] as (keyof Index<P>)[]) {
      const propKey = gsi[key];
      if (propKey) {
        indexProps[`gsi${i + 1}${key}` as keyof typeof indexProps] = props[propKey];
      }
    }
  }

  const TypeDb = t.type({ ...props, ...(indexProps as IndexProps<P, I, G>) });

  return new t.Type<t.TypeOfProps<P>, t.TypeOfProps<P> & IndexProps<P, I, G>>(
    name,
    TypeServer.is,
    (i, ctx) => {
      const res = TypeDb.validate(i, ctx);
      if (res.isRight()) {
        res.value.pk = res.value[index.pk];
        if (index.sk) res.value.sk = res.value[index.sk];
      }
      return res;
    },
    a => {
      const dbRecord = TypeServer.encode(a) as (typeof TypeDb)['_O'];
      dbRecord.pk = props[index.pk];
      if (index.sk) dbRecord.sk = props[index.sk];
      return dbRecord;
    },
  );
};

export const User = createDbRecordType(
  'User',
  {
    id: t.number,
    displayName: t.string,
    email: t.string,
    /**
     * User's password after being SHA hashed before being sent to the server then Argon hashed
     * on the server before being put in the database.
     */
    passwordHash: t.string,
  },
  { pk: 'id' },
  [{ pk: 'displayName' }],
);

// const dbRecord = User.encode({
//   id: 1,
//   displayName: '',
//   email: '',
//   passwordHash: '',
// });
// dbRecord.s;
// const res = User.decode({});
// if (res.isRight()) {
//   res.value;
// }

export const Challenge = t.type(
  {
    id: t.number,
  },
  'Challenge',
);

export const DbRecord = t.union([User, Challenge], 'DbRecord');
