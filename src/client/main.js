'use strict';

/*--------------------------------------------------------------------------------
   The GeekU client-side entry point (i.e. the mainline).
   --------------------------------------------------------------------------------*/

import './ClientSidePolyfill';
import './Log4GeekU'; // configure logs for GeekUApp (NOTE: include VERY early in our start-up process)

import Log               from '../shared/util/Log';
import React             from 'react';
import ReactDOM          from 'react-dom';
import GeekUMuiTheme     from './GeekUMuiTheme';
import MuiThemeProvider  from 'material-ui/lib/MuiThemeProvider';
import {Provider}        from 'react-redux';
import {AC}              from './state/actions';
import appStore          from './appStore';
import GeekUApp          from './GeekUApp';

const log = new Log('GeekU');

// render our GeekUApp react component, along with our app-wide support components
log.info(()=>'render our GeekUApp react component, along with our app-wide support components');
ReactDOM.render(<Provider store={appStore}>
                  <MuiThemeProvider muiTheme={GeekUMuiTheme}>
                    <GeekUApp/>
                  </MuiThemeProvider>
                </Provider>,
                document.getElementById('app'));

// ??? retrieve our students ... temporary placement to get us going
const selCrit = {
  l8tr: 'ToDo',
};
appStore.dispatch( AC.retrieveStudents(selCrit) );
