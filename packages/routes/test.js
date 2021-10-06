const axios = require("axios");

void (async () => {
  const accessToken = "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";
  const { status, data } = await axios.post(
    "https://api.github.com/graphql",
    { query: `query {\n  viewer {\n    databaseId\n  }\n}` },
    { headers: { Authorization: `bearer ${accessToken}` } }
  );
  console.log(status, data);
})();
