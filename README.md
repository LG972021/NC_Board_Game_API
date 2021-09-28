Hello, and thank you for looking at my api.

You can find a hosted version of the api here: https://nc-board-game-reviewing.herokuapp.com/api/

This is an api that interacts with a database containing tables for boardgame reviews, users of the api, comments on reviews, and categories of boardgames.
GET, POST and PATCH Requests can be made to the api. to view, organise, and modify the data in these tables.

<h2>Cloning</h2>

To clone this project, please follow the instructions below:

    - Open a browser and go to https://github.com/LG972021/NC_Board_Game_API
    - In the Repo, in the code/clone menu, copy the URL.
    - Create a new directory on your machine for the repo.
    - Use the git clone command in your command line using the copied URL (git clone https://github.com/********/NC_Board_Game_API.git)
    - Navigate to the directory you copied the project to.
    - USe the code . command to enter VS Code for this project.

<h2>Installing Dependencies</h2>

To install the dependencies this project relies on, please follow the instructions below:

     In the VS Code terminal
        -run the command 'npm i'

To install the jest-sorted dev - dependency this project's tests rely on, please follow the instructions below:

    In the VS Code terminal
        -run the command 'npm install --save-dev jest-sorted'

    In the project package.json
        -add "devDependencies": {"jest-sorted": "^1.0.12"},

<h2>Database setup</h2>

To allow the api to connect to a database (Test, Development, Production), please follow the instructions below:

    - Create a file in the project root named .env.development.
    - Add "PGDATABASE=nc_games" into .env.development.

    - Create a file in the project root named .env.test.
    - Add "PGDATABASE=nc_games_test" into .env.development.

To install the local database that this project uses, please follow the instructions below:

     In the VS Code terminal
    - run the command "npm run setup-dbs"
    - run the command "npm run seed"

<h2>Testing</h2>

To run the test files this project uses created with Jest, please follow the instructions below:

     In the VS Code terminal
    - run the command "npm test"

<h2>Requirements</h2>

The version of Node.js and Postgres usex to create this project, and thus, the minimum versions of Node.js and Postgres required to reliably run this project are:

    - Node.js - v16.6.1

    - Postgres - psql (PostgreSQL) 12.8 (Ubuntu 12.8-0ubuntu0.20.04.1)

Thank you again for looking at my API project.
