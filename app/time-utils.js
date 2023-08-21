const { floor } = Math

const difference = (time1, time2) => {
  const millisecond = time2 - time1
  const second = millisecond / 1000
  const minute = second / 60
  const hour = minute / 60
  const day = hour / 24
  const year = day / 365

  const view = {
    millisecond: floor(millisecond % 1000),
    second: floor(second % 60),
    minute: floor(minute % 60),
    hour: floor(hour % 24),
    day: floor(day % 365),
    year: floor(year)
  }

  return {
    ...view,
    total: {
      millisecond,
      second,
      minute,
      hour,
      day
    },
  }
}

export default {
  difference
}
