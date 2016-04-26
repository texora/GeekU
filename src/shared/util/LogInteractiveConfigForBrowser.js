'use strict';

import Log       from './Log';
import HiddenCmd from '../../client/util/HiddenCmd';

/**
 * The LogInteractiveConfigForBrowser.js module provides an
 * interactive utility to configure the Browser Log filters, using a
 * simple GUI in an external window.
 *
 * To use it, simply register it as follows:
 *
 *   import registerInteractiveLogConfig from '../shared/util/LogInteractiveConfigForBrowser';
 *   ...
 *   registerInteractiveLogConfig('LogConfig'); 
 *
 * With this in place, you may activate it through an Easter Egg
 * ... simply type the supplied keyCombination (in this example
 * 'LogConfig') anywhere within your browser window (including void
 * space).  A new browser window will be activated with a GUI that
 * interactively adjusts the client-side browser Log filters.
 *
 * NOTE: Because this is a VERY simple "external" utility, it is
 *       implemented without any external dependencies (such as a
 *       React, etc.).  We don't want to add dependencies to
 *       the overall app.
 */

function registerInteractiveLogConfig(keyCombination) {
  HiddenCmd.register(keyCombination, activateLogConfig);
}
export default registerInteractiveLogConfig;


// ***
// *** activate our client-side window for Log Filter Browser Configuration
// ***

let logWind = null;
function activateLogConfig() {

  // create our external logging window if not already there
  logWind = window.open('',
                        'LogConfig',
                        'width=800,height=600,resizable,screenX=0,screenY=0,left=0,top=0');
  if (!logWind) {
    alert("I was NOT able to open the 'Log Filter Configuration Console'.\nDo you have a PopUp blocker enabled?");
    return;
  }

  logWind.focus(); // REQUIRED FOR IE - insure the window is activated (when behind currend window or iconized)

  // allow communication between new window and original window (for which we are working)
  setTimeout( function() { // NOTE: timeout is needed for IE to operate
    logWind.acceptCrossWindowParams(console, Log);
  }, 100);

  // dynamically create window content
  // ... if already there, then we are just re-activating the window
  const config = Log.config();
  let myHtml = `
<!doctype html>
<html>
  <head>
    <meta charset=utf-8/>
    <title>Log Filter Browser Configuration</title>
    <style>
      ${myCss}
    </style>
    <script type="text/javascript">
      ${myScript}
    </script>
  </head>
  <body>
    <h1>Log Filter Browser Configuration</h1>
    <div id="LogFilter" class="CSSTableGenerator">
      <table>
        <tr>
          <td>Filter</td>
          <td>Level</td>
        </tr>`;

      for (const filterName in config.filter) {
        const filterLevel = config.filter[filterName];

        myHtml += `
        <tr>
          <td>${filterName}</td>
          <td>${genSelect(filterName, filterLevel, config.logLevels)}</td>
        </tr>`;
      }

      myHtml += `
      </table>
    </div>
    <br/><label><input type="checkbox" ${config.excludeClientErrors ? 'checked' : ''} onchange="changeExcludeClientErrors(this.checked);">excludeClientErrors</label>
  </body>
</html>
`;
  let doc = logWind.document;
  doc.open();
  doc.write(myHtml);
  doc.close();
}


// ***
// *** helper utility to generate an html selection for a given filter
// ***

function genSelect(filterName, filterLevel, logLevels) {
  // prepend 'none' to unset
  // ... NOTE:  'root' filter cannot be unset ('none')
  const allLogLevels = filterName==='root' ? logLevels : ['none'].concat(logLevels);
  let mySelect = `<select onchange="changeFilter('${filterName}', this.value);">`;
  for (let i=0; i<allLogLevels.length; i++) {
    const level = allLogLevels[i];
    mySelect += `\n  <option value="${level}" ${filterLevel===level ? 'selected' : ''}>${level}</option>`;
                                            }
    mySelect += '\n</select>';
  return mySelect;
}


// ***
// *** client-side script to update a given filter
// ***

// NOTE: IE does NOT support ES6 syntax in this in-line code!
//       EX: no arrow functions, etc.

const myScript = `

function acceptCrossWindowParams(console, Log) {
  parent_console = console;
  parent_Log     = Log;
}

function changeFilter(filterName, filterLevel) {
  parent_console.log("Setting filter: '" + filterName + "': '" + filterLevel + "'");
  try {
    var filter =  {};
    filter[filterName] = filterLevel;
    var curConfig = parent_Log.config({
      filter: filter
    });
    parent_console.log("Current settings:" + JSON.stringify(curConfig, null, 2));
  }
  catch(e) {
    alert('Problem setting filter ' + filterName + ' to ' + filterLevel + ' ... ERROR: ' + e.message);
  }
}

function changeExcludeClientErrors(checked) {
  parent_console.log('Setting excludeClientErrors: ' + checked);
  try {
    var curConfig = parent_Log.config({
      excludeClientErrors: checked
    });
    parent_console.log("Current settings:" + JSON.stringify(curConfig, null, 2));
  }
  catch(e) {
    alert('Problem setting excludeClientErrors: ' + checked + ' ... ERROR: ' + e.message);
  }
}

`;


