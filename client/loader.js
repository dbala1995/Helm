const path = require('path')
const loader = require('style-loader')

module.exports = function () {
}

module.exports.pitch = function (request) {
  const result = loader.pitch.call(this, request)
  const index = result.indexOf('options.insert =')
  if (index <= -1) return result
  const insertIndex = index - 1

  // eslint-disable-next-line prefer-destructuring
  const resourcePath = this.resourcePath
  let filepath = [""]
  if (process.platform.includes("win")) {
    filepath = resourcePath.split("\\")
  }
  else if (process.platform.includes("linux")) {
    filepath = resourcePath.split("/")
  }



  const filename = filepath[filepath.length - 1].replace(".css", "")

  const insertAttr = `
if (typeof options.attributes !== 'object') {
  options.attributes = {}
}
options.attributes["data-id"] = '${filename}' // do anything you want
  `

  return result.slice(0, insertIndex) + insertAttr + result.slice(insertIndex)
}