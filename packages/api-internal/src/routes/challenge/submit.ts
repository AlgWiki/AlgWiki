import { UserId, addSubmission, createDbClient } from "@algwiki/db";
import { O2ClientError, O2Endpoint } from "@oxy2/backend";

export const submit = new O2Endpoint({
  async callback(
    input: { lang: "javascript"; code: string },
    req: { user: { id: UserId } }
  ) {
    if (input.lang !== "javascript")
      throw new O2ClientError("Unsupported language");
    const db = createDbClient();
    await addSubmission(db, {
      challengeId: "chl-xyz123",
      authorId: req.user.id,
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
