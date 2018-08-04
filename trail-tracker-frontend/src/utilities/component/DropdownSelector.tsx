import * as React from "react"
import { DropdownButton, Form, FormGroup, MenuItem } from "react-bootstrap"
import { IconText } from "./IconText"

/**
 * Dropdown button that displays an array of label-value pairs.
 */
export const DropdownSelector = (props: {
    title: string,
    values: [string, any][],
    onClick: (value: any) => void
    icon?: string,
    bsStyle?: string
    children?: any
}) =>
    <FormGroup>
        <Form inline>
            <DropdownButton title={
                <span>
                    <IconText icon={props.icon}>
                        {props.title}
                    </IconText>
                </span> as any
            } id="" style={{width: 160}} bsStyle={props.bsStyle}>
                {
                    props.values.map((value) =>
                        <MenuItem onClick={() => props.onClick(value[1])}>
                            {value[0]}
                        </MenuItem>
                    )
                }
            </DropdownButton>
            {props.children}
        </Form>
    </FormGroup>
