'use strict';

import express       from 'express';
import {MongoClient} from 'mongodb';


//***
//*** Create/return a new express app, and start it once our MongoDB
//*** connection has been established (asynchronously).
//***

export default function createRunningAppBoundToDb(dbUrl='mongodb://localhost:27017/GeekU', appPort=8080) {

  // create our express app
  const app = express();

  // obtain our MongoDB connection
  let _db = null;
  MongoClient.connect(dbUrl)
    .then( db => {

      // retain our db connection (to inject into each request)
      _db = db;

      // start our app, now that we have our db connection
      app.listen(appPort, () => {
        console.log('INFO: createRunningAppBoundToDb(): DB connection established, and app is listening on port: ' + appPort);
      });
      
    })
    .catch( err => {
      console.log('ERROR: Could not access our MongoDB connection: ' + err.stack);
      if (err.name === 'MongoError' && // ??? test this out
          err.message.includes('ECONNREFUSED')) {
            console.error('NOTE: The MongoDB server may not be running.');
      }
      throw err; // ??? is this right?
    });

  // promote (i.e. bind) our db connection to the request object
  app.use( (req, res, next) => {
    req.db = _db;
    next();
  });

  // that's all folks :-)
  return app;
}
