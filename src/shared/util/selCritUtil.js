'use strict';

import crc        from 'crc';
import shortid    from 'shortid';
import Log        from './Log';

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

    _id:    null,               // the mongo db ID ... when persisted: same as key ... when NOT persisted: null
    key:    shortid.generate(), // the unique key identifying each selCrit instance (see _id) ... NOTE: selCrit objects can be temporal (NOT persisted), so key is important
    userId: "common",           // the user the selCrit belongs to ('common' for all)
    target: "Students",
    lastDbModDate: null,        // the last DB modified date/time (used for persistence stale check) ... when NOT persisted: null

    name:   'New Student Selection',
    desc:   'bla bla bla',

    fields: [
      "gender",
      "firstName",
      "lastName",
      "studentNum",
      "graduation",
      "degree",
      "gpa"
    ],
    sort: [
      "-graduation",
      "firstName",
      "lastName"
    ],
    distinguishMajorSortField: true,
    filter: [
      {field: "gender",     op: "$eq",  value: "F"},
      {field: "addr.state", op: "$in",  value: ["Missouri","Indiana"]},
      {field: "gpa",        op: "$qte", value: "3.65"}
    ],

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
    if (prop === '_id'           || // for persistence mechanism only (the 'key' attribute ALWAYS has this instance identifier)
        prop === 'lastDbModDate' || // for persistence mechanism only
        prop === 'curHash'       || // hashes are duplicate representations of real data
        prop === 'dbHash')
      return undefined; // omit non-vital attributes
    return val;
  });
  return crc.crc32(selCritStr).toString(16);
}
