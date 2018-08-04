import * as React from "react"
import { SFC } from "react"
import * as Modal from "react-bootstrap/lib/Modal"
import { Button, ButtonGroup } from "react-bootstrap"
import { isUndefined } from "util"
import { If } from "./If"
import { Spacer } from "./Spacer"

interface ConfirmationModalProps {
    title?: string
    onPositive: () => void
    onNegative?: () => void
    onHide: () => void
}

/**
 * Dialog used to get confirmation from the user.
 */
export const ConfirmationModal: SFC<ConfirmationModalProps> = (props) =>
    <Modal className="confirmation-modal" show={true} onHide={props.onHide}>
        <Modal.Header closeButton>
            <Modal.Title>
                {props.title}
            </Modal.Title>
        </Modal.Header>
        <div>
            <Spacer height={20}/>
            {props.children}
            <Spacer height={20}/>
            <ButtonGroup>
                <Button onClick={props.onPositive}>
                    {isUndefined(props.onNegative) ? "Continue" : "Yes"}
                </Button>
                <If condition={!isUndefined(props.onNegative)}>
                    <Button onClick={props.onNegative}>
                        "No"
                    </Button>
                </If>
            </ButtonGroup>
        </div>
        <Spacer height={20}/>
        <Modal.Footer/>
    </Modal>
