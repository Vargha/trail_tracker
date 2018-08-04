import { action, computed, observable, runInAction } from "mobx"
import { getUserZip } from "../../geolocation/Geolocation"
import { ConnectionContext } from "./ConnectionContext"
import { Hike } from "../../hikes/Hike"
import { ResultsContext } from "./ResultsContext"
import _ from "lodash"
import { HikeContext } from "./HikeContext"
import { Configuration } from "../../configuration/Configuration"

class Store {
    @observable name: string = ""
    @observable origin: string = ""
    @observable distance = _.last(Configuration.distanceOptions) || 0
    @observable rating = 0
    @observable maxLength = _.last(Configuration.maxLengthOptions) || 0
    @observable minLength = 0
    @observable autoFillingOrigin = false
}

/**
 * Context that manages search parameters and queries to the database.
 */
export class SearchContext {

    /**
     * Live backend URL.
     */
    private static readonly backendURL: string = "https://trailtrackerapi.herokuapp.com"
    /**
     * Local URL for testing.
     */
    private static readonly localBackendURL: string = "http://localhost:5000"
    private store = new Store()

    private connection: ConnectionContext
    private results: ResultsContext
    private hike: HikeContext

    constructor(connection: ConnectionContext, results: ResultsContext, hike: HikeContext) {
        this.connection = connection
        this.results = results
        this.hike = hike
    }

    /**
     * The name of the hike to search for.
     */
    @computed
    get name(): string {
        return this.store.name
    }

    set name(value: string) {
        this.store.name = value
    }

    /**
     * The area arount which to search. Can be either a zip code or city name.
     */
    @computed
    get origin(): string {
        return this.store.origin
    }

    set origin(value: string) {
        this.store.origin = value
    }

    /**
     * The radius in miles around the origin to search.
     */
    @computed
    get distance(): number | any {
        return this.store.distance
    }

    set distance(value: number | any) {
        this.store.distance = value
    }

    /**
     * The minimum rating hikes must have.
     */
    @computed
    get rating(): number | any {
        return this.store.rating
    }

    set rating(value: number | any) {
        this.store.rating = value
    }

    /**
     * The minimum length in miles the hikes must have.
     */
    @computed
    get minLength(): number {
        return this.store.minLength
    }

    set minLength(value: number) {
        this.store.minLength = value
    }

    /**
     * The maximum length in miles the hikes must have.
     */
    @computed
    get maxLength(): number {
        return this.store.maxLength
    }

    set maxLength(value: number) {
        this.store.maxLength = value
    }

    /**
     * Returns true if the origin parameter is being auto-filled.
     */
    get autoFillingOrigin(): boolean {
        return this.store.autoFillingOrigin
    }

    /**
     * Auto-fill the origin parameter using the browser's geolocation API.
     */
    @action
    autoFillOrigin() {
        if (this.connection.offline) {
            return
        }
        this.store.origin = ""
        this.store.autoFillingOrigin = true
        getUserZip((zip) => {
            if (zip !== null) {
                runInAction(() => {
                    this.store.origin = zip
                    this.store.autoFillingOrigin = false
                })
            } else {
                alert("Could not get location.")
            }
        })
    }

    /**
     * Queries the backend API for hikes matching the current parameters, updating the results once a response has been
     * received.
     */
    @action
    async search() {
        const queryString = this.createQueryString()

        try {
            /* Try to use the local URL first. If that fails, use the live API. This allows local testing of the API. */
            const urls = [
                SearchContext.localBackendURL + queryString,
                SearchContext.backendURL + queryString
            ]

            let response: Response | null = null
            for (const url of urls) {
                try {
                    response = await fetch(url)
                    console.log("Got response from backend at [" + url + "].")
                    break
                } catch {
                    console.log("Did not find backend at [" + url + "].")
                }
            }

            /* If neither can be reached something is wrong. */
            if (response === null) {
                alert("Could not communicate with backend API.")
                return
            }

            /* Get the JSON data from the response and convert the array into an array of Hikes. */
            const data = await response.json() as object[]
            const hikes = data.map(tuple => new Hike(tuple))

            /* Update the results. */
            this.results.update(hikes)

            /* Select the first hike. */
            if (hikes.length !== 0) {
                this.hike.select(hikes[0])
            }
        } catch (error) {
            alert(error)
        }
    }

    /**
     * Builds a query string from the current parameters to be sent to the backend API.
     */
    private createQueryString(): string {
        const parameters = {}
        if (this.name.length !== 0) {
            parameters["name"] = this.name
        }
        if (this.origin.length !== 0) {
            parameters["origin"] = this.origin
            parameters["distance"] = this.distance
        }
        if (this.rating > 0) {
            parameters["rating"] = this.rating
        }
        if (this.minLength > 0) {
            parameters["min_length"] = this.minLength
        }
        if (isFinite(this.maxLength)) {
            parameters["max_length"] = this.maxLength
        }
        const query: string[] = []
        for (const [parameter, value] of _.entries(parameters)) {
            query.push(parameter + "=" + value)
        }
        return "/?" + query.join("&")
    }
}