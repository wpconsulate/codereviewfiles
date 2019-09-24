import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

export default moment

export const now = moment();

export const year = now.year();

export const month = now.month() + 1;

export const date = now.date();

export const monthFormat = 'YYYY-MM';

export const dateFormat = 'YYYY-MM-DD';

export const minuteFormat = 'YYYY-MM-DD HH:mm'

export const secondFormat = 'YYYY-MM-DD HH:mm:ss';
