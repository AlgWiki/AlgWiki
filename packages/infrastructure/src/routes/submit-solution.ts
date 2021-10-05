import { addSubmission, createDbClient } from "@alg-wiki/db";

import { ClientError, Route } from "../util/route";

export default new Route({
  key: "submit-solution",
  async callback(input: { lang: "javascript"; code: string }) {
    if (input.lang !== "javascript")
      throw new ClientError("Unsupported language");
    const db = createDbClient();
    await addSubmission(db, {
      challengeId: "chl-xyz123",
      authorId: "user-abc456",
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
