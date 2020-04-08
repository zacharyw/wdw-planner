function sortByTime(a, b) {
  if (a.time == null && b.time != null) {
    return 1;
  }

  if (b.time == null && a.time != null) {
    return -1;
  }

  if (b.time == null && a.time == null) {
    return 0;
  }

  if (a.time < b.time) {
    return -1;
  }

  if (a.time > b.time) {
    return 1;
  }

  return 0;
}

export default sortByTime;
