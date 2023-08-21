import TimeUtils from './time-utils.js'
import Utils from './utils.js'
import Model from './model.js'
const { query } = Utils

const render = (visual, { transition } = {}) => {
  query(`#${visual.id}-frame`).src = visual.path()
  if (visual.id === Model.get('activeVisual')) {
    if (transition) {
      query('#shadow').classList.toggle('disappearing')
      setTimeout(() => {
        query('#shadow').src = visual.path()
        query('#shadow').classList.toggle('disappearing')
      }, 250)
    } else {
      query('#shadow').src = visual.path()
    }
  }
}

const preload = (visual) => {
  query('#preloader').src = visual.path()
}

const renderVisual = (visual) => {
  const timeTotal = TimeUtils.difference(Model.get('startDate'), Model.get('endDate'))
  const frameRate = timeTotal.total.millisecond / visual.frames

  const timeElapsed = TimeUtils.difference(Model.get('startDate'), Date.now())
  const startFrame = Math.max(0, Math.floor(timeElapsed.total.millisecond / frameRate))
  let currentFrame = Math.min(startFrame, visual.frames - 1)

  const loop = setInterval(() => {
    const now = Date.now()
    console.log(visual.id, 'now', now, 'frame:', currentFrame)
    if (now >= Model.get('endDate') || currentFrame > visual.frames - 1) {
      clearInterval(loop)
      return
    }
    render(visual)
    Model.setFrameNumber(visual.id, currentFrame)
    if (now >= Model.get('startDate') && now <= Model.get('endDate')) {
      currentFrame++
      preload(visual)
    }
  }, frameRate)

  Model.setFrameNumber(visual.id, currentFrame)
  render(visual)
  console.log(visual.id, 'time total', timeTotal)
  console.log(visual.id, 'frame rate', frameRate)
}

const init = (params) => {
  const container = query('.frame-container')
  Model.listen('change:activeVisual', show)
  Model.get('visuals').forEach(visual => {
    const frame = document.createElement('img')
    frame.id = `${visual.id}-frame`
    frame.classList.add('visual-frame')
    frame.classList.toggle('active', visual.id === Model.get('activeVisual'))
    container.appendChild(frame)
    renderVisual(visual)
  })
  setTimeout(() => {
    Model.get('visuals').forEach(visual => {
      if (visual.id === Model.get('activeVisual')) {
        query(`#${visual.id}-frame`).scrollIntoView()
      }
    })
  }, 500)
  container.addEventListener('scroll', onScroll)
}

const onScroll = () => {
  const container = query('.frame-container')
  const buffer = 20
  Model.get('visuals').forEach(visual => {
    const frame = query(`#${visual.id}-frame`)
    if (Math.abs(frame.offsetLeft - container.scrollLeft) < buffer) {
      changeVisual({
        visualId: visual.id,
        preserveDefaultScroll: true
      })
    }
  })
}

const changeVisual = (payload) => {
  Model.setActiveVisual(payload)
  Model.save('activeVisual', payload.visualId)
}

const show = ({ visualId, preserveDefaultScroll }) => {
  query('#preloader').classList.add('hidden')
  Model.get('visuals').forEach(visual => {
    render(visual, {
      transition: true
    })
    const el = query(`#${visual.id}-frame`)
    el.classList.toggle('active', visual.id === visualId)
    if (visual.id === visualId && !preserveDefaultScroll) {
      el.scrollIntoView()
    }
  })
  setTimeout(() => {
    query('#preloader').classList.remove('hidden')
  }, 500)
}

export default {
  init,
  show
}
