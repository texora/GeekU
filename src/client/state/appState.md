# GeekU Application State

The GeekU Application State is maintained in a single persistent store,
employing the Redux pattern of Actions and Reducers.  In essence these
are business events, that drive our apps state transition.

The complete specification of our app state is shown here.  **Please
notice that structural depth is maintained to emphasize ownership!**

```javascript
appState: {
? userProfile: {   // user profile and login session
  },

  userMsg: [       // message displayed to our user
                   // ... this array is a queue (FIFO), supporting multiple msgs
                   // ... only one message displayed at a time (the first [0])
      {
        msg:        '', // the message to display
        userAction: {   // optional action that can be activated by the user
          txt:      '',
          callback: function(event)
        }
      }
  ],

  mainPage: 'students'/'courses',

  students: {      // our retrieved students

    selectedStudent: null/item[below],

    detailStudent:  null/item[below],
    detailEditMode: true/false

    inProgress: 0,1,2, // truthy ... number of outstanding student requests
    selCrit: {
      // common structure for ALL DB retrievals ... see selCrit (below) for details
    },
    items: [
      { <studentIndx> || <studentDetail> },
      ...ditto...
    ],
  },

? courses: {       // our retrieved courses

?   selectedCourse: null/item[below],

?   detailCourse:   null/item[below],
?   detailEditMode: true/false

?   inProgress: 0,1,2, // truethy ... number of outstanding course requests
?   selCrit: {
      // common structure for ALL DB retrievals ... see selCrit (below) for details
    },
?   items: [
?     { <courseIndx> || <courseDetail> },
      ...ditto...
    ],
  },

  editSelCrit: {       // structure supporting ANY selCrit edit

    selCrit: { // the selCrit object being edited, null for none (i.e. edit NOT in-progress)
      // ... content contains common selCrit structure ... see selCrit (below) for details
    },

    extra: { // additional temporal structure streamlining various UI components

      // field options, streamlining react-select
      selectedFieldOptions: [ {fieldOption}, { value: 'firstName', label: 'First Name' }, ... ],

      // sort options, streamlining react-select
      selectedSortOptions: [ {sortOption}, { value: 'gender', label: 'Gender', ascDec: -1 }, ... ],

    }
  }

}
```



### selCrit

The GeekU App uses a common selCrit JSON structure to fine tune
retrieval/sort functionality.  It contains a number of fields, some
for user consumption, and others are machine-interpretable directives
(fields, sort, filter).

The following example is taken from a students collection and
retrieves female students from MO/IN with a GPA over 3.65:

```javascript
selCrit: {

  _id:    "shortId",            // the mongo db ID ... when persisted: same as key ... when NOT persisted: null
  key:    "shortId",            // the unique key identifying each selCrit instance (see _id) ... NOTE: selCrit objects can be temporal (NOT persisted), so key is important
  userId: "common",             // the user the selCrit belongs to ('common' for all)
  target: "Students"/"Courses", // identifies the targeted mongo collection
  lastDbModDate: date,          // the last DB modified date/time (used for persistence stale check) ... when NOT persisted: null

  name:   "Female students from MO/IN with GPA over 3.65",
  desc:   "optional longer description",

  fields: [  // list of desired field names to emit ... DEFAULT: null/[] deferring to default fields (via meta.defaultDisplayFields)
    "studentNum",
    "firstName",
    "lastName",
    "addr.state",
    "gpa"
  ],

  sort: [  // list of sort field names (optional - prefix for descending) ... DEFAULT: null/[] for NO sort
    "-graduation",
    "firstName",
    "lastName"
  ],
  distinguishMajorSortField: boolean: // supporting a visual break when values from the major-sort field changes

  filter: [ // list of selection criteria (logically ored) ... DEFAULT: null/[] for ALL docs
    { field: "gender",     op: "EQ",  value: "F"},
    { field: "addr.state", op: "IN",  value: ["Missouri","Indiana"]},
    { field: "gpa",        op: "GTE", value: "3.65"}
  ]

  dbHash:  "hash",  // current hash of the selCrit in our persistent DB (null if NOT persisted)
  curHash: "hash",  // current hash of this selCrit instance (if !=== dbHash, then a save is needed to sync to DB)
}
```
