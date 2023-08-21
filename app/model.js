import Storage from './storage.js'

const dates = {
  startDate: new Date('08/21/2023, 07:30'),
  endDate: new Date('09/30/2023, 15:05'),
}

const getVisualPath = (prefix, frameNumber) => {
  const paddedFrameNumber = `0000${frameNumber + 1}`.slice(-4)
  return `${prefix}${paddedFrameNumber}.jpg`
}

const visuals = [{
  id: 'sunrise',
  frames: 1981,
  currentFrame: 0,
  prefix: 'frames-sunrise/frame_',
  path(frameNumber) {
    return getVisualPath(this.prefix, frameNumber || this.currentFrame)
  }
}, {
  id: 'aurora',
  frames: 3654,
  currentFrame: 0,
  prefix: 'frames-aurora/frame_',
  path(frameNumber) {
    return getVisualPath(this.prefix, frameNumber || this.currentFrame)
  }
}]

const Model = ((visuals) => {
  const listeners = {}

  const listen = (eventType, fn) => {
    listeners[eventType] = listeners[eventType] || []
    listeners[eventType].push(fn)
  }

  const publish = (eventType, payload) => {
    const callbacks = listeners[eventType]
    if (callbacks && callbacks.length) {
      callbacks.forEach(cb => cb(payload))
    }
  }

  const save = (key) => {
    const value = typeof state[key] === 'string' ?
      state[key] :
      JSON.stringify(state[key])
    Storage.put(key, value)
  }

  const get = (key) => {
    return state[key]
  }

  const update = (key, value) => {
    publish(`change:${key}`, value)
    state[key] = value
  }

  const state = {
    ...dates,
    activeVisual: Storage.fetch('activeVisual') || visuals[0].id,
    visuals
  }

  return {
    listen,
    update,
    save,
    get,
    data: state,
    getVisual: (id) => state.visuals.find(v => v.id === id),
    setActiveVisual: (payload) => {
      state.activeVisual = payload.visualId
      publish('change:activeVisual', payload)
    },
    setFrameNumber: (visualId, frameNumber) => {
      state.visuals.find(v => v.id === visualId).currentFrame = frameNumber
      publish('change:frameNumber', {
        visualId: visualId,
        frameNumber
      })
    }
  }
})(visuals)

export default Model
