import TimeUtils from './time-utils.js'
import Utils from './utils.js'
import Model from './model.js'
const { query } = Utils

const DOM = {
  day: query('#day'),
  hour: query('#hour'),
  minute: query('#minute'),
  second: query('#second'),
  millisecond: query('#millisecond')
}

const State = {
  day: Infinity,
  hour: Infinity,
  minute: Infinity,
  second: Infinity,
  millisecond: Infinity
}

const renderKey = (key, value) => {
  const paddedValue = key === 'millisecond' ?
    `0000${value}`.slice(-3) :
    `00${value}`.slice(-2)
  DOM[key].innerHTML = `${paddedValue} <span class="key">${key}s</span>`
}

const init = () => {
  const endDate = Model.get('endDate')
  const keys = ['day', 'hour', 'minute', 'second', 'millisecond']
  const loop = setInterval(() => {
    const timeRemaining = TimeUtils.difference(Date.now(), endDate)
    if (timeRemaining.total.millisecond <= 0) {
      clearInterval(loop)
      keys.forEach(key => renderKey(key, 0))
      return
    }
    const { day, hour, minute, second, millisecond } = timeRemaining
    keys.forEach(key => {
      const value = timeRemaining[key]
      if (value !== State[key]) {
        State[key] = value
        renderKey(key, value)
      }
    })
  }, 1)
}

export default {
  init
}
