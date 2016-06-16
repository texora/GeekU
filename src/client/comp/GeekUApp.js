'use strict';

import React              from 'react';
import ReduxUtil          from '../util/ReduxUtil';
import AppBar             from 'material-ui/lib/app-bar';
import IconButton         from 'material-ui/lib/icon-button';
import IconMenu           from 'material-ui/lib/menus/icon-menu';
import MenuItem           from 'material-ui/lib/menus/menu-item';
import MoreVertIcon       from 'material-ui/lib/svg-icons/navigation/more-vert';
import Paper              from 'material-ui/lib/paper';
import Tab                from 'material-ui/lib/tabs/tab';
import Tabs               from 'material-ui/lib/tabs/tabs';
import Students           from './Students';
import UserMsg            from './UserMsg';
import autoBindAllMethods from '../../shared/util/autoBindAllMethods';
import {AC}               from '../state/actions';
import LeftNav            from './LeftNav';


/**
 * Top-Level GeekUApp component.
 */
const GeekUApp = ReduxUtil.wrapCompWithInjectedProps(

  class GeekUApp extends React.Component { // component definition
    constructor(props, context) {
      super(props, context);
      autoBindAllMethods(this);
    }
  
    render() {
      const { mainPage, selectedStudent, changeMainPageFn, sampleMessageFn, sampleMultiMessageFn, retrieveStudentsFn, aggregateTestFn, sampleMessageWithUserActionFn } = this.props

      const selectedStudentName = selectedStudent ? `(${selectedStudent.firstName})` : '';

      return <div className="app">
        <AppBar className="app-header"
                title={
                  <table>
                    <tbody>
                      <tr>
                        <td><i>GeekU</i></td>
                        <td>
                          <Tabs value={mainPage}
                                onChange={(value)=>changeMainPageFn(value)}>
                            <Tab value="students" style={{textTransform: 'none', width: '15em'}} label={<span>Students <i>{selectedStudentName}</i></span>}/>
                            <Tab value="courses"  style={{textTransform: 'none', width: '15em'}} label={<span>Courses  <i></i></span>}/>
                          </Tabs>
                        </td>
                      </tr>
                    </tbody>
                  </table>}
                iconElementLeft={<LeftNav/>}
                iconElementRight={
                  <IconMenu iconButtonElement={ <IconButton><MoreVertIcon/></IconButton> }
                            targetOrigin={{vertical: 'top', horizontal: 'right', }}
                            anchorOrigin={{vertical: 'top', horizontal: 'right'}}>
                    <MenuItem primaryText="Refresh"/>
                    <MenuItem primaryText="Help"/>
                    <MenuItem primaryText="Sign Out"/>
                    <MenuItem primaryText="Sample Message"                   onTouchTap={sampleMessageFn}/>
                    <MenuItem primaryText="Sample Multi-Message"             onTouchTap={sampleMultiMessageFn}/>
                    <MenuItem primaryText="Sample Message with User Action"  onTouchTap={sampleMessageWithUserActionFn}/>
                    <MenuItem primaryText="Test Student Retrieval"           onTouchTap={retrieveStudentsFn}/>
                    <MenuItem primaryText="Aggregate Test"                   onTouchTap={aggregateTestFn}/>
                  </IconMenu>}/>
        <Students/>
        <UserMsg/>
      </div>;
    }
  }, // end of ... component definition

  { // component property injection
    mapStateToProps(appState, ownProps) {
      return {
        mainPage:        appState.mainPage,
        selectedStudent: appState.students.selectedStudent,
      }
    },
    mapDispatchToProps(dispatch, ownProps) {
      return {
        changeMainPageFn: (page) => { dispatch( AC.changeMainPage(page) ) },
        sampleMessageFn: () => { dispatch( AC.userMsg.display(`Sample Message on ${new Date()}`)) },
        sampleMultiMessageFn: () => { dispatch([ AC.userMsg.display(`Sample Multi-Message 1`), AC.userMsg.display(`Sample Multi-Message 2`)]) },
        sampleMessageWithUserActionFn: () => { dispatch( sampleMessageWithUserAction() )},
        retrieveStudentsFn: () => { dispatch( AC.retrieveStudents({l8tr: 'ToDo'}) ) },
        aggregateTestFn: () => { dispatch( aggregateTest() ) },
      }
    }
  }); // end of ... component property injection

// define expected props
GeekUApp.propTypes = {
  sampleMessageFn:               React.PropTypes.func, // .isRequired - injected via self's wrapper
  sampleMultiMessageFn:          React.PropTypes.func, // .isRequired - injected via self's wrapper
  sampleMessageWithUserActionFn: React.PropTypes.func, // .isRequired - injected via self's wrapper
  retrieveStudentsFn:            React.PropTypes.func, // .isRequired - injected via self's wrapper
  aggregateTestFn:               React.PropTypes.func, // .isRequired - injected via self's wrapper
}


export default GeekUApp;

function aggregateTest() {
  const selCrit = {
    l8tr: 'Aggregate Test',
  };

  // here is the redux-batched-updates enhanced reducer ( THIS WORKS ... FINALLY )
  return [
    AC.retrieveStudents.complete(selCrit, [7, 8, 9]),
    AC.userMsg.display('It FINALLY Works!'),
  ];

  // test a batch of actions that include an async action
  // ERROR: GeekU Development Error - GeekU action batching does NOT support thunks (retrieveStudents), because batching is handled at the reducer-level, rather than the dispatching-level
  return [
    AC.retrieveStudents(selCrit),
    AC.userMsg.display('Finally It Worked'),
  ];
}

function sampleMessageWithUserAction() {
  return AC.userMsg.display('Msg with User Action!', 
                            {
                              txt:      'details',
                              callback: () => alert('here are the details: bla bla bla POOP')
                            });
}
