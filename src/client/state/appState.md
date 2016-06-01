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

  userMsg: {       // message to display to user
    open: false,
    msg:  'You messed up!'
  },

  students: {      // our retrieved students
?   selCrit: {
?     bla: 1
    },
    items: [
?     { <studentIndx> || <studentDetail> },
      ...ditto...
    ],
  },

? courses: {       // our retrieved courses
?   selCrit: {
?     bla: 1
    },
?   items: [
?     { <courseIndx> || <courseDetail> },
      ...ditto...
    ],
  },
}
```

??? OLD: 
  catalog: {              // our catalog of items which can be purchased
    items:          [],   // items list [ { id: <int>, name: <string>, price: <int>, img: <string>, category: <string>, desc: <string>, details: <string> ]
    filterCategory: null, // item filter category <String> "" for show all
    expandedItemId: null, // item id to expand <int>, null for no expansion
  },

  cart: {             // our shopping cart
    visible:   false, // is cart dialog visible <boolean>
    cartItems: [],    // shopping cart item list [ { ...item, qty: <int> } ]
  },

  checkout: {       // checkout data (for purchase)
    visible: false, // is checkout dialog visible <boolean>
    total:   null,  // total amount being checked out <number>

    fields: {     // NOTE: These checkout.fields MUST MATCH the <Checkout> form field names
      addr1:      "", // <string>
      addr2:      "", // <string>
      city:       "", // <string>
      state:      "", // <string>
      zip:        "", // <string>
      email:      "", // <string>
      creditCard: "", // <string>
      expiry:     "", // <string>
      fullName:   "", // <string>
      cvcode:     "", // <string>
    }
  },

  receipt: {      // our shopping receipt
    id:           null, // receipt id <string> ... when supplied, receipt dialog is visualized
    receiptItems: [],   // receipt item list [ { ...cartItems } ]
  }

}
```

