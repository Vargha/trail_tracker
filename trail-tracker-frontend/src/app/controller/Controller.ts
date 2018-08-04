import { useStrict } from "mobx"
import { SearchContext } from "./contexts/SearchContext"
import { ResultsContext } from "./contexts/ResultsContext"
import { HikeContext } from "./contexts/HikeContext"
import { ConnectionContext } from "./contexts/ConnectionContext"

/**
 * Used to control the application, the controller is divided into contexts. Each context contains its own actions and
 * state.
 */
export class Controller {
    readonly connection: ConnectionContext = new ConnectionContext()
    readonly results: ResultsContext = new ResultsContext()
    readonly hike: HikeContext = new HikeContext()
    readonly search: SearchContext = new SearchContext(this.connection, this.results, this.hike)

    constructor() {
        /* Use Mobx's strict mode. */
        useStrict(true)
    }
}

const instance = new Controller()

/**
 * Returns the controller singleton, allows global access.
 */
export function app() {
    return instance
}
