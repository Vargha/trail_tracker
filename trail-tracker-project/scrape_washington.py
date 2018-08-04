#
# This is a script that scrapes the Washington Trail Association website for trail data.
#

import requests
from lxml import html

from scraping_utilities import *

OUTPUT_DIRECTORY = "database/washington"

def main():
    zip_locator = ZipLocator("location-data/json/zip-coordinates.json")

    if not os.path.exists(OUTPUT_DIRECTORY):
        os.makedirs(OUTPUT_DIRECTORY)

    base_url = "http://www.wta.org/go-outside/hikes?b_start:int="  # All urls start with this
    page_max = 114  # 114						# 114 Pages # CHANGE TO 114 AFTER TESTS
    start_point = -30
    id = 1

    hikes = []

    try:
        for pageNumber in range(0, page_max):
            print("Page: " + str(pageNumber))
            start_point += 30  # 30 elements per page
            page_url = base_url + str(start_point)  # Full Search url (PrefixURL, SearchSubject, Limit)

            try:
                raw_page = requests.get(page_url)  # Response object of the searched page
                page_tree = html.fromstring(raw_page.content)  # Convert the Response String to a tree
            except:
                print("ERROR: Could not fetch data from page: " + str(page_url))
                continue

            names = xpath_all(page_tree, '//a[@class="listitem-title"]/span/text()')
            links = xpath_all(page_tree, '//a[@class="listitem-title"]/@href')
            ratings = xpath_all(page_tree, '//div[@class="current-rating"]/text()')

            for i, link in enumerate(links):
                try:
                    raw_subpage = requests.get(link)  # Response object of the searched page
                    hike_tree = html.fromstring(raw_subpage.content)  # Convert the Response String to a tree
                except:
                    print("ERROR: Could not fetch data from hike link: " + link)
                    continue

                coordinates = xpath_all(hike_tree, '//div[@class="latlong"]/span/text()')

                if coordinates:
                    print(link + ", " + str(id))
                    latitude, longitude = coordinates
                    latitude = float(latitude)
                    longitude = float(longitude)
                else:
                    print("Skipping: " + link)
                    continue

                photo_url = xpath_first(hike_tree, '//div[@class="image-with-caption"]/img/@src')
                if photo_url:
                    photo = {
                        "url": photo_url,
                        "title": xpath_first(hike_tree, '//div[@class="image-with-caption"]/img/@title') or names[i]
                    }
                else:
                    photo = None

                hike = {
                    "id": id,
                    "name": names[i],
                    "link": links[i],
                    "rating": float(ratings[i]),
                    "length": parse_length(xpath_first(hike_tree, '//div[@id="distance"]/span/text()')),
                    "gain": parse_float(xpath_first(hike_tree, '//div[@class="hike-stat"]/div/span/text()')),
                    "location": {
                        "latitude": latitude,
                        "longitude": longitude,
                        "zips": zip_locator.get_zips(latitude, longitude)
                    },
                    "photo": photo
                }

                hikes.append(hike)

                print(json.dumps(hike))

                id += 1
    except Exception as exception:
        print(exception)
        print("Encountered error... exiting and saving data.")
        pass

    print("Exporting data...")
    json_export(hikes, OUTPUT_DIRECTORY)

if __name__ == "__main__":
    main()
