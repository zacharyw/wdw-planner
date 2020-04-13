import { setDate } from 'date-fns';

function sortByTime(a, b) {
  const aTime = setDate(a.time, 1);
  const bTime = setDate(b.time, 1);

  if (aTime == null && bTime != null) {
    return 1;
  }

  if (bTime == null && aTime != null) {
    return -1;
  }

  if (bTime == null && aTime == null) {
    return 0;
  }

  if (aTime < bTime) {
    return -1;
  }

  if (aTime > bTime) {
    return 1;
  }

  return 0;
}

export default sortByTime;
