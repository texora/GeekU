'use strict';

import crc        from 'crc';
import shortid    from 'shortid';
import assert     from 'assert';
import itemTypes  from '../model/itemTypes';
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
   * @param {string} itemType the itemType for which this selCrit will operate
   * ... one of itemTypes constants (ex: 'student' or 'course').
   *
   * @return {SelCrit} a new selCrit object.
   */
  new(itemType) {

    assert(itemTypes.meta.allTypes.includes(itemType),
           `SelCrit.new() supplied itemType '${itemType}' is invalid, expecting one of ${itemTypes.meta.allTypes}`);
    
    const selCrit = {

      _id:    null,               // the mongo db ID ... when persisted: same as key ... when NOT persisted: null
      key:    shortid.generate(), // the unique key identifying each selCrit instance (see _id) ... NOTE: selCrit objects can be temporal (NOT persisted), so key is important
      userId: 'common',           // the user the selCrit belongs to ('common' for all)
      itemType,                   // 'student'/'course'
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
   * Return an indicator as to whether th supplied obj is a SelCrit object.
   *
   * @param {SelCrit} obj the object to evaluate.
   *
   * @return {boolean} true: is SelCrit, false: is NOT SelCrit
   */
  isSelCrit(obj) {
    // ... cheap duck type checking
    return obj.key && obj.itemType && obj.userId && obj.name && obj.desc;
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

    // ... itemType
    if (!selCrit.itemType.trim())
      problems.push('itemType is required');
    // TODO: WHY ON SERVER CODE is Array.prototype.includes() is NOT THERE?
    if (itemTypes.meta.allTypes.indexOf(selCrit.itemType) < 0)
      problems.push(`invalid itemType '${selCrit.itemType}' must be one of ${itemTypes.meta.allTypes}`);

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
    // hash is defined on app-level fields in a consistent order
    // ... NOT persistence-fields (_id, lastDbModDate)
    // ... NOT hashes:            (curHash, dbHash)
    let hash = crc.crc32("SelCrit:hash");
    hash = crc.crc32(selCrit.key,      hash);
    hash = crc.crc32(selCrit.userId,   hash);
    hash = crc.crc32(selCrit.itemType, hash);
    hash = crc.crc32(selCrit.name,     hash);
    hash = crc.crc32(selCrit.desc,     hash);
    hash = crc.crc32(JSON.stringify(selCrit.fields), hash);
    hash = crc.crc32(JSON.stringify(selCrit.sort),   hash);
    hash = crc.crc32(JSON.stringify(selCrit.distinguishMajorSortField), hash);
    hash = crc.crc32(JSON.stringify(selCrit.filter), hash);
    hash = hash.toString(16);
    return hash;
  },


  /**
   * Return an indicator as to whether the two supplied selCrit
   * objects are equivalent, considering application data content.
   *
   * @param {SelCrit} scA the first selCrit object to compare.
   * @param {SelCrit} scB the second selCrit object to compare.
   *
   * @return {boolean} true: supplied selCrit objects are equivalent,
   * false: not equivalent.
   */
  isEqual(scA, scB) {
    // our hash covers all application data
    // NOTE: OR semantics covers unsupplied objs
    //       - NOT-EQUAL when one obj supplied and the other NOT
    //       - EQUAL when both have not been supplied (NOTE: equates null/undefined, but that is OK)
    return (scA || {}).curHash === (scB || {}).curHash;
  },


  /**
   * Return an indicator as to whether the two supplied selCrit
   * objects are fully equivalent, considering BOTH application
   * data content AND persistance status.
   *
   * @param {SelCrit} scA the first selCrit object to compare.
   * @param {SelCrit} scB the second selCrit object to compare.
   *
   * @return {boolean} true: supplied selCrit objects are equivalent,
   * false: not equivalent.
   */
  isFullyEqual(scA, scB) {
    // utilize BOTH hashes considering BOTH application data content AND persistance status
    // NOTE: OR semantics covers unsupplied objs
    //       - NOT-EQUAL when one obj supplied and the other NOT
    //       - EQUAL when both have not been supplied (NOTE: equates null/undefined, but that is OK)
    scA = scA || {};
    scB = scB || {};
    return scA.curHash === scB.curHash && scA.dbHash === scB.dbHash;
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
