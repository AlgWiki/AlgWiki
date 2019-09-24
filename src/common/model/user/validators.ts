import zxcvbn from 'zxcvbn';
import { PASSWORD_MIN_SCORE } from '../../config/user';

/**
 * Make sure to use this when saving passwords, but NOT when checking if something is a password
 * (after an update of zxcvbn, some previously strong passwords may become weak).
 *
 * @returns Message describing why the password is not strong enough.
 */
export const validatePasswordStrength = (password: string, email: string, displayName: string) => {
  const emailName = email.split('@')[0];
  const strength = zxcvbn(password.substring(0, 100), [emailName, displayName]);
  if (strength.score < PASSWORD_MIN_SCORE) {
    if (strength.feedback && strength.feedback.warning) {
      return strength.feedback.warning;
    }
    return 'Weak password';
  }
  return undefined;
};
