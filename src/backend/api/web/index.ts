import { Api } from '../../routes/api';
import { userSignup } from './routes/user/signup';

export const webApi = new Api({
  routes: {
    userSignup,
  },
  pushRoutes: {},
});
