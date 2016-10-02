'use strict';

import '../../../shared/util/polyfill';
import expect       from 'expect';
import SelCrit      from '../../../shared/domain/SelCrit';
import itemTypes    from '../../../shared/domain/itemTypes';
import api          from '../../../shared/api';
import {setBaseUrl} from '../../../shared/api/baseUrl';

const userId  = 'selCritUnitTester';

setBaseUrl('http://localhost:8080');


// ***
// *** all /api/selCrit tests ...
// ***

describe('INTEGRATION /api/selCrit tests', function() {

  describe('/api/selCrit SETUP CLEAR', function() {

    before( asyncDone => {

      // retrieve ALL selCrit test docs
      api.filters.retrieveFilters(userId)
         .then( selCritList => {
           const delRequests = [];
           for (const selCrit of selCritList) {
             delRequests.push( api.filters.deleteFilter(selCrit) );
           }
           Promise.all(delRequests)
             .then( () => {
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
      const insRequests = [];
      for (let i=1; i<=3; i++) {
        const key = `${baseKey}-${i}`;
        const newSelCrit = {...SelCrit.new(itemTypes.student), ...{key, userId, name: `name ${i}`, desc: `desc ${i}`}};
        insRequests.push( api.filters.saveFilter(newSelCrit) );
      }
      Promise.all(insRequests)
        .then( () => {
  
          // retrieve ALL newly inserted selCrit objects
          api.filters.retrieveFilters(userId)
             .then( filters => {
               newSelCritList = filters;
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
  
      api.filters.saveFilter(selCrit)
         .then( savedSelCrit => {
           updatedSelCrit = savedSelCrit;
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
      api.filters.saveFilter(selCrit)
         .then( savedSelCrit => {
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
