'use strict';

import crc        from 'crc';
import shortid    from 'shortid';
import assert     from 'assert';
import Log        from './Log';

const log = new Log('SelCrit');

/**
 * SelCrit provides a number of utilities in support of the selCrit
 * JSON structure.  In essance it is a pseudo class definition for
 * selCrit (as close as we can get for a JSON structure).
 */
const SelCrit = {

  /**
   * Create a new selCrit object, with a unique key.
   *
   * @param {string} target the targeted mongo DB collection
   * ('Students' or 'Courses').
   *
   * @return {SelCrit} a new selCrit object.
   */
  new(target) {

    assert(target === 'Students' || target === 'Courses',
           `SelCrit.new() supplied target '${target}' is invalid, expecting 'Students' or 'Courses'`);
    
    const selCrit = {

      _id:    null,               // the mongo db ID ... when persisted: same as key ... when NOT persisted: null
      key:    shortid.generate(), // the unique key identifying each selCrit instance (see _id) ... NOTE: selCrit objects can be temporal (NOT persisted), so key is important
      userId: 'common',           // the user the selCrit belongs to ('common' for all)
      target,                     // Students/Courses
      lastDbModDate: null,        // the last DB modified date/time (used for persistence stale check) ... when NOT persisted: null

      name:   `New SelCrit ${++_nextNewNum}`, // REQUIRED: when created within interactive edit, this will be validated
      desc:   '',                             // ... dito name

      fields: [],
   // fields: [
   //   'gender',
   //   'firstName',
   //   'lastName',
   //   'studentNum',
   //   'graduation',
   //   'degree',
   //   'gpa'
   // ],
      sort: [],
   // sort: [
   //   '-graduation',
   //   'firstName',
   //   'lastName'
   // ],
      distinguishMajorSortField: false,
      filter: [],
   // filter: [
   //   {field: 'gender',     op: 'EQ',  value: 'F'},
   //   {field: 'addr.state', op: 'IN',  value: ['Missouri','Indiana']},
   //   {field: 'gpa',        op: 'GTE', value: '3.65'}
   // ],

      dbHash:  null,
      curHash: null,
    };

    // maintain our curHash
    selCrit.curHash = SelCrit.hash(selCrit);

    return selCrit;
  },


  /**
   * Duplicate the suplied selCrit object, with the appropriate adjustments.
   *
   * @param {SelCrit} selCrit the selCrit object to duplicate.
   *
   * @return {SelCrit} a new selCrit object, copied from the supplied selCrit.
   */
  duplicate(selCrit) {

    // duplicate the suplied obj
    const dupSelCrit = JSON.parse( JSON.stringify(selCrit) );


    // adjust the appropriate attributes
    dupSelCrit._id           = null;
    dupSelCrit.key           = shortid.generate();
    dupSelCrit.lastDbModDate = null;
    dupSelCrit.name          = selCrit.name + ' Copy';
    dupSelCrit.desc          = selCrit.desc + ' Copy';
    dupSelCrit.dbHash        = null;
    dupSelCrit.curHash       = SelCrit.hash(selCrit);

    return dupSelCrit;
  },


  /**
   * Validate the supplied selCrit object.
   *
   * @param {SelCrit} selCrit the selCrit object to validate.
   *
   * @return {string} a message indicating a validation problem, null for valid
   */
  validate(selCrit) {

    // validate individual attributes
    let problems = [];

    // ... key
    if (!selCrit.key.trim())
      problems.push('key is required');

    // ... target
    if (!selCrit.target.trim())
      problems.push('target is required');
    if (selCrit.target !== 'Students' && selCrit.target !== 'Courses')
      problems.push("target must be one of 'Students' or 'Courses'");

    // ... userId
    if (!selCrit.userId.trim())
      problems.push('userId is required');

    // ... name
    if (!selCrit.name.trim())
      problems.push('name is required');

    // ... desc
    if (!selCrit.desc.trim())
      problems.push('desc is required');

    // ... filter
    for (const filterObj of (selCrit.filter || [])) {
      if (!filterObj.op ||
          !filterObj.value ||
          filterObj.value.length === 0)
        problems.push('filter is missing some information');
    }

    // return results
    return problems.length === 0
             ? null // valid
             : `Invalid selCrit ... ${problems.join(', ')}`;
  },


  /**
   * Return an indicator as to whether the current content of 
   * selCrit has been saved.
   *
   * @param {SelCrit} selCrit the selCrit to evaluate.

   * @return {boolean} true: has been saved, false: needs to be saved
   */
  isCurrentContentSaved(selCrit) {
    return selCrit.dbHash === selCrit.curHash;
  },

  /**
   * Return an indicator as to whether the current content of 
   * selCrit needs to be saved. 
   *
   * Opposite of isCurrentContentSaved()
   *
   * @param {SelCrit} selCrit the selCrit to evaluate.

   * @return {boolean} true: needs to be saved, false: has been saved
   */
  needsSaving(selCrit) {
    return selCrit.dbHash !== selCrit.curHash;
  },

  /**
   * Return an indicator as to whether the supplied selCrit has ever
   * been persisted (irrespective to whether it currently needs to be
   * saved).
   *
   * @param {SelCrit} selCrit the selCrit to evaluate.

   * @return {boolean} true: has been persisted, false: never been persisted
   */
  isPersisted(selCrit) {
    return selCrit.dbHash ? true : false;
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
      if (prop === '_id'           || // for persistence mechanism only (the 'key' attribute ALWAYS identifies this instance)
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

let _nextNewNum = 0;
