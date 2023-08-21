import Model from './model.js'
import Utils from './utils.js'
const { query } = Utils

const blobSize = 128

const visualBlobSettings = {
  sunrise: {
    dx: -390,
    dy: -256,
    dWidth: 900,
    dHeight: 900
  },
  aurora: {
    dx: -64,
    dy: -64,
    dWidth: 256,
    dHeight: 256
  }
}

const createFavicon = (url) => {
  const favicon = document.createElement('link')
  favicon.rel = 'icon'
  favicon.type = 'image/blob'
  favicon.href = url
  favicon.id = 'blob-favicon'
  return favicon
}

const getBlobUrl = (imagePath, settings) => {
  return new Promise(resolve => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    canvas.width = blobSize
    canvas.height = blobSize
    const img = new Image()
    img.src = imagePath
    img.onload = () => {
      ctx.save()
      ctx.beginPath()
      ctx.arc(blobSize / 2, blobSize / 2, blobSize / 2, 0, Math.PI * 2, true)
      ctx.closePath()
      ctx.clip()
      ctx.drawImage(img, settings.dx, settings.dy, settings.dWidth, settings.dHeight)
      ctx.beginPath()
      ctx.arc(0, 0, blobSize, 0, Math.PI * 2, true)
      ctx.clip()
      ctx.closePath()
      ctx.restore()
      canvas.toBlob(blob => {
        resolve(URL.createObjectURL(blob))
      })
    }
  })
}

const renderFavicon = async (visual) => {
  const blobUrl = await getBlobUrl(visual.path(), visualBlobSettings[visual.id])
  if (query('#blob-favicon')) {
    query('#blob-favicon').href = blobUrl
    return
  }
  const favicon = createFavicon(blobUrl)
  document.head.appendChild(favicon)
}

const renderActiveVisual = () => {
  const activeVisual = Model.get('activeVisual')
  const visual = Model.getVisual(activeVisual)
  renderFavicon(visual)
}

const init = () => {
  renderActiveVisual()

  Model.listen('change:activeVisual', renderActiveVisual)

  Model.listen('change:frameNumber', ({ visualId }) => {
    const visual = Model.getVisual(visualId)
    if (Model.get('activeVisual') === visual.id) {
      renderFavicon(visual)
    }
  })
}

export default {
  init
}
