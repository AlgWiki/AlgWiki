import { sessionJwtPublicKey } from "@alg-wiki/common";
import { addSubmission, createDbClient } from "@alg-wiki/db";
import type { APIGatewayProxyEvent } from "aws-lambda";

import { requireAuth } from "../util/auth";
import { ClientError, Route } from "../util/route";

export default new Route({
  key: "submit-solution",
  callback:
    () =>
    async (
      input: { lang: "javascript"; code: string },
      evt: APIGatewayProxyEvent
    ) => {
      const userId = await requireAuth(sessionJwtPublicKey, evt);
      if (input.lang !== "javascript")
        throw new ClientError("Unsupported language");
      const db = createDbClient();
      await addSubmission(db, {
        challengeId: "chl-xyz123",
        authorId: userId,
        timestamp: new Date(),
        lang: input.lang,
        code: input.code,
        score: input.code.length,
        executionTime: 123,
        memoryUsage: 456,
      });
      console.log("solution submitted", { code: input.code });
      return { result: "submitted" };
    },
});
