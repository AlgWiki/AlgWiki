export const isCodeMirrorRequired = (language: string): boolean => {
  const isMobile = false;
  const isLanguageSupportedByMonaco = language === "javascript";
  return isMobile || !isLanguageSupportedByMonaco;
};
