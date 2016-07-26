'use strict';

import express        from 'express';
import * as MongoUtil from '../util/MongoUtil';
import Log            from '../../shared/util/Log';
import {hashSelCrit}  from '../../client/util/selCritUtil'; // ??? move this into shared

const log = new Log('GeekU.selCrit');

const selCrit = express.Router();


//***************************************************************************************************
//*** retrieve all selCrit documents: GET /api/selCrit[?userId=xxx]
//***
//***   - by default, all selCrit will be retrieved for userId=common.
//***
//***     NOTE: Client's should always protect the data (above) by using the
//***           encodeJsonQueryStr(queryName, jsonObj) utility.
//***           ... src/shared/util/QueryStrUtil.js
//***
//***************************************************************************************************

selCrit.get('/api/selCrit', (req, res, next) => {

  const userId = req.params.userId || 'common';

  // perform retrieval
  // ??? figure out how to do this
  // ? const selCritColl = req.geekU.db.collection('SelCrit');
  // ? selCritColl.find(selCrit.mongoFilter, selCrit.mongoFields)
  // ?             .sort(selCrit.mongoSort)
  // ?             .toArray()
  // ?             .then( selCrit => {
  // ?               res.geekU.send(selCrit);
  // ?             })
  // ?             .catch( err => {
  // ?               // communicate error ... sendError() will also log as needed
  // ?               res.geekU.sendError(err.defineClientMsg("Issue encountered in DB processing of /api/selCrit"),
  // ?                                   req);
  // ?             });
});


//******************************************************************************
//*** save a selCrit document: PUT /api/selCrit
//******************************************************************************

selCrit.put('/api/selCrit', (req, res, next) => {

  // glean the selCrit JSON object to save from the PUT body
  const selCrit = req.body;
  // ?? NOTE: This check may NOT be needed, as "Content-Type 'application/json' requests" (via bodyParser.json()) gens a minimum empty object {}
  // ?? need to determine what happens on other Content-Types and/or validate the content-type is json
  // ? if (!selCrit) { 
  // ?   const msg = 'ERROR: selCrit JSON object missing from PUT body';
  // ?   throw new Error(msg)
  // ?             .defineClientMsg(msg)
  // ?             .defineCause(Error.Cause.RECOGNIZED_CLIENT_ERROR);
  // ? }

  // validate the supplied selCrit JSON object
  if (!selCrit.key ||    // for now simply insure "some" of our required fields are supplied
      !selCrit.target ||
      !selCrit.userId ||
      !selCrit.name ||
      !selCrit.desc) {
    const msg = 'ERROR: invalid selCrit JSON object supplied in PUT body (missing required fields)';
    throw new Error(msg)
          .defineClientMsg(msg) // ??? test if needed
          .defineCause(Error.Cause.RECOGNIZED_CLIENT_ERROR); // ??? test if needed
  }

  // massage selCrit to conform to certain restrictions
  selCrit._id = selCrit.key; // ... force _id to be same as key

  // reset our hash
  selCrit.dbHash = selCrit.curHash = hashSelCrit(selCrit);
  
  // save the selCrit
  log.debug(()=> `saving supplied selCrit: ${JSON.stringify(selCrit, null, 2)}`);
  const selCritColl = req.geekU.db.collection('SelCrit');
  console.log(`??? issuing findOneAndReplace`);

  selCritColl
    .findOneAndReplace({ key: selCrit.key }, // filter // ??? really use _id
                       selCrit,              // replacement
                       {                     // options 
                         upsert: true,       //   insert if NOT found ... NOTE: if we ever do stale data checking (via lastMod), we would NEED to use seperate op for add[insertOne()] and update[findOneAndReplace()]
                         returnOriginal: false, // return the newly updated document
                       })
    .then( result => {
      console.log(`??? save selCrit returned ... result: ${JSON.stringify(result, null, 2)}`);
      const newSelCrit = result.value;  // ??? result; // ??? .payload; // ??? result.payload.value;
      console.log(`??? save selCrit returned ... newSelCrit: ${JSON.stringify(newSelCrit, null, 2)}`);
      res.geekU.send(newSelCrit); // ??? is this what we want to do? ??? Mark is sending a URL to this resource
    })
    .catch( err => {
      // communicate error ... sendError() will also log as needed
      res.geekU.sendError(err.defineClientMsg("Issue encountered in DB save of /api/selCrit"),
                          req);
    });

});


export default selCrit;
