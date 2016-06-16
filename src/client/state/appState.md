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
    inProgress: 0,1,2, // truethy ... number of outstanding student requests
?   selCrit: {
?     bla: 1
    },
    selectedStudent: null/item[below],
    items: [
      { <studentIndx> || <studentDetail> },
      ...ditto...
    ],
  },

? courses: {       // our retrieved courses
?   inProgress: 0,1,2, // truethy ... number of outstanding course requests
?   selCrit: {
?     bla: 1
    },
?   selectedCourse: null/item[below],
?   items: [
?     { <courseIndx> || <courseDetail> },
      ...ditto...
    ],
  },
}
```
