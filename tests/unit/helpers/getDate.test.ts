import MockDate from 'mockdate';
import { getDateFilename } from '../../../src/helpers/getDate';

describe('getDate', () => {
  beforeEach(() => {
    MockDate.set('2022-03-28T09:14:19.304Z');
  });

  test('getDateFilename', () => {
    const result = getDateFilename();

    expect(result).toBe('2022-03-28');
  });
});
