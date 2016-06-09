'use strict';

import express from 'express';
import Log     from './Log';

/**
 * The LogInteractiveConfigForServer.js module provides an Express
 * middleware component that supports the interactive configuration of
 * the Server Log filters, through a simple web page.
 *
 * To use it, simply register the middleware component to your Express
 * app:
 *
 *   import logConfig from './shared/util/LogInteractiveConfigForServer';
 *   ...
 *   app.use('/', logConfig);
 *
 * With this in place you may interactively maintain the server log filters
 * through the following URL (use your domain/port):
 *
 *   http://localhost:8080/log/config
 *
 * NOTE: Because this is a VERY simple "external" utility, it is
 *       implemented without any external dependencies (such as a
 *       template engine, etc.).  We don't want to add dependencies to
 *       the overall app.
 *
 * TODO: apply role/authentication
 */

const logConfig = express.Router();

// ***
// *** here is our server-side page for Log Filter Server Configuration
// ***

logConfig.get('/log/config', (req, res, next) => {

  const config = Log.config();

  let myHtml = `
<!doctype html>
<html>
  <head>
    <meta charset=utf-8/>
    <title>Log Filter Server Configuration</title>
    <style>
      ${myCss}
    </style>
    <script>
      ${myScript}
    </script>
  </head>
  <body>
    <h1>Log Filter Server Configuration</h1>
    <div class="CSSTableGenerator">
      <table>
        <tr>
          <td>Filter</td>
          <td>Notes</td>
          <td>Level</td>
        </tr>`;

  for (const filterName in config.filter) {
    const filterLevel = config.filter[filterName];
    const filterNote  = Log.filter(filterName).note;
    myHtml += `
        <tr>
          <td>${filterName}</td>
          <td>${genSelect(filterName, filterLevel, config.logLevels)}</td>
          <td>${filterNote}</td>
        </tr>`;
  }

  myHtml += `
      </table>
    </div>
    <br/><label><input type="checkbox" ${config.excludeClientErrors ? 'checked' : ''} onchange="changeExcludeClientErrors(this.checked)">excludeClientErrors</label>
  </body>
</html>
`;

  res.send(myHtml);
});


// ***
// *** server-side API to set a filter
// *** NOTE: even though unconventional, we use get (vs. put) to allow setting from browser URL
// ***

logConfig.get('/log/config/setFilter/:filterName/:filterValue', (req, res, next) => {

  const filterName  = req.params.filterName;
  const filterValue = req.params.filterValue;

  try {
    Log.post(`Setting filter: '${filterName}': '${filterValue}'`);
    const curConfig = Log.config({
      filter: {
        [filterName]: filterValue
      }
    });
    Log.post('Current settings: ' + JSON.stringify(curConfig, null, 2));
    res.status(200).send('SUCCESS'); // HTTPStatus.OK
  }
  catch(e) {
    Log.post(`ERROR: Setting filter: '${filterName}': '${filterValue}' ... ${e.message}`, e);
    res.status(500).send(e.message); // HTTPStatus.INTERNAL_SERVER_ERROR
  }
});




// ***
// *** server-side API to set excludeClientErrors
// *** NOTE: even though unconventional, we use get (vs. put) to allow setting from browser URL
// ***

logConfig.get('/log/config/setExcludeClientErrors/:checked', (req, res, next) => {

  const checked  = req.params.checked==='true';

  try {
    Log.post(`Setting excludeClientErrors: ${checked}`);
    const curConfig = Log.config({
      excludeClientErrors: checked
    });
    Log.post('Current settings: ' + JSON.stringify(curConfig, null, 2));
    res.status(200).send('SUCCESS'); // HTTPStatus.OK
  }
  catch(e) {
    Log.post(`ERROR: Setting excludeClientErrors: ${checked} ... ${e.message}`, e);
    res.status(500).send(e.message); // HTTPStatus.INTERNAL_SERVER_ERROR
  }
});



// ***
// *** helper utility to generate an html selection for a given filter
// ***

