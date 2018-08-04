import * as React from "react"
import { observer } from "mobx-react"
import { Button, Col, Grid, Modal, Row } from "react-bootstrap"
import { app } from "../controller/Controller"
import { Hike } from "../hikes/Hike"
import { Spacer } from "../../utilities/component/Spacer"
import { isUndefined } from "util"
import { If } from "../../utilities/component/If"
import Glyphicon from "react-bootstrap/lib/Glyphicon"
import { Resources } from "../configuration/Resources"

/**
 * A modal that shows details about the currently selected hike.
 */
export const HikeModal = observer((props: { hike: Hike }) =>
    <Modal show={true} backdrop={true} dialogClassName="hike-modal"
           onHide={() => app().hike.hide()}>
        <Modal.Header className="hike-modal-header" closeButton>
            <Modal.Title>
                <div className="header-text">
                    {props.hike.name}
                </div>
            </Modal.Title>
        </Modal.Header>
        <div className="hike-modal-content">
            <HikePhoto hike={props.hike}/>
            <HikeDetails hike={props.hike}/>
        </div>
        <Modal.Footer/>
    </Modal>
)

/**
 * Displays a photo of a trail. Only shown if the user is online because the images are not stored locally.
 */
const HikePhoto = (props: { hike: Hike }) => {
    if (app().connection.online && props.hike.photo) {
        return (
            <div>
                <div className="hike-image-frame">
                    <img src={props.hike.photo ? props.hike.photo.url : ""} className="hike-image"/>
                </div>
                <p>
                    "{props.hike.photo ? props.hike.photo.title : null}"
                </p>
            </div>
        )
    }
    return (
        <div>
            <Spacer height={10}/>
            <img style={{height: 50}} src={Resources.riverTrailIconBlack}/>
            <Spacer height={20}/>
        </div>
    )
}

/**
 * Shows text information about a trail.
 */
const HikeDetails = (props: { hike: Hike }) =>
    <div className="hike-details-container">
        <div className="hike-details">
            <Grid fluid>
                <Row>
                    <Col xs={6}>
                        <Spacer height={10}/>
                        <Glyphicon glyph="resize-horizontal"/>
                        <HikeDetail label="Length" value={props.hike.length} suffix=" miles"/>
                        <Spacer height={10}/>
                        <Glyphicon glyph="chevron-up"/>
                        <HikeDetail label="Gain" value={props.hike.gain} suffix=" ft"/>
                    </Col>
                    <Col xs={6}>
                        <Spacer height={10}/>
                        <Glyphicon glyph="star"/>
                        <HikeDetail label="Rating" value={props.hike.rating} suffix=" / 5"/>
                        <Spacer height={10}/>
                        <Glyphicon glyph="remove"/>
                        <HikeDetail label="Location" value={
                            props.hike.location.latitude.toFixed(2) + ", " +
                            props.hike.location.longitude.toFixed(2)
                        }/>
                    </Col>
                </Row>
            </Grid>
            <Spacer height={20}/>
            <Button bsStyle="success" href={props.hike.link} target="_blank">
                Go to Website
            </Button>
        </div>
    </div>

/**
 * Displays a single hike detail with a value and and optional label and/or suffix.
 */
const HikeDetail = (props: { label?: string, value: string | number | null, suffix?: string }) =>
    <div className="hike-detail">
        <If condition={!isUndefined(props.label)}>
            <div className="hike-detail-label">
                {props.label}
            </div>
        </If>
        <div className="hike-detail-value">
            {(props.value || "?") + "" + (props.suffix || "")}
        </div>
    </div>
