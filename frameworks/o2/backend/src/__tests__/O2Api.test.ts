import { TypeEqual } from "ts-expect";

import { ApiRequiredContext, O2Api, O2ApiAny, O2Middleware } from "../O2Api";
import { O2Endpoint, O2EndpointInput } from "../O2Endpoint";

type Normalize<T> = { [K in keyof T]: T[K] };

const assertRequiredContext =
  <A extends O2ApiAny>(_api: A) =>
  <Expected>(
    _isExpected: TypeEqual<Expected, Normalize<ApiRequiredContext<A>>>
  ): ApiRequiredContext<A> =>
    ({} as ApiRequiredContext<A>);

test("required context types", () => {
  assertRequiredContext(
    new O2Api({
      routes: {},
    })
  )<{}>(true);

  assertRequiredContext(
    new O2Api({
      middleware: [],
      routes: {},
    })
  )<{}>(true);

  assertRequiredContext(
    new O2Api({
      middleware: [{} as O2Middleware<{}>],
      routes: {},
    })
  )<{}>(true);

  assertRequiredContext(
    new O2Api({
      middleware: [{} as O2Middleware<{ x: number }>],
      routes: {},
    })
  )<{ x: number }>(true);

  assertRequiredContext(
    new O2Api({
      middleware: [
        {} as O2Middleware<{ x: number }>,
        {} as O2Middleware<{ x: number }>,
      ],
      routes: {},
    })
  )<{ x: number }>(true);

  assertRequiredContext(
    new O2Api({
      middleware: [
        {} as O2Middleware<{ x: number }>,
        {} as O2Middleware<{ y: string }>,
      ],
      routes: {},
    })
  )<{ x: number; y: string }>(true);

  assertRequiredContext(
    new O2Api({
      middleware: [{} as O2Middleware<{}, { y: string }>],
      routes: {},
    })
  )<{}>(true);

  assertRequiredContext(
    new O2Api({
      middleware: [
        {} as O2Middleware<{}, { y: string }>,
        {} as O2Middleware<{}, { y: string }>,
      ],
      routes: {},
    })
  )<{}>(true);

  assertRequiredContext(
    new O2Api({
      middleware: [
        {} as O2Middleware<{ x: number }, { y: string }>,
        {} as O2Middleware<{ y: string }>,
      ],
      routes: {},
    })
  )<{ x: number }>(true);

  assertRequiredContext(
    new O2Api({
      middleware: [
        {} as O2Middleware<{ x: number }, { y: string }>,
        {} as O2Middleware<{ y: { hmm: "..." } }>,
      ],
      routes: {},
    })
  )<{ x: number }>(true);

  assertRequiredContext(
    new O2Api({
      middleware: [
        {} as O2Middleware<{ x: { a: 1 } }>,
        {} as O2Middleware<{ x: { b: 2 } }>,
      ],
      routes: {},
    })
  )<{ x: { a: 1 } & { b: 2 } }>(true);

  assertRequiredContext(
    new O2Api({
      routes: { a: {} as O2Endpoint<{}, {}, {}> },
    })
  )<{ input: O2EndpointInput }>(true);

  assertRequiredContext(
    new O2Api({
      routes: { a: {} as O2Endpoint<{}, {}, { x: number }> },
    })
  )<{ input: O2EndpointInput; x: number }>(true);

  assertRequiredContext(
    new O2Api({
      routes: {
        a: {} as O2Endpoint<{}, {}, { x: number }>,
        b: {} as O2Endpoint<{}, {}, { y: string }>,
      },
    })
  )<{ input: O2EndpointInput; x: number; y: string }>(true);

  assertRequiredContext(
    new O2Api({
      middleware: [{} as O2Middleware<{ x: number }>],
      routes: {
        a: {} as O2Endpoint<{}, {}, { x: number }>,
      },
    })
  )<{ input: O2EndpointInput; x: number }>(true);

  assertRequiredContext(
    new O2Api({
      middleware: [{} as O2Middleware<{}, { x: number }>],
      routes: {
        a: {} as O2Endpoint<{}, {}, { x: number }>,
      },
    })
  )<{ input: O2EndpointInput }>(true);

  assertRequiredContext(
    new O2Api({
      middleware: [{} as O2Middleware<{}, { input: number }>],
      routes: {
        a: {} as O2Endpoint<{}, {}, { x: number }>,
      },
    })
  )<{ x: number }>(true);

  assertRequiredContext(
    new O2Api({
      routes: {
        a: new O2Api({
          routes: { b: {} as O2Endpoint<{}, {}, {}> },
        }),
      },
    })
  )<{ input: O2EndpointInput }>(true);

  assertRequiredContext(
    new O2Api({
      middleware: [{} as O2Middleware<{}, { input: number }>],
      routes: {
        a: new O2Api({
          routes: { b: {} as O2Endpoint<{}, {}, { x: number }> },
        }),
      },
    })
  )<{ x: number }>(true);

  assertRequiredContext(
    new O2Api({
      middleware: [
        {} as O2Middleware<{}, { input: number }>,
        {} as O2Middleware<{}, { x: number }>,
      ],
      routes: {
        a: new O2Api({
          routes: { b: {} as O2Endpoint<{}, {}, { x: number }> },
        }),
      },
    })
  )<{}>(true);

  assertRequiredContext(
    new O2Api({
      middleware: [{} as O2Middleware<{}, { y: string }>],
      routes: {
        a: new O2Api({
          middleware: [{} as O2Middleware<{ y: string }>],
          routes: { b: {} as O2Endpoint<{}, {}, {}> },
        }),
      },
    })
  )<{ input: O2EndpointInput }>(true);

  assertRequiredContext(
    new O2Api({
      routes: {
        a: new O2Api({
          middleware: [{} as O2Middleware<{ y: string }>],
          routes: { b: {} as O2Endpoint<{}, {}, {}> },
        }),
      },
    })
  )<{ input: O2EndpointInput; y: string }>(true);

  assertRequiredContext(
    new O2Api({
      routes: {
        a: new O2Api({
          routes: { e: {} as O2Endpoint<{}, {}, { x: number }> },
        }),
        b: new O2Api({
          routes: { e: {} as O2Endpoint<{}, {}, { y: string }> },
        }),
      },
    })
  )<{ input: O2EndpointInput; x: number; y: string }>(true);
});
