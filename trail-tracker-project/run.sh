#!/usr/bin/env bash

#
# This script is just a shorthand to start the server at server.py.
#

directory=$(pwd)
export FLASK_APP=${directory}/server.py
flask run