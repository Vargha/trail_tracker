import * as React from "react"

export interface IfProps {
    condition: any
    children?: JSX.Element[] | JSX.Element
}

/**
 * Component that only renders its children if a given condition is truthy.
 */
export const If = (props: IfProps) => {
    if (props.condition) {
        return <span style={{display: props.condition ? null : "hidden"}}>
            {props.children}
        </span>
    }
    return null
}
