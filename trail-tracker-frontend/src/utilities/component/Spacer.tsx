import * as React from "react"

export interface SpacerProps {
    height?: number | string
    width?: number | string
}

/**
 * Invisible component that either takes up vertical or horizontal space.
 */
export const Spacer = (props: SpacerProps) => {
    if (typeof props.height !== "undefined") {
        return <div style={{height: props.height}}/>
    } else if (typeof props.width !== "undefined") {
        return <span style={{display: "inline-block", width: props.width}}/>
    }
    return <span/>
}
