'use strict';

import React     from 'react';
import ReduxUtil from './util/ReduxUtil';

import AppBar       from 'material-ui/lib/app-bar';
import IconButton   from 'material-ui/lib/icon-button';
import IconMenu     from 'material-ui/lib/menus/icon-menu';
import MenuItem     from 'material-ui/lib/menus/menu-item';
import MoreVertIcon from 'material-ui/lib/svg-icons/navigation/more-vert';
import Paper        from 'material-ui/lib/paper';
import Tab          from 'material-ui/lib/tabs/tab';
import Tabs         from 'material-ui/lib/tabs/tabs';
import UserMsg      from './comp/UserMsg';
import {AC}         from './state/actions'

import autoBindAllMethods from '../shared/util/autoBindAllMethods';

/**
 * Top-Level GeekUApp component.
 */
const GeekUApp = ReduxUtil.wrapCompWithInjectedProps(

  class extends React.Component { // component definition

    constructor(props, context) {
      super(props, context);
      autoBindAllMethods(this);
    }
  
    render() {
      const { displayUserMsg } = this.props

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
                              onTouchTap={(event)=>displayUserMsg('WowZee WowZee WooWoo')}/>
                  </IconMenu>}/>
        <UserMsg/>
      </div>;
    }
  },

  { // component property injection
    mapDispatchToProps(dispatch, ownProps) {
      return {
        displayUserMsg: (msg) => { dispatch( AC.displayUserMsg(msg) ) },
      }
    }
  });


export default GeekUApp;
