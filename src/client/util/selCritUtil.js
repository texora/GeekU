'use strict';

import crc        from 'crc';
import shortid    from 'shortid';
import Log        from '../../shared/util/Log';

const log = new Log('selCritUtil');

/**
 * Create a new Students selCrit object, with a unique key.
 *
 * @param {??type} param ?? do we support some additional initialiation variation
 *
 * @return {SelCrit} a new Students selCrit object.
 */
export function newStudentsSelCrit() {

  const selCrit = {
    key:    shortid.generate(),
    target: "Students",
    userId: "global",   // user the selCrit belongs to ('global' for all)

    name:   'New Student Selection',
    desc:   'from: Missouri/Indiana, ordered by: Graduation/Name',

    fields: [
      'gender',
      'firstName',
      'lastName',
      'studentNum',

      'graduation',
      
      'degree',
      'gpa',
      // 'birthday',
      // 'addr',
      // 'addr.state',
    ],

    sort: {
      graduation: -1,
      firstName: 1,
      lastName: 1,
    },
    distinguishMajorSortField: true,

    filter: { // all female students in MO/IN with GPA >= 3.65
//    "gender": "F",
      "addr.state": {
        "$in": [
          "Missouri",
          "Indiana"
        ]
      },
//    "gpa": {
//      "$gte": "3.65"
//    }
    },

    dbHash:  null,
    curHash: null,
  };

  // maintain our curHash
  selCrit.curHash = hashSelCrit(selCrit);

  return selCrit;
}


/**
 * Generate a hash for the supplied selCrit object.
 *
 * @param {SelCrit} selCrit the selCrit object to hash.
 *
 * @return {string} the hash representing the supplied selCrit object.
 */
export function hashSelCrit(selCrit) {
  const selCritStr = JSON.stringify(selCrit, (prop, val) => {
    if (prop === '_id'     || // key is maintained duplicatly as _id
        prop === 'curHash' ||
        prop === 'dbHash')
      return undefined; // omit non-vital attributes
    return val;
  });
  return crc.crc32(selCritStr).toString(16);
}
