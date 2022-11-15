This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app). To run the project locally, ensure to have npm on your machine and run `npm i` to install all the dependencies used.

## Project Directory

`/src` contains all the development directories and files for the app.

`/src/components` contains the components directories and files

`/src/images` contains the images files

`/src/tests` contains the test files.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `npm test`

Launches the test runner in the test mode.\

### `npm run build`

Builds the app for production to the `build` folder.\



ADD ON

if the app does not with npm start and build because of variations in node versions in the 

package.json replace your script with the following lines of code below 

 "scripts": {
    "start": "react-scripts --openssl-legacy-provider start",
    "build": "react-scripts --openssl-legacy-provider build",
    "test": "react-scripts test",
    "eject": "react-scripts eject",
    "cypress:open": "cypress open"
  },
