# Actions

GeekU actions are the basic building blocks that facilitate all
application activity *(a fundamental aspect of the
[redux](http://redux.js.org/) framework)*.

[Actions](http://redux.js.org/docs/basics/Actions.html) follow a
pre-defined convention that promote an action type and a type-specific
payload.

Actions are created by [action
creators](http://redux.js.org/docs/basics/Actions.html#action-creators)
(functions that return actions), and consumed by reducers which in
turn changes our app state.

All GeekU actions (both creators and types) are generated through the
[action-u](https://action-u.js.org/) library, and promoted through an
`actions` JSON structure.


## Simple Actions

GeekU actions are all simple objects.  In other words, **NO thunks**
are employed.

This is made possible by the utilization of the
[redux-logic](https://www.npmjs.com/package/redux-logic) framework.


## Intent

In many cases it is helpful to promote an action's **intent**.
As an example, some actions are intended to be exclusively used
internally *(by a logic module)*, and therefore are of no interest
to a reducer.  

This is especially true when using the dedicated
[redux-logic](https://www.npmjs.com/package/redux-logic) framework.

To that end, the following hash-tags are used to further document
each action:

```
#byUser:    dispatched by a user action    (i.e. initiated directly from UI)
#byLogic:   dispatched by app logic        (i.e. sourced from other actions)
#reducer:   of interest to a reducer       (i.e. state should change as a result)
#noReducer: of NO real interest to reducer (i.e. used to stimulate logic)
```

As an example, the [`selCrit.save`](apiActions.md#selCrit_save) action
is of no interest to reducers (#noReducer) because application logic
monitoring this action will emit a more general action
'selCrit.changed' which provides a more central opportunity to
maintain our state (#byLogic, #reducer).


## Top Level Action Sets

Here are the GeekU top-level action sets (i.e. the root nodes of our actions
JSON structure):

- {{book.api.client.actions.detailItem}}:  item detailed in visual dialog
- {{book.api.client.actions.filters}}:     filters related (i.e. selCrit objects)
- {{book.api.client.actions.itemsView}}:   items in view
- {{book.api.client.actions.selCrit}}:     selection criteria
- {{book.api.client.actions.selectItem}}:  the selected item
- {{book.api.client.actions.userMsg}}:     user notifications
