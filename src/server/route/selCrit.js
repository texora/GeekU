'use strict';

import express        from 'express';
import assert         from 'assert';
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
//***************************************************************************************************

selCrit.get('/api/selCrit', (req, res, next) => {

  const userId = req.query.userId || 'common';

  const mongoQuery      = {userId};   // for supplied userId
  const mongoProjection = {};         // all fields
  const mongoSort       = {target: 1, name: 1, desc: 1};

  // perform retrieval
  const selCritColl = req.geekU.db.collection('SelCrit');
  selCritColl.find(mongoQuery, mongoProjection)
              .sort(mongoSort)
              .toArray()
              .then( selCrit => {
                res.geekU.send(selCrit);
              })
              .catch( err => {
                // communicate error ... sendError() will also log as needed
                res.geekU.sendError(err.defineClientMsg("Issue encountered in DB processing of /api/selCrit"),
                                    req);
              });
});



//******************************************************************************
//*** retrieve individual selCrit: /api/selCrit/:key
//***   - when selCrit is Not Found, a 404 status is returned (Not Found)
//******************************************************************************

selCrit.get('/api/selCrit/:key', (req, res, next) => {

  const key = req.params.key;

  const mongoQuery      = {_id: key};
  const mongoProjection = {}; // all fields

  // perform retrieval
  const selCritColl = req.geekU.db.collection('SelCrit');
  selCritColl.findOne(mongoQuery, mongoProjection)
             .then( selCrit => {
               if (selCrit) {
                 res.geekU.send(selCrit);
               }
               else {
                 res.geekU.sendNotFound();
               }
             })
             .catch( err => {
               // communicate error ... sendError() will also log as needed
               res.geekU.sendError(err.defineClientMsg("Issue encountered in DB processing of /api/selCrit"),
                                   req);
             });

});



//******************************************************************************
//*** save a selCrit document: PUT /api/selCrit
//******************************************************************************

