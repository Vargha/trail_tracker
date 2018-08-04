import * as React from "react"
import { Map, mapElementHeight, MapPosition } from "./Map"
import { app } from "../controller/Controller"
import { observer } from "mobx-react"
import { Marker } from "react-google-maps"
import { Spacer } from "../../utilities/component/Spacer"

/**
 * View for the map. Renders the map if the user is online and a placeholder otherwise.
 */
export const MapView = observer(() =>
    <div className="map-view">
        <Spacer height={20}/>
        {app().connection.online ? <Rendered/> : <Placeholder/>}
    </div>
)

/**
 * Component rendered when the user is online.
 */
const Rendered = observer(() =>
    <Map center={getCenter()}>
        <HikeMarker/>
    </Map>
)

/**
 * Component rendered when the user is offline.
 */
const Placeholder = observer(() =>
    <div className="map-placeholder" style={{height: mapElementHeight}}>
        <Spacer height={mapElementHeight / 3}/>
        Offline | Map Unavailable
    </div>
)

/**
 * Renders a map marker for the currently selected hike. Returns null if no hike is selected.
 */
const HikeMarker = observer(() => {
    const hike = app().hike.selected
    if (hike === null) {
        return null
    }
    return (
        <Marker
            name={hike.name}
            position={getCenter()}
            onClick={() => app().hike.show(hike)}
        />
    )
})

/**
 * Returns the center map position of the currently selected hike. Returns a default position otherwise.
 */
function getCenter(): MapPosition {
    const hike = app().hike.selected
    if (hike === null) {
        return defaultCenter
    }
    return hike.location.toMapPosition()
}

/**
 * Default center for the map. Currently Portland.
 */
const defaultCenter: MapPosition = {
    lat: 45.512794,
    lng: -122.679565
}

export default MapView
