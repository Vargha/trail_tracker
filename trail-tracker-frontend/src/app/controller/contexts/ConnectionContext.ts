import { computed, observable, runInAction } from "mobx"
import { isUndefined } from "util"

class Store {
    @observable online = isUndefined(navigator) || navigator.onLine
}

/**
 * Context devoted to listening for online / offline events. Can be used to determine if the user is online or offline.
 */
export class ConnectionContext {

    private store = new Store()

    constructor() {
        this.startConnectionListeners()
    }

    /**
     * Returns true if the user is connected to the internet.
     */
    @computed
    get online(): boolean {
        return this.store.online
    }

    /**
     * Returns true if the user is not connected to the internet.
     */
    @computed
    get offline(): boolean {
        return !this.store.online
    }

    private startConnectionListeners() {
        addEventListener("offline", () => {
            runInAction(() => this.store.online = false)
        })
        addEventListener("online", () => {
            runInAction(() => this.store.online = true)
        })
    }
}