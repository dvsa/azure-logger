import { URL } from 'url';

const getObfuscatedPath = (url?: string): string | undefined => {
  try {
    const obfuscatedUrl = obfuscateUrl(url);
    return `${obfuscatedUrl.pathname}${obfuscatedUrl.search}`;
  } catch (error) {
    return url;
  }
};

const getObfuscatedUrl = (url?: string): string | undefined => {
  try {
    return obfuscateUrl(url).toString();
  } catch (error) {
    return url;
  }
};

const obfuscateUrl = (url?: string): URL => {
  const parsedUrl = new URL(url as string);

  if (parsedUrl.searchParams.has('key')) {
    const value = parsedUrl.searchParams.get('key');
    const valueSubstring = value && value?.trim().length > 4 ? value.substring(value.length - 4, value.length) : '****';
    const newValue = `*********${valueSubstring}`;
    parsedUrl.searchParams.set('key', newValue);
  }

  return parsedUrl;
};

export {
  getObfuscatedUrl,
  getObfuscatedPath,
};
