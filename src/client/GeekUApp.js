'use strict';

import React              from 'react';
import AppBar             from 'material-ui/lib/app-bar';
import IconButton         from 'material-ui/lib/icon-button';
import IconMenu           from 'material-ui/lib/menus/icon-menu';
import MenuItem           from 'material-ui/lib/menus/menu-item';
import MoreVertIcon       from 'material-ui/lib/svg-icons/navigation/more-vert';
import Paper              from 'material-ui/lib/paper';
import Tab                from 'material-ui/lib/tabs/tab';
import Tabs               from 'material-ui/lib/tabs/tabs';
import UserMsg            from './comp/UserMsg';
import displayUserMsg     from './util/displayUserMsg'
import autoBindAllMethods from '../shared/util/autoBindAllMethods';

/**
 * Top-Level GeekUApp component.
 */
class GeekUApp extends React.Component {
  constructor(props, context) {
    super(props, context);
    autoBindAllMethods(this);
  }

  render() {
    return <div className="page">
      <AppBar className="page-header"
              title={
                <span>
                  <i>GeekU</i>
                    {/* 
                    <Tabs style={{
                    width: '90%'
                    }}>
                    <Tab label="Students (Jane)"/>
                    <Tab label="Courses (CS-101)"/>
                    </Tabs>
                    */}
                </span>}
              iconElementRight={
                <IconMenu iconButtonElement={ <IconButton><MoreVertIcon/></IconButton> }
                          targetOrigin={{horizontal: 'right', vertical: 'top'}}
                          anchorOrigin={{horizontal: 'right', vertical: 'top'}}>
                  <MenuItem primaryText="Refresh"/>
                  <MenuItem primaryText="Help"/>
                  <MenuItem primaryText="Sign Out"/>
                  <MenuItem primaryText="Sample Message"
                            onTouchTap={(event)=>displayUserMsg(`WowZee WowZee WooWoo ${new Date()}`)}/>
                  <MenuItem primaryText="Test Student Retrieval"
                            onTouchTap={(event)=>retrieveStudents()}/>
                  <MenuItem primaryText="Aggregate Test"
                            onTouchTap={(event)=>aggregateTest()}/>
                </IconMenu>}/>
      <UserMsg/>
    </div>;
  }
}

export default GeekUApp;

// ?? TEMP FOR "Test Student Retrieval" above
import appStore  from './appStore';
import {AC}      from './state/actions';
function retrieveStudents() {
  const selCrit = {
    l8tr: 'ToDo (L8TR)',
  };
  appStore.dispatch( AC.retrieveStudents(selCrit) );
}

// ?? TEMP FOR "Aggregate Test" above
function aggregateTest() {
  const selCrit = {
    l8tr: 'Aggregate Test',
  };

  // here is the redux-batched-updates enhanced reducer ( THIS WORKS ... FINALLY )
  appStore.dispatch([
    AC.retrieveStudents.complete(selCrit, [7, 8, 9]),
    AC.userMsg.display('It FINALLY Works!'),
  ]);

  // test a batch of actions that include an async action
  // ERROR: GeekU Development Error - GeekU action batching does NOT support thunks (retrieveStudents), because batching is handled at the reducer-level, rather than the dispatching-level
  // ? appStore.dispatch([
  // ?   AC.retrieveStudents(selCrit),
  // ?   AC.userMsg.display('Finally It Worked'),
  // ? ]);
}
