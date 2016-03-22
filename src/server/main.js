'use strict';

import '../shared/util/polyfill';
import express    from 'express';
import path       from 'path';
import bodyParser from 'body-parser';
import createRunningAppBoundToDb from './util/appDb';
import courses    from './route/courses';

const app = createRunningAppBoundToDb('mongodb://localhost:27017/GeekU', 8080);

// handle Content-Type 'application/json' and 'text/plain' requests
app.use(bodyParser.json());
app.use(bodyParser.text());

// serve our static assets
const rootPath = path.join(__dirname, "../../public"); // LOG: rootPath: 'public' (sidebar: main.js __dirname: 'src\server')
app.use(express.static(rootPath));
// console.log(`INFO: main.js: static resources serverd from rootPath: '${rootPath}' (sidebar: main.js __dirname: '${__dirname}')`);

// setup our various "API" modular routes
app.use('/', courses);

// catch-all for /api
courses.get('/api/*', (req, res) => {
  console.log('ERROR: UNRECOGNIZED api/ request!'); // ??? figure out how to enumerate what this was
  res.status(500).send("??? UNRECOGNIZED api/ request"); // ??? from Mark
});

// send all other requests to index.html (so browserHistory in React Router works)
// ... this catch-all route should be last
app.get('*', function (req, res) {
  console.log('INFO: main.js: servicing all other requests!');
//res.sendFile(path.join(rootPath, 'index.html')); // TRY 1 ... TypeError: path must be absolute or specify root to res.sendFile
  res.sendFile('index.html', {root: rootPath});    // TRY 2 ... works with absolute resources (in index.html)
});
