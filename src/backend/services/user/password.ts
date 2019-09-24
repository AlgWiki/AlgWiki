import _sodium from 'libsodium-wrappers';

const getSodium = async () => {
  await _sodium.ready;
  return _sodium;
};

export const hashPassword = async (password: string, salt: Uint8Array) => {
  const sodium = await getSodium();
  const hash = sodium.crypto_pwhash(
    password.length,
    password,
    salt,
    sodium.crypto_pwhash_OPSLIMIT_SENSITIVE,
    sodium.crypto_pwhash_MEMLIMIT_SENSITIVE,
    sodium.crypto_pwhash_ALG_DEFAULT,
  );
  return hash;
};
