
<br/><br/><br/>

<a id="default"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  default</h5>
Commit (i.e. use) selCrit changes upon completion.


<br/><br/><br/>

<a id="default"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  default</h5>
Commit (i.e. use) selCrit changes BY saving them upon completion.


<br/><br/><br/>

<a id="default"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  default</h5>
Monitor unexpected conditions within the redux dispatch process(where most of our app logic resides) ...   - communicating problem to the user   - and logging the details (for tech support)


<br/><br/><br/>

<a id="default"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  default</h5>
Initialize the actions.selCrit.edit action, which edits the supplied selCrit,injecting additional information needed in action.


<br/><br/><br/>

<a id="default"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  default</h5>
Log each dispatched action, using the following Log levels:  - TRACE:   see dispatched actions  - VERBOSE: see dispatched actions INCLUDING action content (CAUTION: action content can be BIG)


<br/><br/><br/>

<a id="default"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  default</h5>
Process (i.e. implement) the actions.detailItem action.


<br/><br/><br/>

<a id="default"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  default</h5>
Process (i.e. implement) the actions.filters.retrieve action.


<br/><br/><br/>

<a id="default"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  default</h5>
Process (i.e. implement) the actions.itemsView action.


<br/><br/><br/>

<a id="default"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  default</h5>
Process (i.e. implement) the actions.itemsView.retrieve action.


<br/><br/><br/>

<a id="default"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  default</h5>
Process (i.e. implement) the actions.selCrit.delete action.


<br/><br/><br/>

<a id="default"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  default</h5>
Process (i.e. implement) the actions.selCrit.save action.


<br/><br/><br/>

<a id="default"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  default</h5>
Sync (i.e. re-retrieve) the appropriate itemsView when it is based on a selCrit that has changed.


<br/><br/><br/>

<a id="allowMore"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  allowMore</h5>
Constant to allow multiple dispatches with a single logic.process().


<br/><br/><br/>

<a id="default"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  default</h5>
Validate selCrit edits on completion.


<br/><br/><br/>

<a id="createNamedLogic"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  createNamedLogic(logicName, logicDef) ⇒ Logic</h5>
Value-added redux-logic createLogic() function that:  a) associates a name to each logic module, and   b) automates logging characteristics:       - a special log is injected into the redux-logic         dependencies that is filtered by the action type and is         specific to a named logic component (identifying the logic         component in all emitted probes)       - enter/exit logging probes are added to each logic function


| Param | Type | Description |
| --- | --- | --- |
| logicName | string | this component's logic name (injected in logic-based logging probes). |
| logicDef | Logic-Def | the logic definition ... supplied to redux-logic createLogic(). |

**Returns**: Logic - the enhanced redux-logic module.  
