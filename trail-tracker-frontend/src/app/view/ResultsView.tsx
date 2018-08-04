import * as React from "react"
import { Component } from "react"
import { observer } from "mobx-react"
import { Button, ButtonGroup, Form } from "react-bootstrap"
import { Spacer } from "../../utilities/component/Spacer"
import { app } from "../controller/Controller"
import { Hike } from "../hikes/Hike"
import { IconText } from "../../utilities/component/IconText"
import { ResultsContext } from "../controller/contexts/ResultsContext"
import { Ut } from "../../utilities/Ut"
import { If } from "../../utilities/component/If"

/**
 * Displays navigable search results divided by page.
 */
@observer
export class ResultsView extends Component {

    /**
     * Returns the hikes at the current page index.
     */
    private get page(): Hike[] {
        const start = app().results.pageIndex * ResultsContext.hikesPerPage
        const end = start + ResultsContext.hikesPerPage
        return app().results.hikes.slice(start, end)
    }

    /**
     * Render all search results and the page changer to navigate them with.
     */
    render(): JSX.Element {
        return (
            <div className="results-view">
                <div className="basic-view-header">
                    Results
                </div>
                {this.renderResults()}
                {this.renderPageChanger()}
            </div>
        )
    }

    /**
     * Render the results of the latest search.
     */
    renderResults(): JSX.Element {
        const page = this.page
        const remainingSpaces = ResultsContext.hikesPerPage - page.length
        const empty = app().results.hikeCount === 0
        const space = empty ? 20 : 30
        /* This is not a great way to do this... temporary. */
        return (
            <div>
                <If condition={empty}>
                    <div style={{height: 50}}>
                        No Results
                    </div>
                </If>
                {
                    page.map((hike) =>
                        <div>
                            {this.renderResult(hike)}
                            <Spacer height={space}/>
                        </div>
                    )
                }
                {
                    Ut.range(0, remainingSpaces).map((i) =>
                        <div>
                            <div className="blank-result-view"/>
                            <Spacer height={space}/>
                        </div>
                    )
                }
            </div>
        )
    }

    /**
     * Renders a search result, showing it's name and a few small details. If the large area of the result is clicked,
     * the hike is selected. If the button that displays the name of the hike is clicked, information about the hike
     * will be shown in a modal dialog.
     */
    renderResult(hike: Hike): JSX.Element {
        const selected = app().hike.selected
        const isSelectedResult = selected ? selected.id === hike.id : false
        return (
            <div className={isSelectedResult ? "result-view-selected" : "result-view"}>
                <div onClick={() => app().hike.select(hike)}>
                    <Button title="View Details" data-toggle="tooltip" bsStyle="success" onClick={
                        () => app().hike.show(hike)
                    }>
                        {hike.name}
                    </Button>
                    <br/>
                    <IconText icon="resize-horizontal">
                        {hike.length || "?"}
                    </IconText>
                    <Spacer width={10}/>
                    <IconText icon="star">
                        {hike.rating || "?"}
                    </IconText>
                </div>
            </div>
        )
    }

    /**
     * Renders buttons that allow changing pages.
     */
    renderPageChanger(): JSX.Element {
        return (
            <Form inline>
                <ButtonGroup>
                    <Button onClick={() => app().results.pageIndex = 0}>
                        {"<<"}
                    </Button>
                    <Button onClick={() => app().results.pageIndex--}>
                        {"<"}
                    </Button>
                </ButtonGroup>
                <Spacer width={10}/>
                <ButtonGroup>
                    <Button onClick={() => app().results.pageIndex++}>
                        {">"}
                    </Button>
                    <Button onClick={() => app().results.pageIndex = app().results.pageCount - 1}>
                        {">>"}
                    </Button>
                </ButtonGroup>
                <Spacer height={10}/>
                <div style={{fontSize: 12}}>
                    {"Page " + (app().results.pageIndex + 1) + " / " + app().results.pageCount}
                    {" | " + app().results.hikeCount + " Hikes "}
                </div>
            </Form>
        )
    }
}
