import { action, computed, observable } from "mobx"
import { Hike } from "../../hikes/Hike"

class Store {
    @observable hikes: Hike[] = []
    @observable pageIndex = 0
}

/**
 * Context that manages hikes shown as search results.
 */
export class ResultsContext {

    /**
     * The number of hikes displayed on a single page in the results view.
     */
    static readonly hikesPerPage: number = 5

    private store = new Store()

    /**
     * Returns the number of hikes in the results.
     */
    @computed
    get hikeCount(): number {
        return this.store.hikes.length
    }

    /**
     * Returns a shallow copied array of all hikes contained in the results.
     */
    @computed
    get hikes(): Hike[] {
        return this.store.hikes.slice()
    }

    /**
     * The page position in the results view.
     */
    @computed
    get pageIndex(): number {
        return this.store.pageIndex
    }

    /**
     * Clear all results.
     */
    @action
    clear() {
        this.update([])
    }

    set pageIndex(value: number) {
        this.store.pageIndex = Math.min(Math.max(value, 0), this.pageCount - 1)
    }

    /**
     * Returns the number of pages of results that are available to view.
     */
    @computed
    get pageCount(): number {
        return Math.max(Math.ceil(this.hikeCount / ResultsContext.hikesPerPage), 1)
    }

    /**
     * Updates the hikes contained in the results.
     */
    @action
    update(hikes: Hike[]) {
        this.store.hikes = hikes
        this.store.pageIndex = 0
    }
}
