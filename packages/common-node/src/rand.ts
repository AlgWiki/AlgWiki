import crypto from "crypto";

import { LOWER } from "@alg-wiki/common";

export const randStr = (len: number, alphabet = LOWER): string =>
  [...crypto.randomBytes(len)]
    .map((b) => alphabet[Math.floor((b / 0x100) * alphabet.length)])
    .join("");
