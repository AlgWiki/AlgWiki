import { Schema, model, Document } from 'mongoose';
import {
  isValidPasswordHash,
  isValidUsername,
  isValidEmail,
  isValidDisplayName,
} from '../../client/common/model/validators/user';
import { User } from '../../client/common/model';

const { Types } = Schema;

export const user = new Schema({
  username: { type: Types.String, required: true, validate: isValidUsername },
  passwordHash: { type: Types.String, required: true, validate: isValidPasswordHash },
  email: { type: Types.String, required: true, validate: isValidEmail },
  displayName: { type: Types.String, required: false, validate: isValidDisplayName },
});

export interface UserModel extends User, Document {}
export default model<UserModel>('User', user);
