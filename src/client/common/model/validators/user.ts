export const isValidUsername = (value: string): boolean => value.length >= 3 && value.length <= 30;

export const isValidPasswordHash = (value: string): boolean =>
  value.length > 0 && value.length < 200;

export const isValidEmail = (value: string): boolean =>
  /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/.test(value);

export const isValidDisplayName = (value: string): boolean =>
  value.length >= 3 && value.length <= 30;
