import Utils from './utils.js'
import Model from './model.js'
const { query } = Utils

const selectorTemplate = ({ id, active, thumbnail }) => {
  const checked = active ? 'checked' : ''
  return `
    <input ${checked} type="radio" id="${id}-selector" name="image" value="${id}" />
    <label for="${id}-selector">
      <img alt="${id}" id="${id}-thumb" class="selector-thumb" src="${thumbnail}">
    </label>
  `
}

const changeVisual = (visualId) => {
  Model.setActiveVisual({ visualId })
  Model.save('activeVisual', visualId)
}

const init = () => {
  query('.selector').innerHTML = Model.get('visuals').map(visual => selectorTemplate({
    id: visual.id,
    active: visual.id === Model.get('activeVisual'),
    thumbnail: visual.path()
  })).join('')

  Model.get('visuals').forEach(visual => {
    query(`#${visual.id}-selector`).addEventListener('change', () => {
      changeVisual(visual.id)
    })
  })

  Model.listen('change:frameNumber', ({ visualId }) => {
    query(`#${visualId}-thumb`).src = Model.getVisual(visualId).path()
  })

  Model.listen('change:activeVisual', ({ visualId }) => {
    query(`#${visualId}-selector`).checked = true
  })
}

export default {
  init
}
