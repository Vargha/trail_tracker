import json
import re
from typing import *

from whoosh import index as indexing
from whoosh import query as querying
from whoosh.qparser import QueryParser
from whoosh.query import And, Or, FuzzyTerm, Query
from whoosh.searching import Hit

from schema import SCHEMA

Hike = Dict[str, Any]

#
#
#
class SearchParameters:
    def __init__(self, name: str=None, origin: str=None, distance: int=None, rating: int=None, min_length: int=None,
                 max_length: int=None):
        self.name = name
        self.origin = None if origin is None else origin.lower()
        self.distance = distance
        self.rating = rating
        self.min_length = min_length
        self.max_length = max_length

#
# Abstracts away the database index.
#
class Searcher:
    RESULT_LIMIT = 200
    ZIP_REGEX = re.compile("^[0-9]{5}$")

    #
    # Creates a new searcher provided the path to the database index and the path to a mapping of cities to zip
    # codes.
    #
    def __init__(self, index: str, city_zips: str):
        self.index = indexing.open_dir(index)
        with open(city_zips) as file:
            self.city_zips = json.load(file)

    #
    # Searches the database using a search parameters object and returns a list of all hits.
    #
    def search(self, parameters: SearchParameters) -> List[Hit]:
        query = self._query(parameters)

        # Search the database.
        with self.index.searcher() as searcher:
            hits = searcher.search(query, limit=Searcher.RESULT_LIMIT)
            hikes = [hit.get("data") for hit in hits]

            # Return filtered hikes.
            return self._filter(hikes, parameters)

    #
    # Builds a Whoosh query from a search parameters object. Only factors in name and proximity.
    #
    def _query(self, parameters: SearchParameters) -> Query:
        queries = []

        # If a name is provided, fuzzy search the database for trails with names close to the parameter.
        if parameters.name:
            parser = QueryParser("name", schema=SCHEMA, termclass=FuzzyTerm)
            query = parser.parse(parameters.name)
            queries.append(query)

        #
        # If an origin and distance are provided, proximity search the database for trails within the specified
        # distance of the origin.
        #
        if parameters.origin and parameters.distance:
            # If the origin is not a zip code, assume it's a city name and get the zip codes it contains.
            if not Searcher.ZIP_REGEX.match(parameters.origin):
                zips = self.get_zips(parameters.origin)
            else:
                zips = [parameters.origin]  # Single zip code

            if zips:
                query = []
                for distance in (5, 10, 25, 50, 100):
                    for code in zips:
                        if distance <= parameters.distance:
                            term = querying.Term("zips", str(distance) + "-" + code + " ")
                            parser = QueryParser("zips", schema=SCHEMA)
                            subquery = parser.parse(str(term))
                            query.append(subquery)
                queries.append(Or(query))

        # Return the intersection of the name and proximity queries.
        return And(queries)

    #
    # Filters results returned by a name and/or proximity query by the minimum rating and minimum/maximum length
    # parameters. This was originally done by indexing, but that was ultimately slower and less intuitive. These
    # parameters are used strictly as filters.
    #
    def _filter(self, hikes: List[Hike], parameters: SearchParameters) -> List[Hike]:
        predicates = []

        # Add a filter for minimum length if specified.
        if parameters.min_length is not None:
            def predicate(hike: Hike):
                length = hike["length"]
                if length is None:
                    return False
                return length >= parameters.min_length
            predicates.append(predicate)

        # Add a filter for maximum length if specified.
        if parameters.max_length is not None:
            def predicate(hike: Hike):
                length = hike["length"]
                if length is None:
                    return False
                return length <= parameters.max_length
            predicates.append(predicate)

        # Add a filter for minimum rating if specified.
        if parameters.rating is not None:
            def predicate(hike: Hike):
                rating = hike["rating"]
                if rating is None:
                    rating = 2.5  # Give unrated hikes a 50% rating.
                return rating >= parameters.rating
            predicates.append(predicate)

        #
        # Returns true if all predicates match a result.
        #
        def is_valid(hike: Hike):
            for predicate in predicates:
                if not predicate(hike):
                    return False
            return True

        # Return filtered results.
        return [hike for hike in hikes if is_valid(hike)]

    #
    # Retrieves zip codes from the city to zip codes mapping.
    #
    def get_zips(self, city) -> Union[List[str], None]:
        return self.city_zips.get(city, [])
