import * as React from "react"
import { GoogleMap, Marker, TerrainLayer, withGoogleMap, withScriptjs } from "react-google-maps"

export const mapElementHeight = 400

/**
 * API key used to communicate with the Google Maps.
 */
const apiKey = "AIzaSyD2Ljq8fUTXiEpAe8NdNJ4YDhnA6y0fQew"

/**
 * Full URL for Google Maps with an API key embedded.
 */
const googleMapsURL =
    "https://maps.googleapis.com/maps/api/js?" +
    `key=${apiKey}` +
    "&v=3.exp&libraries=geometry,drawing,places"

export interface MapPosition {
    readonly lat: number,
    readonly lng: number
}

/**
 * This library is kinda absurd. It's hardly worth explaining. Just look at the documentation to figure out what's
 * going on with the wrapping functions. Otherwise, this is the real map with a few default settings for the
 * application.
 */
const RequiredMapConfiguration = withScriptjs(withGoogleMap((props: MapProps) =>
    <GoogleMap
        defaultZoom={9}
        center={props.center}
        defaultOptions={{
            mapTypeId: google.maps.MapTypeId.TERRAIN, /* Show terrain */
            mapTypeControl: true, /* Show controls */
            mapTypeControlOptions: {
                /* Set control style */
                style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
                position: google.maps.ControlPosition.TOP_RIGHT
            },
        }}
        resetBoundsOnResize>
        {props.children}
    </GoogleMap>
))

export interface MapProps {
    center?: MapPosition
    children?: any
}

/**
 * Google Maps component that takes a center position and child components.
 */
export const Map = (props: MapProps) =>
    <RequiredMapConfiguration
        center={props.center}
        googleMapURL={googleMapsURL}
        loadingElement={<div style={{height: mapElementHeight, width: "100%"}}/>}
        containerElement={<div style={{height: mapElementHeight, width: "100%"}}/>}
        mapElement={<div style={{height: "100%", width: "100%"}}/>}>
        {props.children}
    </RequiredMapConfiguration>
