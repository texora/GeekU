'use strict';

import React            from 'react';
import GeekUMuiTheme    from './GeekUMuiTheme';

import AppBar           from 'material-ui/lib/app-bar';
import IconButton       from 'material-ui/lib/icon-button';
import IconMenu         from 'material-ui/lib/menus/icon-menu';
import MenuItem         from 'material-ui/lib/menus/menu-item';
import MoreVertIcon     from 'material-ui/lib/svg-icons/navigation/more-vert';
import MuiThemeProvider from 'material-ui/lib/MuiThemeProvider';
import Paper            from 'material-ui/lib/paper';
import Tab              from 'material-ui/lib/tabs/tab';
import Tabs             from 'material-ui/lib/tabs/tabs';

// ?? extend from MyComponent ?? eliminating need for bind()
class GeekUApp extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    return <MuiThemeProvider muiTheme={GeekUMuiTheme}>
      <div className="page">
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
                  </IconMenu>}/>
        
        <Paper className="page-content"
               style={{
                 margin:    '15px auto', // 15px spacing top/bottom, center left/right
                 textAlign: 'left',
                 width:     '90%', // ColWidth: HONORED (adding to inline <div> style),
                                   // 'auto' has NO impact
                                   // '90%' is honored
                                   // 'max-content'/'fit-content' works on chrome NOT IE
                                   // 'available' still big
                                   // ... can't even read/understand code: node_modules/material-ui/lib/paper.js
               }}
               zDepth={4}>
          <div style={{width: 380, margin: '65px auto'}}><img src="/img/GeekULogo.jpg"/></div>
        </Paper>
      </div>
    </MuiThemeProvider>;
  }
}

export default GeekUApp;
