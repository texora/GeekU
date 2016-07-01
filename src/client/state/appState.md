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

    hoveredStudent:  null/item[below],
    selectedStudent: null/item[below],

    detailStudent:  null/item[below],
    detailEditMode: true/false

    inProgress: 0,1,2, // truthy ... number of outstanding student requests
    selCrit: {
      // common structure for ALL DB retrievals ... see [selCrit](#selcrit) (below) for details
    },
    items: [
      { <studentIndx> || <studentDetail> },
      ...ditto...
    ],
  },

? courses: {       // our retrieved courses

?   hoveredCourse:  null/item[below],
?   selectedCourse: null/item[below],

?   detailCourse:   null/item[below],
?   detailEditMode: true/false

?   inProgress: 0,1,2, // truethy ... number of outstanding course requests
?   selCrit: {
      // common structure for ALL DB retrievals ... see [selCrit](#selcrit) (below) for details
    },
?   items: [
?     { <courseIndx> || <courseDetail> },
      ...ditto...
    ],
  },
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
  name:   "Female students from MO/IN with GPA over 3.65",
  desc:   "optional longer description",
  target: "students"/"courses", // identifies the targeted mongo collection
  fields: [  // list of desired field names to emit ... DEFAULT: studentsMeta.defaultDisplayFields
    "studentNum",
    "firstName",
    "lastName",
    "addr.state",
    "gpa"
  ],
  sort: {    // key/value of fieldName with sort order (1: ascending, -1 descending) ... DEFAULT: random order
    "lastName": 1,
    "firstName": 1
  },
  filter: {  // a mongo query object defining the selection criteria ... DEFAULT: ALL students
    "gender": "F",
    "addr.state": {
      "$in": [
        "Missouri",
        "Indiana"
      ]
    },
    "gpa": {
      "$gt": "3.65"
    }
  }
}
```
