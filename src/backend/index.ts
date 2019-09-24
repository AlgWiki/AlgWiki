import { webApi } from './api/web';
import { PlatformKey } from './routes/api';

export * from './routes/clients';

export const platformKeyWeb: PlatformKey<typeof webApi> = 'web';
