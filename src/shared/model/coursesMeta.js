'use strict';

/**
 * Promotes various meta data for the Courses MongoDB collection.
 */

//***
//*** Public API
//***

const coursesMeta = {

  // valid fields that make up the Courses collection
  // ... from a validation perspective, a non-existent entry (fieldLabel of undefined)
  // ... a value of null (i.e. null fieldLabel) is NOT publically promoted in user-defined selCrit
  validFields: {
//  fieldName (DB):  fieldLabel (null for non-public)
    _id:             null,
    courseNum:       'Course Num',
    courseTitle:     'Course Title',
    courseDesc:      'Course Desc',
    academicGroup:   'Academic Group',
    subjDesc:        'Subject Desc',
  },

  // default fields to display in a Courses retrieval (a mongo projection)
  defaultDisplayFields: {
    _id:           false,
    courseNum:     true,
    courseTitle:   true,
    academicGroup: true,
    subjDesc:      true
  },

};
export default coursesMeta;
