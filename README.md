# Haskell For Everyone
An easy-to-use educational editor for learning the Haskell programming language

## Project Structure

| Path | Directory | Description | 
| - | - | - |
| / | Root | Project source |
| /app | App | Electron/React files|
| /app/build | App built| Electron/React compiled React |
| /app/dist | App distribution | Compiled and packaged app |
| /app/public | App public | Electron/React public files |
| /app/src | App source |  Electron/React source |
| /server | Server | Server files |
| /server/build | Server built| Compiled server source |
| /server/src | Server source | TypeScript source code |
| /web | Web | Website files 

## Testing

While testing, any files created with the naming structure `*_test.hs` in the repository will be ignored by git.

## Setup & Installation 

#### Install Node.js (runtime + package manager)
Download and install [Node.js + npm](https://nodejs.org/en/)

#### Install dependencies  
There are 2 package files in the __root__ and __app__ folders. 

Install dependencies for both! 

##### Font Awesome

Before installing the `app` dependencies an `.npmrc` file with a FontAwesome Pro API key must be placed into the __app__ folder, otherwise it will not be installed.

```bash
# install dependencies
npm i && cd app && npm i

# nodemon global install
npm i -g nodemon 

# electron-cli global install
npm i -g electron-cli
```

##### React-Dev-Tools in Electron


Type this in the developer console to enable React dev tools.

```javascript
require('electron-react-devtools').install()
```

## Electron App 
\*\* Must be in __app/__ folder! \*\*

#### App environment variables
| Env Var | Example                       | Description             |
|---------|-------------------------------|-------------------------|
| WS_URI  | WS_URI=ws://192.168.1.25:8080 | Overrides websocket url |

#### App development mode
```bash
# cd app (if in root)
# terminal 1: electron dev mode
npm run dev
```
```bash
# cd app (if in root)
# terminal 2: react dev server
npm run react
```

## Server
\*\* Must be in __root__ folder! \*\*

#### Server environment variables
| Env Var      | Example         | Description                         |
|--------------|-----------------|-------------------------------------|
| PORT         | PORT=8080       | Server port for http and websockets |
| ROOM_POP_CAP | ROOM_POP_CAP=20 | Max connections per room            |

#### Server development mode 
```bash
# terminal 1: nodemon server
npm run dev 
```
```bash
# terminal 2: typescript compiler
npm run dev-ts
```
#### Server production mode 
```bash
# production server
npm start
```