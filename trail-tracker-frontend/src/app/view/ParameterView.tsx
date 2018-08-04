import { Button, Col, ControlLabel, Form, FormControl, Grid, Row } from "react-bootstrap"
import * as React from "react"
import { app } from "../controller/Controller"
import { Spacer } from "../../utilities/component/Spacer"
import { observer } from "mobx-react"
import { ReactUt } from "../../utilities/ReactUt"
import { Configuration } from "../configuration/Configuration"
import Glyphicon from "react-bootstrap/lib/Glyphicon"
import { DropdownSelector } from "../../utilities/component/DropdownSelector"

/**
 * Component that allows the user to view and change search parameters.
 */
export const ParameterView = observer(() =>
    <div className="parameter-view">
        <div className="basic-view-header">
            Find Your Hike
        </div>
        <div style={{height: 250}}>
            <ParameterGrid/>
        </div>
        <SearchButton/>
    </div>
)

/**
 * Layout for both columns of the view.
 */
const ParameterGrid = observer(() =>
    <Grid fluid>
        <Col xs={6} lg={8}>
            <FirstColumn/>
        </Col>
        <Col xs={6} lg={4}>
            <SecondColumn/>
        </Col>
    </Grid>
)

/**
 * The first column of the parameter view. Displays controls for search by name and proximity.
 */
const FirstColumn = observer(() =>
    <div>
        {/* Control for the name of the hike. */}
        <Form onSubmit={(event) => {
            event.preventDefault()
            app().search.search()
        }}>
            <Spacer height={20}/>
            <ControlLabel>
                Trail Name
            </ControlLabel>
            <FormControl
                type="text"
                style={{textAlign: "center"}}
                value={app().search.name}
                onChange={(event) => app().search.name = ReactUt.getTargetValue(event)}
            />
        </Form>

        {/* Controls for proximity searching. */}
        <div>

            {/* Control for origin. */}
            <Form onSubmit={(event) => {
                event.preventDefault()
                app().search.search()
            }}>
                <Spacer height={20}/>
                <ControlLabel>
                    City or Zip Code
                </ControlLabel>
                <FormControl
                    type="text"
                    disabled={app().search.autoFillingOrigin}
                    style={{textAlign: "center"}}
                    value={app().search.origin}
                    onChange={(event) => app().search.origin = ReactUt.getTargetValue(event)}
                    onSubmit={(event) => {
                        event.preventDefault()
                        app().search.search()
                    }}
                />
            </Form>

            <Grid fluid>
                <Row>
                    <Col lg={6}>
                        <Spacer height={20}/>

                        {/* Button that auto-fills the user's zip code. */}
                        <Button
                            title="Auto-Fill ZIP Code"
                            data-toggle="tooltip"
                            disabled={!app().connection.online}
                            bsStyle="success"
                            onClick={() => app().search.autoFillOrigin()}>
                            <Glyphicon
                                className={app().search.autoFillingOrigin ? "spinning" : ""}
                                glyph={app().search.autoFillingOrigin ? "repeat" : "home"}
                                style={{paddingTop: 1}}
                            />
                            <Spacer width={5}/>
                            My Location
                        </Button>
                    </Col>
                    <Col lg={6}>
                        <Spacer height={20}/>

                        {/* Distance dropdown selector. */}
                        <DropdownSelector
                            title="Distance"
                            icon="road"
                            bsStyle="warning"
                            values={getDistanceValues()}
                            onClick={(value) => app().search.distance = value}>
                            <ParameterValue value={formatDistance(app().search.distance)}/>
                        </DropdownSelector>
                    </Col>
                </Row>
            </Grid>
        </div>
    </div>
)

/**
 * The second column of the parameter view. Displays controls for filtering results by rating and length of trail.
 */
const SecondColumn = observer(() =>
    <div style={{textAlign: "center"}}>
        <Spacer height={20}/>

        {/* Minimum rating selector. */}
        <DropdownSelector
            title="Rating"
            icon="star"
            bsStyle="success"
            values={getRatingValues()}
            onClick={(value) => app().search.rating = value}>
            <ParameterValue value={formatRating(app().search.rating)}/>
        </DropdownSelector>

        {/* Minimum length selector. */}
        <DropdownSelector
            title="Min Length"
            icon="resize-horizontal"
            bsStyle="success"
            values={getMinLengthValues()}
            onClick={(value) => app().search.minLength = value}
        >
            <ParameterValue value={formatLength(app().search.minLength)}/>
        </DropdownSelector>

        {/* Maximum length selector. */}
        <DropdownSelector
            title="Max Length"
            icon="resize-horizontal"
            bsStyle="success"
            values={getMaxLengthValues()}
            onClick={(value) => app().search.maxLength = value}>
            <ParameterValue value={formatLength(app().search.maxLength)}/>
        </DropdownSelector>
    </div>
)

/**
 * Button to allow the user to submit the parameters to backend API and get their results. This can also be done by
 * hitting submit on the text fields in the first column of the parameter view.
 */
const SearchButton = observer(() =>
    <div>
        <Spacer height={10}/>
        <Button bsStyle="warning" style={{width: "100%"}} onClick={() => app().search.search()}>
            <Glyphicon glyph="search"/>
            <Spacer width={5}/>
            Search
        </Button>
        <Spacer height={20}/>
    </div>
)

/**
 * Displays a parameter's current value.
 */
const ParameterValue = (props: { value: string }) =>
    <div className="parameter-value">
        {props.value}
    </div>

/*
 *
 * Helper functions for displaying parameter components.
 *
 */

function getDistanceValues(): [string, number][] {
    return Configuration.distanceOptions.map((distance) => [formatDistance(distance), distance] as [string, number])
}

function getRatingValues(): [string, number][] {
    return Configuration.ratingOptions.map((rating) => [formatRating(rating), rating] as [string, number])
}

function getMinLengthValues(): [string, number][] {
    return Configuration.minLengthOptions
        .filter((length) => length < app().search.maxLength)
        .map((length) => [formatLength(length), length] as [string, number])
}

function getMaxLengthValues(): [string, number][] {
    return Configuration.maxLengthOptions
        .filter((length) => length > app().search.minLength)
        .map((rating) => [formatLength(rating), rating] as [string, number])
}

function formatDistance(distance: number): string {
    if (distance === Infinity) {
        return "< ∞"
    }
    return "< " + distance + " miles"
}

function formatLength(length: number): string {
    if (length === Infinity) {
        return "∞"
    }
    return length + " miles"
}

function formatRating(rating: number): string {
    return rating + "+"
}
