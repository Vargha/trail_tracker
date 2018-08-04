import json
import os
import urllib
from typing import *

from haversine import haversine


#
# Exports hike data as json into a directory as hikes.json.
#
def json_export(hikes, output_directory):
    with open(output_directory + "/hikes.json", "w") as file:
        file.write(json.dumps(hikes, indent=4))

#
# Returns the float value of a string or none if not convertible.
#
def parse_float(string: str) -> Union[float, None]:
    if not string:
        return None
    try:
        return float(string)
    except:
        return None

#
# Parses the length of a trail from xpath text.
#
def parse_length(string: str) -> Union[float, None]:
    try:
        return parse_float(string.split()[0])
    except:
        return None

#
# Returns the first element matching an xpath or none if no elements match the path.
#
def xpath_first(tree, path: str) -> Union[Any, None]:
    results = tree.xpath(path)
    if results:
        return results[0]
    return None

#
# Returns all elements matching an xpath or none if no elements match the path.
#
def xpath_all(tree, path: str) -> Union[List[Any], None]:
    results = tree.xpath(path)
    if results:
        return results
    return None

#
# Downloads a photo at a url and stores it with given a name in a specified directory.
#
def download_photo(url: str, name: str, directory: str, enable=True):
    try:
        if not os.path.exists(directory):
            os.mkdir(directory)

        filename = name + ".jpg"
        path = directory + name + ".jpg"

        if enable:
            # Avoid re-downloading images.
            if not os.path.exists(path):
                file = open(path, "wb")
                request = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
                image = urllib.request.urlopen(request)

                while True:
                    buffer = image.read(65536)
                    if len(buffer) == 0:
                        break
                    file.write(buffer)
                file.close()
                image.close()

        return filename

    except urllib.error.HTTPError:
        return None

#
# Tool to get coordinates of zip codes and zip codes surrounding coordinates.
#
class ZipLocator:

    #
    # Creates a zip locator using zip coordinate data at a specified path.
    #
    def __init__(self, path: str):
        with open(path) as file:
            self._zip_coordinates = json.load(file)

    #
    # Gets the coordinates of a zip code.
    #
    def get(self, code: str) -> Union[str, None]:
        return self._zip_coordinates.get(code)

    #
    # Returns a bucketed grouping of zip codes nearby a given latitude and longitude.
    #
    def get_zips(self, latitude: float, longitude: float) -> Dict[str, List[str]]:
        zips = {
            "0-5": [],
            "5-10": [],
            "10-25": [],
            "25-50": [],
            "50-100": []
        }

        for code, coordinates in self._zip_coordinates.items():
            distance = haversine((latitude, longitude), coordinates, miles=True)

            if distance <= 5:
                bucket = "0-5"
            elif distance <= 10:
                bucket = "5-10"
            elif distance <= 25:
                bucket = "10-25"
            elif distance <= 50:
                bucket = "25-50"
            elif distance <= 100:
                bucket = "50-100"
            else:
                bucket = None

            if bucket:
                zips[bucket].append(code)

        return zips
