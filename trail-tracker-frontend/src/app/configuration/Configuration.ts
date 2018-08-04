import { Ut } from "../../utilities/Ut"

/**
 * Constants used to configure application behavior.
 */
export namespace Configuration {

    /**
     *
     */
    export const appName = "Trail Tracker"

    /**
     * Options for user to select from for distance.
     */
    export const distanceOptions = [5, 10, 25, 50, 100]

    /**
     * Options for user to select from for rating.
     */
    export const ratingOptions = [0, 1, 2, 3, 4]

    /**
     * Options for user to select from for minimum trail length.
     */
    export const minLengthOptions = [0, 1, ...Ut.range(2, 22, 2)]

    /**
     * Options for user to select from for maximum trail length.
     */
    export const maxLengthOptions = [1, ...Ut.range(2, 22, 2), Infinity]
}