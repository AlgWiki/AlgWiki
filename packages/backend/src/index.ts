// IMPORTANT: This file will be imported and bundled on the frontend.
//            Do not import any backend code, only import types into this file.

import { webApi } from './api/web';

export * from './routes/clients';

export type WebApi = typeof webApi;
