'use strict';

/**
 * Promotes various meta data for the Students MongoDB collection.
 */

//***
//*** Public API
//***

const studentsMeta = {

  // valid fields that make up the Students collection
  validFields: {
    '_id':         '_id',
    'studentNum':  'studentNum',
    'gender':      'gender',
    'firstName':   'firstName',
    'lastName':    'lastName',
    'birthday':    'birthday',
    'phone':       'phone',
    'email':       'email',
    'addr':        'addr',       // when addr only emitted, all sub-fields are included
    'addr.line1':  'addr.line1', // can emit individual sub-field (ex: 'addr.state': true)
    'addr.line2':  'addr.line2',
    'addr.city':   'addr.city',
    'addr.state':  'addr.state',
    'addr.zip':    'addr.zip',
    'gpa':         'gpa',
    'graduation':  'graduation',
    'degree':      'degree'
  },

  // default fields to display in a Students retrieval (a mongo projection)
  defaultDisplayFields: {
    '_id':         false,
    'studentNum':  true,
    'gender':      true,
    'firstName':   true,
    'lastName':    true,
    'birthday':    true,
    'gpa':         true,
    'graduation':  true,
    'degree':      true
  },

};
export default studentsMeta;
