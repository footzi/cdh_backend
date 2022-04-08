import * as dayjs from 'dayjs';

/**
 * Возвращает количество дней между двумя датами
 *
 * @param startDate - дата начала
 * @param endDate - дата завершения
 */
export const getCountDays = (startDate: string, endDate: string): number => {
  return dayjs(endDate).diff(startDate, 'days');
};
