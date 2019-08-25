import zxcvbn from 'zxcvbn';
import { PASSWORD_MIN_SCORE } from '../../config/model/common';

/**
 * Make sure to use this when saving passwords, but NOT when checking if something is a password
 * (after an update of zxcvbn, some previously strong passwords may become weak).
 */
export const validatePasswordStrength = (password: string, email: string, displayName: string) =>
  zxcvbn(password, [email, displayName]).score >= PASSWORD_MIN_SCORE;
