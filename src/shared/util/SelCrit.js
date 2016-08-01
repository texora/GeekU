'use strict';

import crc        from 'crc';
import shortid    from 'shortid';
import Log        from './Log';

const log = new Log('SelCrit');

/**
 * SelCrit provides a number of utilities in support of the selCrit
 * JSON structure.  In essance it is a pseudo class definition for
 * selCrit (as close as we can get for a JSON structure).
 */
const SelCrit = {

  /**
   * Create a new Students selCrit object, with a unique key.
   *
   * @param {??type} param ?? do we support some additional initialiation variation
   *
   * @return {SelCrit} a new Students selCrit object.
   */
  new() {

    // TODO: make this truely an empty object
    // TODO: consider param usage that can vary some things

    const selCrit = {

      _id:    null,               // the mongo db ID ... when persisted: same as key ... when NOT persisted: null
      key:    shortid.generate(), // the unique key identifying each selCrit instance (see _id) ... NOTE: selCrit objects can be temporal (NOT persisted), so key is important
      userId: 'common',           // the user the selCrit belongs to ('common' for all)
      target: 'Students',
      lastDbModDate: null,        // the last DB modified date/time (used for persistence stale check) ... when NOT persisted: null

      name:   '', // REQUIRED: when created within interactive edit, this will be validated
      desc:   '', // ... dito name

      fields: [
        'gender',
        'firstName',
        'lastName',
        'studentNum',
        'graduation',
        'degree',
        'gpa'
      ],
      sort: [
        '-graduation',
        'firstName',
        'lastName'
      ],
      distinguishMajorSortField: true,
      filter: [
        {field: 'gender',     op: 'EQ',  value: 'F'},
        {field: 'addr.state', op: 'IN',  value: ['Missouri','Indiana']},
        {field: 'gpa',        op: 'GTE', value: '3.65'}
      ],

      dbHash:  null,
      curHash: null,
    };

    // maintain our curHash
    selCrit.curHash = hashSelCrit(selCrit);

    return selCrit;
  },


  /**
   * Calculate the hash for the supplied selCrit object.
   *
   * @param {SelCrit} selCrit the selCrit object to hash.
   *
   * @return {string} the hash representing the supplied selCrit object.
   */
  hash(selCrit) {
    const selCritStr = JSON.stringify(selCrit, (prop, val) => {
      if (prop === '_id'           || // for persistence mechanism only (the 'key' attribute ALWAYS has this instance identifier)
          prop === 'lastDbModDate' || // for persistence mechanism only
          prop === 'curHash'       || // hashes are duplicate representations of real data
          prop === 'dbHash')
        return undefined; // omit non-vital attributes
      return val;
    });
    return crc.crc32(selCritStr).toString(16);
  },

  /**
   * Concise definition of valid selCrit.filter operators, 
   * providing a translation from neutral-op to mongo-op.
   */
  filterOps: {
    EQ:  '$eq',
    GT:  '$gt',
    GTE: '$gte',
    LT:  '$lt',
    LTE: '$lte',
    NE:  '$ne',
    IN:  '$in'
  },

}

export default SelCrit;
