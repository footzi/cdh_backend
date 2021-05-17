import * as dayjs from 'dayjs';

/**
 * Форматирует дату с бэка в дату которая используется на фронте
 *  2021-07-01 в 01.07.2021
 */
export const formatToFrontendDate = (date: string): string => dayjs(date).format('DD.MM.YYYY');