selCrit.put('/api/selCrit', (req, res, next) => {

  // glean the selCrit JSON object to save from the PUT body
  const selCrit = req.body;
  // NOTE: This check is NOT be needed, as "Content-Type 'application/json' requests" (via bodyParser.json()) gens a minimum empty object {}
  // ?? need to determine what happens on other Content-Types and/or validate the content-type is json
  // ? if (!selCrit) { 
  // ?   const msg = 'ERROR: selCrit JSON object missing from PUT body';
  // ?   throw new Error(msg)
  // ?             .defineClientMsg(msg)
  // ?             .defineCause(Error.Cause.RECOGNIZED_CLIENT_ERROR);
  // ? }


  //***
  //*** validate the supplied selCrit JSON object
  //***

  // for now simply insure "some" of our required fields are supplied ?? could do more in selCritUtil.js ... validateSelCrit(selCrit): msg ... null for OK
  if (!selCrit.key ||
      !selCrit.target ||
      !selCrit.userId ||
      !selCrit.name ||
      !selCrit.desc) {
    const msg = 'ERROR: invalid selCrit JSON object supplied in PUT body (missing required fields)';
    throw new Error(msg) // ??? TEST (WORKS): by adding non-existent field (above)
                .defineClientMsg(msg)
                .defineCause(Error.Cause.RECOGNIZED_CLIENT_ERROR);
  }

  //***
  //*** massage selCrit to conform to certain restrictions
  //***

  // before we alter our selCrit, retain the directive of what save should do (insert/update)
  const directive = selCrit._id ? 'update' : 'insert';

  // force _id to be same as key
  selCrit._id = selCrit.key;

  // reset our lastDbModDate
  let prior_lastDbModDate = selCrit.lastDbModDate; // eventually used in our filter (below)
  if (prior_lastDbModDate) prior_lastDbModDate = new Date(prior_lastDbModDate); // ??? temp till we are passing a real date around (programatically)
  selCrit.lastDbModDate = new Date();

  // reset all our hashes
  // ... by persisting the hashes, they will be accurate on retrievals
  selCrit.dbHash = selCrit.curHash = hashSelCrit(selCrit);

  
  //***
  //*** save the selCrit
  //***

  const selCritColl = req.geekU.db.collection('SelCrit');

  // first technique using insertOne() / updateOne()
  // ... mutually exclusive of below
  // insert (on first save)
  if (directive==='insert') {
  
    log.debug(()=> `selCrit save (via INSERT) selCrit: ${JSON.stringify(selCrit, null, 2)}`);
    selCritColl
      .insertOne(selCrit)
      .then( result => {
        // unsure if there is anything to check ... my experience:
        //  - all problems are caught in the err handler (including dup key, etc.)
        // HOWEVER, just for fun (see: https://docs.mongodb.com/manual/reference/command/insert/#output)
        //  - this shit is under result.result
        //    * ok: 1 ... the status of the command
        //    * n: 1 .... the number of documents inserted
        //  - out of the blue here are the items that actually shows up
        //    * insertedCount
        if (result.insertedCount !== 1) { // ??? TEST WORKS: by changing condition
          throw new Error(`selCrit save (INSERT) unexpected result insertedCount: ${result.insertedCount} (expected 1)`);
        }
        const newSelCrit = selCrit; // NOTE: unsure if insertOne() operation can return the newly inserted doc (in this case we control the entire doc, so it's a moot point)
        res.geekU.send(newSelCrit);
      })
      .catch( err => {
        // communicate error ... sendError() will also log as needed
        res.geekU.sendError(err.defineClientMsg("Issue encountered in DB save of /api/selCrit"),
                            req);
      });
  
  }
  
  // update (on subsequent saves)
  else {
  
    log.debug(()=> `selCrit save (via UPDATE) selCrit: ${JSON.stringify(selCrit, null, 2)}`);
    selCritColl
      .updateOne({_id: selCrit._id,                    // filter:
                  lastDbModDate: prior_lastDbModDate}, // with stale data check
                 selCrit)
      .then( result => {
        // stale data check (see: https://docs.mongodb.com/manual/reference/command/update/#output)
        //  - this shit is under result.result
        //    * ok:        1 ... the status of the command
        //    * n:         1 ... the number of documents SELECTED for change
        //    * nModified: 1 ... number of document actually updated (i.e. doc changed)
        //  - out of the blue here are the items that actually shows up
        //    * matchedCount
        //    * modifiedCount
        if (result.matchedCount !== 1 || result.modifiedCount !== 1) { // ??? TEST (WORKS): via a real stale data
          res.geekU.sendError(new Error(`selCrit save (via UPDATE) stale data check ... result matchedCount: ${result.matchedCount} (expected 1),  modifiedCount: ${result.modifiedCount} (expected 1)`)
                                    .defineClientMsg("Stale data detected in DB save of /api/selCrit")
                                    .defineCause(Error.Cause.RECOGNIZED_CLIENT_ERROR),
                              req);
          return;
        }
        const newSelCrit = selCrit; // NOTE: unsure if updateOne() operation can return the newly inserted doc (in this case we control the entire doc, so it's a moot point)
        res.geekU.send(newSelCrit);
      })
      .catch( err => {
        // communicate error ... sendError() will also log as needed
        res.geekU.sendError(err.defineClientMsg("Issue encountered in DB save of /api/selCrit"),
                            req);
      });
  
  }

  // alternate technique that can insert/update in one operation (findOneAndReplace)
  // ... mutually exclusive of above
  // ? log.debug(()=> `selCrit save (via findOneAndReplace()) selCrit: ${JSON.stringify(selCrit, null, 2)}`);
  // ? const filter = {
  // ?   _id: selCrit._id  // locate existing doc
  // ? };
  // ? const options = {
  // ?   returnOriginal: false // return the newly updated document
  // ? };
  // ? if (directive==='insert') { // when inserting ...
  // ?   options.upsert = true;    //  ... insert doc (as it will be not-found)
  // ? }
  // ? else {                                        // when updating ... 
  // ?   filter.lastDbModDate = prior_lastDbModDate; // ... include stale-data-check in our filter
  // ? }
  // ? selCritColl
  // ?   .findOneAndReplace(filter,
  // ?                      selCrit, // replacement doc
  // ?                      options)
  // ?   .then( result => {
  // ?     // stale data check
  // ?     //  - lastErrorObject.n: 1 ... the number of documents impacted
  // ?     //  - value:               ... either up-to-date object -OR- null null when no documentrecord impacted
  // ?     if (result.lastErrorObject.n !== 1) { // ??? TEST (WORKS): via a real stale data
  // ?       res.geekU.sendError(new Error(`selCrit save (REPLACE) stale data check ... result n: ${result.n} (expected 1)`)
  // ?                                 .defineClientMsg("Stale data detected in DB save of /api/selCrit")
  // ?                                 .defineCause(Error.Cause.RECOGNIZED_CLIENT_ERROR),
  // ?                           req);
  // ?       return;
  // ?     }
  // ?     const newSelCrit = result.value;
  // ?     res.geekU.send(newSelCrit);
  // ?   })
  // ?   .catch( err => {
  // ?     // communicate error ... sendError() will also log as needed
  // ?     res.geekU.sendError(err.defineClientMsg("Issue encountered in DB save of /api/selCrit"),
  // ?                         req);
  // ?   });

});



//******************************************************************************
//*** delete individual selCrit: /api/selCrit/:key
//******************************************************************************

selCrit.delete('/api/selCrit/:key', (req, res, next) => {

  const key = req.params.key;

  const mongoQuery = {_id: key};

  // perform deletion
  const selCritColl = req.geekU.db.collection('SelCrit');
  selCritColl.remove(mongoQuery)
             .then( result => {
               if (result.result.n !== 1) {
                 const msg = `selCrit delete key: '${key}' record NOT FOUND`;
                 res.geekU.sendError(new Error(msg)
                                           .defineClientMsg(msg)
                                           .defineCause(Error.Cause.RECOGNIZED_CLIENT_ERROR),
                                     req);
               }
               else {
                 res.geekU.send();
               }
             })
             .catch( err => {
               // communicate error ... sendError() will also log as needed
               res.geekU.sendError(err.defineClientMsg(`Issue encountered in delete DB processing of /api/selCrit key: ${key}`),
                                   req);
             });
});

export default selCrit;
