export const countChars = (code: string): number =>
  [...code.replace(/\s/g, "")].length;
