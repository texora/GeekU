'use strict';

import '../shared/util/polyfill';
import express      from 'express';
import path         from 'path';
import bodyParser   from 'body-parser';
import courses      from './route/courses';
import students     from './route/students';
import * as GeekApp from './util/GeekApp';
import correlateLogsToTransaction from './util/correlateLogsToTransaction';
import Log          from '../shared/util/Log';

console.log('INFO: Starting GeekU Server.');

const app = GeekApp.createRunningApp('mongodb://localhost:27017/GeekU', 8080);

// correlates all log entries to a specific transication by including a unique transId in each log entry
// ?? HMMMM ... can't get continuation-local-storage to work (come back to this (punt for now))
// ?? still have BASIC enter/exit logs
app.use(correlateLogsToTransaction);

// handle Content-Type 'application/json' and 'text/plain' requests
app.use(bodyParser.json());
app.use(bodyParser.text());

// serve our static assets
const rootPath = path.join(__dirname, "../../public"); // LOG: rootPath: 'public' (sidebar: main.js __dirname: 'src\server')
app.use(express.static(rootPath));
// console.log(`INFO: main.js: static resources serverd from rootPath: '${rootPath}' (sidebar: main.js __dirname: '${__dirname}')`);

// allow cross site requests
app.use( (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// setup our various "API" modular routes
app.use('/', courses);
app.use('/', students);
// ... catch-all for /api
app.get('/api/*', (req, res, next) => {
  const msg = `Unrecognized API request: ${decodeURIComponent(req.originalUrl)}`;
  console.log(`WARN: main.js ${msg}`);
  next(new Error(msg).defineClientMsg(msg)
                     .defineCause(Error.Cause.RECOGNIZED_CLIENT_ERROR));
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



// ??? initial log testing VERY TEMP
Log.config({
  filter: {
    root:   Log.INFO, // 32, 'none', Log.OFF, null, ... various error conditions
    WowZee: Log.DEBUG,
  //WooWoo: Log.ERROR,
    WooWoo: 'DEBUG',
//  GeekApp: Log.TRACE: // to see detailed payloads returned
  }
});

const logWowZee = new Log('WowZee');
logWowZee.fatal( ()=>'Probe 1a TEST Object', logWowZee);
logWowZee.error( ()=>'Probe 2a TEST Date', new Date());
logWowZee.warn(  ()=>'Probe 3a');
logWowZee.info(  ()=>'Probe 4a');
logWowZee.debug( ()=>'Probe 5a');
logWowZee.trace( ()=>'Probe 6a');

// Log.allowErrorToVetoProbeEmission = false; // ??? VERY TEMP

const logWooWoo = new Log('WooWoo');
logWooWoo.fatal( ()=>'Probe 1a TEST Error', new Error('test error logging'));
logWooWoo.error( ()=>'Probe 2a TEST Error declining log', new Error('test error logging').defineCause(Error.Cause.RECOGNIZED_CLIENT_ERROR));
logWooWoo.warn(  ()=>'Probe 3a');
logWooWoo.info(  ()=>'Probe 4a');
logWooWoo.debug( ()=>'Probe 5a');
logWooWoo.trace( ()=>'Probe 6a');

console.log('??? at main end ...');
console.log(`??? current Log.config(): ${JSON.stringify(Log.config(), null, 2)}`);
