import json
import os
from typing import *

from whoosh import index as indexing
from whoosh.writing import IndexWriter

from schema import SCHEMA

INPUT_PATH = "database"
OUTPUT_PATH = "database-index"

#
# Indexes the database at the input directory and writes the index to the output directory.
#
def main():
    if not os.path.isdir(INPUT_PATH):
        print("The database directory needs to be in the root directory of the project to index.")
        exit(1)

    # Create the output path if it doesn't already exist..
    if not os.path.exists(OUTPUT_PATH):
        os.mkdir(OUTPUT_PATH)

    hikes = []

    # For each folder in the input directory, get the hikes.json file it contains and load all of it's hikes.
    for path in os.listdir(INPUT_PATH):
        subpath = INPUT_PATH + "/" + path
        if os.path.isdir(subpath):
            data = json.load(open(subpath + "/hikes.json"))
            hikes.extend(data)

    # Write the index to the output directory.
    indexing.create_in(OUTPUT_PATH, SCHEMA)
    index = indexing.open_dir(OUTPUT_PATH)
    writer = index.writer()
    for hike in hikes:
        print("Indexing [" + hike["name"] + "]")
        write(writer, hike)

    print("Indexed " + str(len(hikes)) + " hikes.")
    print("Committing...")
    writer.commit()
    print("Done, created index at [" + os.path.abspath(OUTPUT_PATH) + "]")

#
# Convert the zip code grouping into a string of space-separated zip codes with their distance bin prepended.
# Example: "10-98686 25-98683"
#
def transform_zips(zips: Dict[str, List[str]]) -> str:
    transformed = []
    for bucket, codes in zips.items():
        for code in codes:
            transformed.append(bucket.split("-")[1] + "-" + code)
    return " ".join(transformed)

#
# Use an index writer to write a hike to the database index.
#
def write(writer: IndexWriter, hike: Dict[str, Any]):
    data = json.loads(json.dumps(hike))  # Deep clone the object.

    # Remove attributes that aren't needed in stored data.
    data["location"].pop("zips")  # Remove the zip codes grouping.

    # Write the hike to the index. Only the name and zip code(s) string are indexed.
    writer.add_document(name=hike["name"],
                        zips=transform_zips(hike["location"]["zips"]),
                        data=data)

if __name__ == "__main__":
    main()
