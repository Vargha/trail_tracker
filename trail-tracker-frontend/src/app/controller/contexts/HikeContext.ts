import { action, computed, observable } from "mobx"
import { Hike } from "../../hikes/Hike"

class Store {
    @observable hike: Hike | null = null
    @observable shown: boolean = false
}

/**
 * Context that manages the hike the user has selected.
 */
export class HikeContext {

    private store = new Store()

    /**
     * Returns the selected hike or null if none is selected.
     */
    @computed
    get selected(): Hike | null {
        return this.store.hike
    }

    /**
     * Returns true if the details of the selected hike should be shown.
     */
    @computed
    get shown(): boolean {
        return this.store.shown
    }

    /**
     * Selects a hike.
     */
    @action
    select(value: Hike) {
        this.store.hike = value
    }

    /**
     * Shows details of a hike.
     */
    @action
    show(hike: Hike) {
        this.store.hike = hike
        this.store.shown = true
    }

    /**
     * Hides details of the selected hike.
     */
    @action
    hide() {
        this.store.shown = false
    }
}