
<br/><br/><br/>

<a id="selCrit"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  selCrit : object</h5>
Actions rooted in 'selCrit' (Selection Criteria).


<br/><br/><br/>

<a id="itemsView"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  itemsView() : app-node</h5>
Actions rooted in 'itemsView' (Items in View).


<br/><br/><br/>

<a id="itemsView"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  itemsView(itemType, retrieve, activate:)</h5>
Retrieve and/or activate the itemsView for the specifieditemType.  Use this action when you wish to do BOTHretrieve/activate.

**Intent**: #byUser, #noReducer  

| Param | Type | Description |
| --- | --- | --- |
| itemType | string | the itemType ('student'/'course'). |
| retrieve | any | the retrieval directive, one of:   - null:        no retrieval at all (DEFAULT)   - SelCrit:     conditionally retrieve items when supplied selCrit is different (or out-of-date) from ItemsView selCrit   - 'refresh':   unconditionally refresh ItemsView with latest items (using view's current selCrit) |
| activate: | string | an activate directive, one of:   - 'activate':    activate/visualize this itemType ItemsView (DEFAULT for all but 'refresh' retrieval)   - 'no-activate': DO NOT activate                            (DEFAULT for 'refresh' retrieval) |


<br/><br/><br/>

<a id="itemsView_retrieve"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  itemsView.retrieve(itemType, selCrit)</h5>
Retrieve the Items View for the specified itemType.

**Intent**: #byUser, #byLogic, #reducer(spinner only)  

| Param | Type | Description |
| --- | --- | --- |
| itemType | string | the itemType ('student'/'course'). |
| selCrit | any | the selCrit driving the retrieval, one of:   - SelCrit:     conditionally retrieve items when supplied selCrit is different (or out-of-date) from ItemsView selCrit   - 'refresh':   unconditionally refresh ItemsView with latest items (using view's current selCrit) |


<br/><br/><br/>

<a id="itemsView_retrieve.complete"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  itemsView.retrieve.complete(itemType, selCrit, items)</h5>
Retrieval completed of items for the Items View.

**Intent**: #byLogic, #reducer  

| Param | Type | Description |
| --- | --- | --- |
| itemType | string | the itemType ('student'/'course'). |
| selCrit | any | the selCrit driving the retrieval, one of:   - SelCrit:     conditionally retrieve items when supplied selCrit is different (or out-of-date) from ItemsView selCrit   - 'refresh':   unconditionally refresh ItemsView with latest items (using view's current selCrit) |
| items | Array.&lt;Item&gt; | the items retrieved. |


<br/><br/><br/>

<a id="itemsView_retrieve.fail"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  itemsView.retrieve.fail(itemType, selCrit, error)</h5>
Retrieval failed of items for the Items View.

**Intent**: #byLogic, #reducer(spinner only)  

| Param | Type | Description |
| --- | --- | --- |
| itemType | string | the itemType ('student'/'course'). |
| selCrit | any | the selCrit driving the retrieval, one of:   - SelCrit:     conditionally retrieve items when supplied selCrit is different (or out-of-date) from ItemsView selCrit   - 'refresh':   unconditionally refresh ItemsView with latest items (using view's current selCrit) |
| error | Error | the Error detailing the failure. |


<br/><br/><br/>

<a id="itemsView_activate"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  itemsView.activate(itemType)</h5>
Activate the Items View for the specified itemType.

**Intent**: #byUser, #byLogic, #reducer  

| Param | Type | Description |
| --- | --- | --- |
| itemType | string | the itemType ('student'/'course'). |


<br/><br/><br/>

<a id="selCrit_edit"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  selCrit.edit(selCrit, isNew, syncDirective)</h5>
Start an edit dialog session of the supplied selCrit.

**Intent**: #byUser, #reducer  

| Param | Type | Description |
| --- | --- | --- |
| selCrit | SelCrit | the selCrit to edit. |
| isNew | boolean | indicator as to whether the supplied selCrit is new (true), or previously existed (false) ... DEFAULT: false |
| syncDirective | SelCrit.SyncDirective | a directive that indicates how selCrit changes should be synced in selCrit-based views ... DEFAULT: SelCrit.SyncDirective.default |


<br/><br/><br/>

<a id="selCrit_changed"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  selCrit.changed(selCrit, syncDirective)</h5>
A central notification that the supplied selCrit has changed (andis in a completed/valid state).This is emitted by various logic points under any circumstance ofa completed/valid change (ex: edit dialog completion, save,etc.), and is of interest to reducers to to maintain overallstate.

**Intent**: #byLogic, #reducer  

| Param | Type | Description |
| --- | --- | --- |
| selCrit | SelCrit | the selCrit that has changed. |
| syncDirective | SelCrit.SyncDirective | a directive that indicates how selCrit changes should be synced in selCrit-based views. ... DEFAULT: SelCrit.SyncDirective.default |


<br/><br/><br/>

<a id="selCrit_save"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  selCrit.save(selCrit, syncDirective)</h5>
Save the supplied selCrit.Any view that is based on this selCrit is automatically updated.

**Intent**: #byUser, #byLogic, #reducer(spinner only)  

| Param | Type | Description |
| --- | --- | --- |
| selCrit | SelCrit | the selCrit to save. |
| syncDirective | SelCrit.SyncDirective | a directive that indicates how selCrit changes should be synced in selCrit-based views. ... DEFAULT: SyncDirective.default |


<br/><br/><br/>

<a id="selCrit_delete"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  selCrit.delete(selCrit)</h5>
Delete the supplied selCrit, after obtaining a user confirmation.Any view that is based on this selCrit is automatically updated (see impactView).

**Intent**: #byUser, #reducer(spinner only)  

| Param | Type | Description |
| --- | --- | --- |
| selCrit | SelCrit | the selCrit to delete.  This can either be a local in-memory representation -or- on persisted in the DB. |

