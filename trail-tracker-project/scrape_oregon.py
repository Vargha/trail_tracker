#
# This is a script that scrapes the Oregon Hikers website for trail data.
#

import re

import requests
from lxml import html

from scraping_utilities import *

OUTPUT_DIRECTORY = "database/oregon"

def main():
    zip_locator = ZipLocator("location-data/json/zip-coordinates.json")

    if not os.path.exists(OUTPUT_DIRECTORY):
        os.makedirs(OUTPUT_DIRECTORY)

    pages = [
        "http://www.oregonhikers.org/w/index.php?title=Category:Easy_Hikes",
        "http://www.oregonhikers.org/w/index.php?title=Category:Easy_Hikes&pagefrom=Lost+Lake+Loop+Hike#mw-pages",
        "http://www.oregonhikers.org/w/index.php?title=Category:Easy_Hikes&pagefrom=Yaquina+Head+Hike#mw-pages",
        "http://www.oregonhikers.org/field_guide/Category:Moderate_Hikes",
        "http://www.oregonhikers.org/w/index.php?title=Category:Moderate_Hikes&pagefrom=Marble+Valley+Hike#mw-pages",
        "http://www.oregonhikers.org/field_guide/Category:Difficult_Hikes"
    ]

    id = 9700000
    hikes = []

    page_number = 0
    try:
        for page in pages:
            print(str(page_number), "Page: ", page)

            try:
                raw_page = requests.get(page)  # Response object of the searched page
                page_tree = html.fromstring(raw_page.content)  # Convert the Response String to a tree
            except:
                print("ERROR: Could not fetch data from page: " + str(page))
                continue

            page_hikes = xpath_all(page_tree, '//li/a/@href')

            for hike_url in page_hikes:
                # HIKE URL
                if hike_url[0] == '/':
                    hike_url = "http://www.oregonhikers.org" + hike_url     # Taking care of inside links

                try:                                                        # Go into each hike_url and read the whole page content
                    raw_hike_page = requests.get(hike_url)                  # Response object of the searched page
                    hike_page_tree = html.fromstring(raw_hike_page.content) # Convert the Response String to a tree
                except:
                    print("ERROR: Could not fetch data from page: " + str(hike_url))
                    continue

                # LENGTH
                length = xpath_first(hike_page_tree, '//div[@id="mw-content-text"]/ul/li[contains(., " Distance: ")]/text()')
                if length == None:
                    continue
                if len(re.findall("\d+\.\d+", length)) > 0:
                    length = parse_float(re.findall("\d+\.\d+", length)[0])
                elif len(re.findall("\d+", length)) > 0:                  # some lengths are integer and not float
                    length = int(re.findall("\d+", length)[0])

                # HIKE NAME
                hike_name = xpath_first(hike_page_tree, '//h1/text()')
                if hike_name == None:
                    continue

                # ELEVATION (gain)
                try:
                    elev_str = xpath_first(hike_page_tree, '//div[@id="mw-content-text"]/ul/li[contains(., " Elevation gain")]/text()')
                    elev_str = re.findall("\d+\,\d+|\d+", elev_str)[0]          # find elevationgains in these formats: 12345 OR 12,345
                    elev_str = re.sub(',', '', elev_str)
                    gain = int(elev_str)
                except:
                    print("ERROR: Could not get gain data from page: " + str(hike_url))
                    continue

                # ANOTHER LEVEL DEEP FOR MORE INFO
                # Inner Link for each hike
                # All li's that contain "Start Point"|"start point"|"Start point" contain "tart "
                inner_link = xpath_first(hike_page_tree, '//div[@id="mw-content-text"]/ul/li[contains(., "tart ")]/a/@href')
                if inner_link == None:
                    continue
                else:
                    inner_link = "http://www.oregonhikers.org" + inner_link
                # Move into the inner link (Deepest)
                try:                                                            # Move into the deepest level
                    raw_inner_page = requests.get(inner_link)                   # Response object of the searched page
                    inner_page_tree = html.fromstring(raw_inner_page.content)   # Convert the Response String to a tree
                except:
                    print("ERROR: Could not fetch data from page: " + str(hike_url))
                    continue

                # LOCATION
                coordinates = ["",""]
                latitude, longitude = coordinates
                # LATITUDE
                try:
                    lat_str = xpath_first(inner_page_tree, '//div[@id="mw-content-text"]/ul/li[contains(., "atitude")]/text()')
                    lat_str = re.findall("\-\d+\.\d+|\d+\.\d+|\-\d+|\d+", lat_str)[0]
                    latitude = float(lat_str)
                except:
                    print("ERROR: No Latitude on page: " + str(inner_page_tree))
                    continue
                # LONGITUDE
                try:
                    lon_str = xpath_first(inner_page_tree, '//div[@id="mw-content-text"]/ul/li[contains(., "ongitude")]/text()')
                    lon_str = re.findall("\-\d+\.\d+|\d+\.\d+|\-\d+|\d+", lon_str)[0]
                    longitude = float(lon_str)
                except:
                    print("ERROR: No Latitude on page: " + str(inner_page_tree))
                    continue

                # PHOTO URL
                try:
                    photo_url = xpath_first(inner_page_tree, '//div[@class="thumbinner"]/a/img/@src')
                    photo_url = "http://www.oregonhikers.org" + photo_url
                except:
                    print("ERROR: No Latitude on page: " + str(inner_page_tree))
                    continue

                # PHOTO TITLE
                photo_title = xpath_first(inner_page_tree, '//div[@class="thumbcaption"]/text()')
                if photo_title == None:
                    photo_title = hike_name

                print (id)
                print ("\tURL: " , hike_url)
                print ("\tLength: ", length)
                print ("\tHike Name: ", hike_name)
                print ("\tGain: ", gain)
                print ("\tInner Link: ", inner_link)
                print ("\tLatitude: ", latitude)
                print ("\tLongitude: ", longitude)
                print ("\tPhoto Url:", photo_url)
                print ("\tPhoto Title:", photo_title)

                # If the hike has all the data we are looking for, then add it
                hike = {
                    "id": id,
                    "name": hike_name,
                    "link": hike_url,
                    "rating": None,              # Later, we can add rating section into our own website
                    "length": length,
                    "gain": gain,
                    "location": {
                        "latitude": latitude,
                        "longitude": longitude,
                        "zips": zip_locator.get_zips(latitude, longitude)
                    },
                    "photo": {
                        "url": photo_url,
                        "title": photo_title
                    }
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
