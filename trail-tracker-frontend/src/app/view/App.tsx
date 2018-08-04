import { Col, Grid, Row } from "react-bootstrap"
import * as React from "react"
import Helmet from "react-helmet"
import { Configuration } from "../configuration/Configuration"
import { ParameterView } from "./ParameterView"
import { ResultsView } from "./ResultsView"
import { Spacer } from "../../utilities/component/Spacer"
import MapView from "./MapView"
import { observer } from "mobx-react"
import { If } from "../../utilities/component/If"
import { app } from "../controller/Controller"
import { HikeModal } from "./HikeModal"
import { Resources } from "../configuration/Resources"

/**
 * The parent component of the application.
 */
export const App = observer(() =>
    <div className="app">
        <div>
            <Helmet>
                /* Show the application's name in the browser tab. */
                <title>{Configuration.appName}</title>
            </Helmet>
        </div>
        <div>
            <Header/>
            <Content/>
        </div>
    </div>
)

/**
 * The banner at the top of the page that shows the application's name.
 */
const Header = observer(() =>
    <div>
        <div className="header">
            <div className="header-text">
                <h3 className="header-text">
                    <img style={{height: 25}} src={Resources.riverTrailIconWhite}/>
                    <Spacer width={10}/>
                    {Configuration.appName}
                    <Spacer width={10}/>
                    <img style={{height: 25}} src={Resources.riverTrailIconWhite} className="flipped"/>
                </h3>
                <Spacer height={5}/>
            </div>
        </div>
    </div>
)

/**
 * The primary interactable content.
 */
const Content = observer(() =>
    <div>
        <Spacer height={20}/>
        <Grid fluid>
            <Row>
                <Col xs={5} lg={4}>
                    <div>
                        <ResultsView/>
                    </div>
                </Col>
                <Col xs={7} lg={8}>
                    <div>
                        <ParameterView/>
                    </div>
                    <div>
                        <MapView/>
                    </div>
                </Col>
            </Row>
        </Grid>
        <If condition={app().hike.shown}>
            <HikeModal hike={app().hike.selected!!}/>
        </If>
    </div>
)
