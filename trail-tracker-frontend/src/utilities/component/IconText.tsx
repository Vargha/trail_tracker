import * as React from "react"
import { Spacer } from "./Spacer"
import * as Glyphicon from "react-bootstrap/lib/Glyphicon"

export interface IconTextProps {
    icon?: string
    children?: number | string | JSX.Element | JSX.Element[]
}

/**
 * Displays text with a specified icon to the left side.
 */
export const IconText = (props: IconTextProps) =>
    <span>
        <Glyphicon glyph={props.icon || ""}/>
        <Spacer width={5}/>
        {props.children}
    </span>