function genSelect(filterName, filterLevel, logLevels) {
  // prepend 'none' to unset
  // ... NOTE:  'root' filter cannot be unset ('none')
  const allLogLevels = filterName==='root' ? logLevels : ['none'].concat(logLevels);
  let mySelect = `<select onchange="changeFilter('${filterName}', this.value)">`;
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

// NOTE: Because we encapsulate this simple utility in-line, no transpiler is applied.
//       Therefore, we must code to the browser's least common denominator.
//       - For example, IE's JavaScript interpreter does NOT support some ES6 syntax
//         (arrow functions, etc.) ... SO KEEP IT SIMPLE!
//       - As another example, we use the very primitive XMLHttpRequest binding, 
//         rather than pull all the fetch/promise dependencies.

const myScript = `

function changeFilter(filterName, filterLevel) {
  var url = '/log/config/setFilter/' + filterName + '/' + filterLevel;
  var xhttp = new XMLHttpRequest();
  xhttp.open('GET', url, false); // sync request
  xhttp.send();
  var response = xhttp.responseText;
  if (response !== 'SUCCESS') {
    alert('Problem setting filter ' + filterName + ' to ' + filterLevel + ' ... ERROR: ' + response);
  }
}

function changeExcludeClientErrors(checked) {
  var url = '/log/config/setExcludeClientErrors/' + (checked ? 'true' : 'false');
  var xhttp = new XMLHttpRequest();
  xhttp.open('GET', url, false); // sync request
  xhttp.send();
  var response = xhttp.responseText;
  if (response !== 'SUCCESS') {
    alert('Problem setting excludeClientErrors: ' + checked + ' ... ERROR: ' + response);
  }
}

`;


// ***
// *** client-side css
// ***

const myCss = `

dt {
  float: left;
  clear: left;
  margin-right: 5px;
  font-weight: bold;
}

dd {
  margin-left: 80px;
}

/* from: http://www.csstablegenerator.com/  ... BLUE TINT */
.CSSTableGenerator {
  margin:0px;padding:0px;
  width:98%;
  box-shadow: 10px 10px 5px #888888;
  border:1px solid #000000;
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
  background-color:#aad4ff;
}
.CSSTableGenerator tr:nth-child(even) {
  background-color:#ffffff;
}
.CSSTableGenerator td {
  vertical-align:middle;
  border:1px solid #000000;
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
  background:-o-linear-gradient(bottom, #005fbf 5%, #003f7f 100%);
  background:-webkit-gradient( linear, left top, left bottom, color-stop(0.05, #005fbf), color-stop(1, #003f7f) );
  background:-moz-linear-gradient( center top, #005fbf 5%, #003f7f 100% );
  filter:progid:DXImageTransform.Microsoft.gradient(startColorstr="#005fbf", endColorstr="#003f7f");
  background: -o-linear-gradient(top,#005fbf,003f7f);
  background-color:#005fbf;
  border:0px solid #000000;
  text-align:center;
  border-width:0px 0px 1px 1px;
  font-size:16px;
  font-family:Helvetica;
  font-weight:bold;
  color:#ffffff;
}
.CSSTableGenerator tr:first-child:hover td{
  background:-o-linear-gradient(bottom, #005fbf 5%, #003f7f 100%);
  background:-webkit-gradient( linear, left top, left bottom, color-stop(0.05, #005fbf), color-stop(1, #003f7f) );
  background:-moz-linear-gradient( center top, #005fbf 5%, #003f7f 100% );
  filter:progid:DXImageTransform.Microsoft.gradient(startColorstr="#005fbf", endColorstr="#003f7f");
  background: -o-linear-gradient(top,#005fbf,003f7f);
  background-color:#005fbf;
}
.CSSTableGenerator tr:first-child td:first-child{
  border-width:0px 0px 1px 0px;
}
.CSSTableGenerator tr:first-child td:last-child{
  border-width:0px 0px 1px 1px;
}
`;

export default logConfig;
