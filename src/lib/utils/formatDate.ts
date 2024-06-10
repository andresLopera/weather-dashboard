function FormatDate(currentDate: Date) {
  const daysOfWeek = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ]
  const monthsOfYear = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]

  const dayOfWeek = daysOfWeek[currentDate.getDay()]
  const month = monthsOfYear[currentDate.getMonth()]
  const day = currentDate.getDate()
  return `${dayOfWeek}, ${month} ${day}`
}

export default FormatDate
