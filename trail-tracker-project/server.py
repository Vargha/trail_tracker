from typing import *

from flask import Flask, request, jsonify, Response
from flask_cors import CORS, cross_origin

from searcher import Searcher, SearchParameters

app = Flask(__name__)

DATABASE_INDEX_PATH = "database-index"
CITY_ZIPS_PATH = "location-data/json/city-zips.json"

#
# A REST API server for the application. Handles and responds to requests for hike information.
#
class Server:

    #
    # Create the server, loading local resources including the index.
    #
    def __init__(self, app: Flask):
        self.app = app
        self.searcher = Searcher(DATABASE_INDEX_PATH, CITY_ZIPS_PATH)
        CORS(self.app)

    #
    # Start the server.
    #
    def run(self):
        self.app.run(debug=True)

    #
    # Central get request handler for the application.
    #
    def get(self) -> Response:
        parameters = self.get_parameters()
        hikes = self.searcher.search(parameters)
        return jsonify(hikes)

    #
    # Parses search parameters from the current request's query parameters and returns them.
    #
    def get_parameters(self) -> SearchParameters:
        return SearchParameters(
            name=get_string_parameter("name"),
            origin=get_string_parameter("origin"),
            distance=get_integer_parameter("distance"),
            rating=get_integer_parameter("rating"),
            min_length=get_integer_parameter("min_length"),
            max_length=get_integer_parameter("max_length")
        )

#
# Gets a query parameter as a string from the current request.
#
def get_string_parameter(parameter: str) -> Union[str, None]:
    return request.args.get(parameter)

#
# Gets a query parameter as an integer from the current request.
#
def get_integer_parameter(parameter: str) -> Union[int, None]:
    value = request.args.get(parameter)
    if value is not None:
        try:
            return int(value)
        except ValueError:
            return None
    return None

server = Server(app)

@cross_origin
@app.route('/', methods=['GET'])
def get() -> Response:
    return server.get()
