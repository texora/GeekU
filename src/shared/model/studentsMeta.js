'use strict';

/**
 * Promotes various meta data for the Students MongoDB collection.
 */

//***
//*** Public API
//***

const studentsMeta = {

  // valid fields that make up the Students collection
  // ... from a validation perspective, a non-existent entry (fieldLabel of undefined)
  // ... a value of null (i.e. null fieldLabel) is NOT publically promoted in user-defined selCrit
  validFields: {
//  fieldName (DB):  fieldLabel (null for non-public)
    '_id':           null,
    'studentNum':    'Student Num',
    'gender':        'Gender',
    'firstName':     'First Name',
    'lastName':      'Last Name',
    'birthday':      'Birthday',
    'phone':         'Phone',
    'email':         'Email',
    'addr':          'Address',    // when addr only emitted, all sub-fields are included
    'addr.line1':    null,         // ... can emit individual sub-field (ex: 'addr.state': true)
    'addr.line2':    null,
    'addr.city':     null,
    'addr.state':    'From',
    'addr.zip':      null,
    'gpa':           'GPA',
    'graduation':    'Graduation Term',
    'degree':        'Degree'
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
