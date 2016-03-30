'use strict';

import '../shared/util/polyfill';
import express      from 'express';
import path         from 'path';
import bodyParser   from 'body-parser';
import courses      from './route/courses';
import students     from './route/students';
import * as GeekApp from './util/GeekApp';

console.log('INFO: Starting GeekU Server.');

const app = GeekApp.createRunningApp('mongodb://localhost:27017/GeekU', 8080);

// handle Content-Type 'application/json' and 'text/plain' requests
app.use(bodyParser.json());
app.use(bodyParser.text());


// serve our static assets
const rootPath = path.join(__dirname, "../../public"); // LOG: rootPath: 'public' (sidebar: main.js __dirname: 'src\server')
app.use(express.static(rootPath));
// console.log(`INFO: main.js: static resources serverd from rootPath: '${rootPath}' (sidebar: main.js __dirname: '${__dirname}')`);


// setup our various "API" modular routes
app.use('/', courses);
app.use('/', students);
// ... catch-all for /api
app.get('/api/*', (req, res, next) => {
  const msg = `Unrecognized API request: ${decodeURIComponent(req.originalUrl)}`;
  console.log(`WARN: main.js ${msg}`);
  next(new Error(msg).setClientMsg(msg).setCause(Error.Cause.RECOGNIZED_CLIENT_ERROR));
});


// send all other requests to index.html (so browserHistory in React Router works)
// ... this catch-all route should be last
app.get('*', function (req, res) {
  console.log('INFO: main.js: servicing all other requests!');
//res.sendFile(path.join(rootPath, 'index.html')); // TRY 1 ... TypeError: path must be absolute or specify root to res.sendFile
  res.sendFile('index.html', {root: rootPath});    // TRY 2 ... works with absolute resources (in index.html)
});


// register our common error handler
// ... handles BOTH "throw Error" and Express "next(err)"
// ... this registration must be last
app.use( GeekApp.commonErrorHandler );
