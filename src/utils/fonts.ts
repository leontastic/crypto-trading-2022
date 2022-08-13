import WebFont from 'webfontloader'

export default new Promise<void>((resolve) => {
  WebFont.load({
    google: {
      families: ['Inconsolata'],
    },
    active() {
      resolve()
    },
    inactive() {
      resolve()
    },
  })
})
