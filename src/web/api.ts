import { createApiClient, platformKeyWeb } from '../backend';

export const api = createApiClient(
  platformKeyWeb,
  {},
  () => {},
  async (url, data) => {
    const req = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return await req.json();
  },
);
