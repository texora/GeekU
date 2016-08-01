'use strict';

import '../../../shared/util/polyfill';
import expect   from 'expect';
import SelCrit  from '../../../shared/util/SelCrit';

const userId  = 'selCritUnitTester';
const url     = 'http://localhost:8080/api/selCrit';
const headers = new Headers({
                  'Content-Type': 'application/json'
                });


// ***
// *** all /api/selCrit tests ...
// ***

describe('INTEGRATION /api/selCrit tests', function() {

describe('/api/selCrit SETUP CLEAR', function() {

  before( asyncDone => {

    // retrieve ALL selCrit test docs
    geekUFetch(`${url}?userId=${userId}`)
      .then( res => {
        const selCritList = res.payload;
        const delRequests = [];
        for (const selCrit of selCritList) {
          delRequests.push(
            geekUFetch(`${url}/${selCrit.key}`, {
              method: 'DELETE',
              headers
            }));
        }
        Promise.all(delRequests)
          .then( resp => {
            asyncDone();
          })
          .catch( err => {
            asyncDone(err);
          });
      })
      .catch( err => { // retrieve catch
        asyncDone(err);
      });

  });

  it('SETUP CLEAR Complete', () => {
  });

});




let newSelCritList = null;

describe('/api/selCrit SETUP INSERT', function() {

  before( asyncDone => {

    // insert 3 selCrit test docs
    const baseKey = 'U-TEST';
    const selCritTemplate = {...SelCrit.new(), ...{userId}};
    const insRequests = [];
    for (let i=1; i<=3; i++) {
      const key = `${baseKey}-${i}`;
      const newSelCrit = {...SelCrit.new(), ...{key, userId, name: `name ${i}`, desc: `desc ${i}`}};
      insRequests.push(
        geekUFetch(`${url}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify(newSelCrit)
        }));
    }
    Promise.all(insRequests)
      .then( resp => {

        // retrieve ALL newly inserted selCrit objects
        geekUFetch(`${url}?userId=${userId}`)
          .then( res => {
            newSelCritList = res.payload;
            asyncDone();
          })
          .catch( err => { // retrieve catch
            asyncDone(err);
          });

      })
      .catch( err => {
        asyncDone(err);
      });

  });
  
  it('SETUP INSERT Complete', () => {
    expect(newSelCritList).toExist('test selCrit objects do NOT exist in DB');
    expect(newSelCritList.length).toEqual(3, `expecting 3 selCrit objects, but found ${newSelCritList.length}`);
    expect(newSelCritList[2].desc).toEqual('desc 3');
  });

});




describe('/api/selCrit test UPDATE/SAVE', function() {

  let updatedSelCrit = null;

  before( asyncDone => {

    // update/save the 3rd sel criteria
    const selCrit = {...newSelCritList[2], desc: 'UPDATED DESC'};
    geekUFetch(`${url}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(selCrit)
    })
    .then( res => {
      updatedSelCrit = res.payload;
      asyncDone();
    })
    .catch( err => {
      asyncDone(err);
    });

  });

  it('validate selCrit update/save', () => {
    expect(updatedSelCrit).toExist();
    expect(updatedSelCrit.desc).toEqual('UPDATED DESC');
  });

});




describe('/api/selCrit test STALE SAVE', function() {

  let exception = null;

  before( asyncDone => {

    // save the 3rd sel criteria (from a stale image - accomplished in prior describe())
    const selCrit = {...newSelCritList[2], desc: 'EXPECTING STALE-DATE FAILURE'};
    geekUFetch(`${url}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(selCrit)
    })
    .then( res => {
      asyncDone();
    })
    .catch( err => {
      exception = err;
      asyncDone();
    });

  });
  
  it('validate STALE SAVE selCrit', () => {
    expect(exception).toExist('stale check should have recieved exception');
    expect(exception.message).toInclude('Stale data detected');
  });

});

});
