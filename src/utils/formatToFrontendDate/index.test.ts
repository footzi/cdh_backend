import { formatToFrontendDate } from './index';

describe('formatToFrontendDate', () => {
  it('Возвращает правильную дату в формате для фронта', () => {
    expect(formatToFrontendDate('2021-07-01')).toBe('01.07.2021');
  });
});
