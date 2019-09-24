import _sodium from 'libsodium-wrappers';

const getSodium = async () => {
  await _sodium.ready;
  return _sodium;
};

export const hashPassword = async (password: string) => {
  const sodium = await getSodium();
  const hash = sodium.crypto_pwhash_str(
    password,
    sodium.crypto_pwhash_OPSLIMIT_SENSITIVE,
    sodium.crypto_pwhash_MEMLIMIT_SENSITIVE,
  );
  return hash;
};