// ***
// *** css style sheet
// ***

const myCss = `
/* from: http://www.csstablegenerator.com/ ... GREEN TINT */
.CSSTableGenerator {
  margin:0px;padding:0px;
  width:90%;
  box-shadow: 10px 10px 5px #888888;
  border:1px solid #3f7f00;
  -moz-border-radius-bottomleft:7px;
  -webkit-border-bottom-left-radius:7px;
  border-bottom-left-radius:7px;
  -moz-border-radius-bottomright:7px;
  -webkit-border-bottom-right-radius:7px;
  border-bottom-right-radius:7px;
  -moz-border-radius-topright:7px;
  -webkit-border-top-right-radius:7px;
  border-top-right-radius:7px;
  -moz-border-radius-topleft:7px;
  -webkit-border-top-left-radius:7px;
  border-top-left-radius:7px;
}
.CSSTableGenerator table{
  border-collapse: collapse;
  border-spacing: 0;
  width:100%;
  height:100%;
  margin:0px;padding:0px;
}
.CSSTableGenerator tr:last-child td:last-child {
  -moz-border-radius-bottomright:7px;
  -webkit-border-bottom-right-radius:7px;
  border-bottom-right-radius:7px;
}
.CSSTableGenerator table tr:first-child td:first-child {
  -moz-border-radius-topleft:7px;
  -webkit-border-top-left-radius:7px;
  border-top-left-radius:7px;
}
.CSSTableGenerator table tr:first-child td:last-child {
  -moz-border-radius-topright:7px;
  -webkit-border-top-right-radius:7px;
  border-top-right-radius:7px;
}
.CSSTableGenerator tr:last-child td:first-child {
  -moz-border-radius-bottomleft:7px;
  -webkit-border-bottom-left-radius:7px;
  border-bottom-left-radius:7px;
}
.CSSTableGenerator tr:hover td {
}
.CSSTableGenerator tr:nth-child(odd) {
  background-color:#d4ffaa;
}
.CSSTableGenerator tr:nth-child(even) {
  background-color:#ffffff;
}
.CSSTableGenerator td {
  vertical-align:middle;
  border:1px solid #3f7f00;
  border-width:0px 1px 1px 0px;
  text-align:left;
  padding:7px;
  font-size:12px;
  font-family:Helvetica;
  font-weight:bold;
  color:#000000;
}
.CSSTableGenerator tr:last-child td {
  border-width:0px 1px 0px 0px;
}
.CSSTableGenerator tr td:last-child {
  border-width:0px 0px 1px 0px;
}
.CSSTableGenerator tr:last-child td:last-child {
  border-width:0px 0px 0px 0px;
}
.CSSTableGenerator tr:first-child td {
  background:-o-linear-gradient(bottom, #5fbf00 5%, #3f7f00 100%);
  background:-webkit-gradient( linear, left top, left bottom, color-stop(0.05, #5fbf00), color-stop(1, #3f7f00) );
  background:-moz-linear-gradient( center top, #5fbf00 5%, #3f7f00 100% );
  filter:progid:DXImageTransform.Microsoft.gradient(startColorstr="#5fbf00", endColorstr="#3f7f00");
  background: -o-linear-gradient(top,#5fbf00,3f7f00);
  background-color:#5fbf00;
  border:0px solid #3f7f00;
  text-align:center;
  border-width:0px 0px 1px 1px;
  font-size:16px;
  font-family:Helvetica;
  font-weight:bold;
  color:#ffffff;
}
.CSSTableGenerator tr:first-child:hover td{
  background:-o-linear-gradient(bottom, #5fbf00 5%, #3f7f00 100%);
  background:-webkit-gradient( linear, left top, left bottom, color-stop(0.05, #5fbf00), color-stop(1, #3f7f00) );
  background:-moz-linear-gradient( center top, #5fbf00 5%, #3f7f00 100% );
  filter:progid:DXImageTransform.Microsoft.gradient(startColorstr="#5fbf00", endColorstr="#3f7f00");
  background: -o-linear-gradient(top,#5fbf00,3f7f00);
  background-color:#5fbf00;
}
.CSSTableGenerator tr:first-child td:first-child{
  border-width:0px 0px 1px 0px;
}
.CSSTableGenerator tr:first-child td:last-child{
  border-width:0px 0px 1px 1px;
}
`;
