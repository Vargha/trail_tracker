from whoosh.fields import Schema, TEXT, KEYWORD, STORED

#
# Schema used to index the database. The original tuple (minus the zip codes) is stored in the data attribute.
#
SCHEMA = Schema(name=TEXT(stored=False),
                zips=KEYWORD(stored=False),
                data=STORED())
