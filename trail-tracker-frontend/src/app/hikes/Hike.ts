import { MapPosition } from "../view/Map"

/**
 * Container for hike data.
 */
export class Hike {

    /**
     * The rating to give to hikes without any official ratings.
     */
    static readonly unratedRating = 2.5

    /**
     * Unique ID.
     */
    readonly id: number

    /**
     * The name of the hike.
     */
    readonly name: string

    /**
     * The hike's current rating.
     */
    readonly rating: number | null

    /**
     * The length of the hike in miles.
     */
    readonly length: number | null

    /**
     * The increase in elevation in ft along the trail.
     */
    readonly gain: number | null

    /**
     * A link to the website the data was grabbed from.
     */
    readonly link: string

    /**
     * Coordinates of the hike's starting point.
     */
    readonly location: Location

    /**
     * The url and title of a photo from the original website.
     */
    readonly photo: Photo | null

    /**
     * Creates a hike object from JSON data returned by the API.
     */
    constructor(data: object) {
        this.id = data["id"]
        this.name = data["name"]
        this.rating = data["rating"] || Hike.unratedRating
        this.length = data["length"] || null
        this.gain = data["gain"] || null
        this.link = data["link"]

        const { latitude, longitude } = data["location"]
        this.location = new Location(latitude, longitude)

        const photo = data["photo"]
        if (photo) {
            const {url, title} = photo
            if (url) {
                this.photo = new Photo(url, title)
            } else {
                this.photo = null
            }
        }
    }
}

/**
 * Contains latitude and longitude coordinates.
 */
export class Location {
    readonly latitude: number
    readonly longitude: number

    constructor(latitude: number, longitude: number) {
        this.latitude = latitude
        this.longitude = longitude
    }

    /**
     * Converts the location into a Google-mappable position object.
     */
    toMapPosition(): MapPosition {
        return {
            lat: this.latitude,
            lng: this.longitude
        }
    }
}

/**
 * Contains the url and title of a photo.
 */
export class Photo {
    readonly url: string
    readonly title: string

    constructor(url: string, title: string) {
        this.url = url
        this.title = title.trim()
    }
}
