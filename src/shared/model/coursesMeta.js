'use strict';

/**
 * Promotes various meta data for the Courses MongoDB collection.
 */

//***
//*** Public API
//***

const coursesMeta = {

  // valid fields that make up the Courses collection
  validFields: {
    _id:           '_id',
    courseNum:     'courseNum',
    courseTitle:   'courseTitle',
    courseDesc:    'courseDesc',
    academicGroup: 'academicGroup',
    subjDesc:      'subjDesc',
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
