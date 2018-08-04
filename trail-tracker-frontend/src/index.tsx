import * as React from "react"
import * as ReactDOM from "react-dom"
import { App } from "./app/view/App"
import registerServiceWorker from "./registerServiceWorker"
/* Import all stylesheets. */
import "bootswatch/paper/bootstrap.min.css"
import "./styles/index.css"

function setup() {
    document.body.style.overflowX = "hidden"
}

function render() {
    ReactDOM.render(<App/>, document.getElementById("root") as HTMLElement)
}

setup()
render()

/* Enable hot-reloading. */
if (module.hot) {
    module.hot.accept("./app/view/App", () => {
        render()
    })
}

registerServiceWorker()
