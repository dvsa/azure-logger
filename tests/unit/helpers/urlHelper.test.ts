import { getObfuscatedPath, getObfuscatedUrl } from '../../../src/helpers/urlHelper';

describe('url helper', () => {
  describe('getObfuscatedUrl', () => {
    test('parse url and remove api keys', () => {
      const url = getObfuscatedUrl('http://localhost:7002/api/?address=london&key=keyhere&region=uk');

      expect(url).toStrictEqual('http://localhost:7002/api/?address=london&key=*********here&region=uk');
    });

    test('parse url and remove api keys - 2', () => {
      const url = getObfuscatedUrl('http://localhost:7002/api/?address=london&key=123&region=uk');

      expect(url).toStrictEqual('http://localhost:7002/api/?address=london&key=*************&region=uk');
    });

    test('parse url without params', () => {
      const url = getObfuscatedUrl('http://localhost:7002/api/');

      expect(url).toStrictEqual('http://localhost:7002/api/');
    });

    test('parse empty string', () => {
      const url = getObfuscatedUrl('');

      expect(url).toStrictEqual('');
    });

    test('parse undefined value', () => {
      const url = getObfuscatedUrl(undefined);

      expect(url).toStrictEqual(undefined);
    });
  });

  describe('getObfuscatedPath', () => {
    test('parse path and remove api keys', () => {
      const url = getObfuscatedPath('http://localhost:7002/api/?address=london&key=keyhere&region=uk');

      expect(url).toStrictEqual('/api/?address=london&key=*********here&region=uk');
    });

    test('parse path and remove api keys - 2', () => {
      const url = getObfuscatedPath('http://localhost:7002/api/?address=london&key=123&region=uk');

      expect(url).toStrictEqual('/api/?address=london&key=*************&region=uk');
    });

    test('parse path without params', () => {
      const url = getObfuscatedPath('http://localhost:7002/api/');

      expect(url).toStrictEqual('/api/');
    });

    test('parse empty string', () => {
      const url = getObfuscatedPath('');

      expect(url).toStrictEqual('');
    });

    test('parse undefined value', () => {
      const url = getObfuscatedPath(undefined);

      expect(url).toStrictEqual(undefined);
    });
  });
});
