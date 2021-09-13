export const countChars = (code: string): number =>
  [...code.replace(/\s/g, "")].length;

export const randAlpha = (len: number): string =>
  [...Array(len).keys()]
    .map(() => String.fromCharCode(97 + Math.floor(Math.random() * 26)))
    .join("");
