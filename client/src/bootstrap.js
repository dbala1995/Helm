import "systemjs/dist/system.js"
import "regenerator-runtime/runtime"
import "@webcomponents/webcomponentsjs/webcomponents-bundle.js"
import "construct-style-sheets-polyfill"

const script = document.createElement("script")
script.src = "./importmap.json"
script.type = "systemjs-importmap"
document.head.append(script)

window.System.import("react")
window.System.import("synrb-canvas-library")
window.System.import("app")
