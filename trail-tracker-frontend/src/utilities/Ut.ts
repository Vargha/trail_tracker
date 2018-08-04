import * as LoDash from "lodash"
import { LoDashStatic } from "lodash"

/**
 * General utlity functions including all of LoDash.
 */
interface Utilities extends LoDashStatic {
    /**
     * Runs a no-argument function immediately, returning the result.
     */
    run<T>(fn: () => T): T
}

const object = {
    run: function <T>(fn: () => T): T {
        return fn()
    }
}

Object.setPrototypeOf(object, LoDash)

export const Ut = object as Utilities
