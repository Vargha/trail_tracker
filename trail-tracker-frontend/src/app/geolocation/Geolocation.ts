import { Ut } from "../../utilities/Ut"

/**
 * Fetches the zip code of the user asyncronously via the geolocation API.
 */
export function getUserZip(callback: (zip: string | null) => void) {
    window.navigator.geolocation.getCurrentPosition(async (position) => {
        const {latitude, longitude} = position.coords
        const query = "?latlng=" + latitude + "," + longitude + "&sensor=true"
        const url = "http://maps.googleapis.com/maps/api/geocode/json" + query
        fetch(url)
            .then((data) => data.json())
            .then((data) => callback(findZip(data)))
            .catch((error) => null)
    })
}

/**
 * Searches through data returned by the geolocation API to find the user's zip code. Returns null if not found.
 */
function findZip(data: object): string | null {
    try {
        for (const result of data["results"]) {
            const components = result["address_components"]
            for (const component of components) {
                if (Ut.includes(component["types"], "postal_code")) {
                    const zip = component["short_name"]
                    if (typeof zip === "string") {
                        return zip
                    }
                }
            }
        }
        return null
    } catch {
        return null
    }
}