import "whatwg-fetch"
import "core-js/stable"
import "systemjs/dist/system.js"
import "regenerator-runtime/runtime"
import "@webcomponents/webcomponentsjs/webcomponents-bundle.js"
import "construct-style-sheets-polyfill"
import "proxy-polyfill/proxy.min.js"

if (Element.prototype.getAttributeNames == undefined) {
  Element.prototype.getAttributeNames = function () {
    const attributes = this.attributes
    const length = attributes.length
    const result = new Array(length)
    for (let i = 0; i < length; i++) {
      result[i] = attributes[i].name
    }
    return result
  }
}

if (window.NodeList && !window.NodeList.prototype.forEach) {
  window.NodeList.prototype.forEach = Array.prototype.forEach
}

const script = document.createElement("script")
script.src = "./importmapie.json"
script.type = "systemjs-importmap"
document.head.appendChild(script)

window.System.import("synrb-canvas-library")
window.System.import("app")
