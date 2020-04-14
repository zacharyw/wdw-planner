import { format, addDays } from 'date-fns';

function getDateForDay(day, checkIn) {
  return format(addDays(checkIn, day - 1), 'MM/dd/yy');
}

function getDayOfWeek(day, checkIn) {
  return format(addDays(checkIn, day - 1), 'eee');
}

function getFullDayString(day, checkIn) {
  return getDateForDay(day, checkIn) + ' (' + getDayOfWeek(day, checkIn) + ')';
}

export default getFullDayString;
