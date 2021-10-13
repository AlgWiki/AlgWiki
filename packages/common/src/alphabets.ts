export const UPPER = [
  ...String.fromCharCode(...[...Array(26).keys()].map((i) => 65 + i)),
];
export const LOWER = UPPER.map((ch) => ch.toLowerCase());
export const ALPHA = [...UPPER, ...LOWER];
export const DIGITS = [Array(10).keys()].map((n) => String(n));
export const ALPHANUM = [...ALPHA, ...DIGITS];
export const ASCII = [
  ...String.fromCharCode(...[...Array(127 - 32).keys()].map((i) => 32 + i)),
];
