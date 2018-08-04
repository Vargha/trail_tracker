# trail_tracker
A Web Directory with All Trails and their info in Oregon and Washington


To directly run the code see below...

The code for this project is divided into a frontend webpage and a backend API server.
Both parts are git repos so you can check out the history if you like.

To run the backend API server:
    1. Go into trail-tracker-project.
    2. Install all dependencies listed in requirements.txt.
    3. Run create_index.py to regenerate the index, temporary files may be missing otherwise.
    4. Run the bash script "run.sh". (A shortcut that runs server.py)
    5. Open up a browser on localhost:5000 and you should get a JSON response with an empty array. 
       You can use the server directly via the query parameters listed in the report.

To run the frontend:
    1. Install NodeJS (node) and Node Package Manager (npm) if you don't already have them installed.
    2. Go into trail-tracker-frontend.
    3. Enter and run "npm install" to install all dependencies.
    4. Enter and run "npm start" to run the frontend on port 3000.
    5. A browser should open for you and you should see the frontend.

As long as the backend is running locally on localhost:5000, the frontend (when run locally) will use the
local server on port 5000.
If you have any issues running the code contact: jakeploskey@gmail.com

:::DATABASE:::

- The JSON database is stored at tracker-tracker-project/database.
- It's broken into separate folders containing files named "hikes.json." 
  The JSON data in each of these files is merged during indexing.

:::DATABASE INDEX:::

- The database index is stored at trail-tracker-project/database-index.

- To regenerate the index run "create_index.py" at the root directory of the project.
  This builds the index from the "database" directory.

IMPORTANT NOTES:

- Because the index is under git source control I HIGHLY RECOMMEND you regenerate the index.
  Whoosh generates alot of temporary files and they may not be available unless you run create_index.py.

- When testing the deployed application there may be wait times of about 15 seconds or so while Heroku
  wakes the application up from sleep. This includes the frontend and the backend so the first query 
  you submit on the frontend may have a long wait time. It should be pretty quick after that.
