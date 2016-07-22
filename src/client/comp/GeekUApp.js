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
import Alert              from './Alert';
import autoBindAllMethods from '../../shared/util/autoBindAllMethods';
import {AC}               from '../state/actions';
import LeftNav            from './LeftNav';
import EditSelCrit        from './EditSelCrit/EditSelCrit';


/**
 * Top-Level GeekUApp component.
 */
const GeekUApp = ReduxUtil.wrapCompWithInjectedProps(

  class GeekUApp extends React.Component { // component definition
    constructor(props, context) {
      super(props, context);
      autoBindAllMethods(this);
    }

    handleMainPageChange(page) {
      const p = this.props;
      p.dispatch( AC.changeMainPage(page) );
    }

    tempAlert() {
      const p = this.props;
      const directive1 = {
        title: 'Test Alert 1',
        msg:   'This is a test of our Alert Dialog!',
        actions: [  
          {txt: 'Option 1',  action: () => p.dispatch( AC.userMsg.display('User chose Option 1') ) },
          {txt: 'Option 2',  action: () => p.dispatch( AC.userMsg.display('User chose Option 2') ) },
          {txt: 'Alert A', action: () => Alert.display(directiveA) },
          {txt: 'Cancel' },
        ]
      };
      const directiveA = {
        title: 'Test Alert A',
        msg:   'This is a test of our Alert Dialog!',
        actions: [  
          {txt: 'Option A', action: () => p.dispatch( AC.userMsg.display('User chose Option A') ) },
          {txt: 'Option B', action: () => p.dispatch( AC.userMsg.display('User chose Option B') ) },
          {txt: 'Cancel' },
        ]
      };
      const directiveX = {
        title: 'Test Alert X',
        msg:   'This is a test of our Alert Dialog!',
        actions: [  
          {txt: 'Option X', action: () => p.dispatch( AC.userMsg.display('User chose Option X') ) },
          {txt: 'Option Y', action: () => p.dispatch( AC.userMsg.display('User chose Option Y') ) },
          {txt: 'Cancel' },
        ]
      };
      Alert.display(directive1);
      Alert.display(directiveX); // test multiple concurrent alerts
      Alert.display({msg: <span style={{color: 'red'}}>This is a simple Alert</span>});
    }

    tempSampleMsg() {
      const p = this.props;
      p.dispatch( AC.userMsg.display(`Sample Message on ${new Date()}`) );
    }

    tempSampleMultiMsg() {
      const p = this.props;
      p.dispatch([ AC.userMsg.display(`Sample Multi-Message 1`), AC.userMsg.display(`Sample Multi-Message 2`)]);
    }

    tempSampleMsgWithUserAction() {
      const p = this.props;
      p.dispatch( AC.userMsg.display('Msg with User Action!', 
                                     {
                                       txt:      'details',
                                       callback: () => alert('here are the details: bla bla bla POOP')
                                     }) );
    }

    tempRetrieveStudents() {
      const p = this.props;
      p.dispatch( AC.retrieveStudents(null) );
    }

    tempAggregateTest() {
      const p = this.props;
      // we CAN now batch actions that include thunks as well as normal action objects
      p.dispatch([ AC.retrieveStudents(null),
                   AC.userMsg.display('Batching thunks FINALLY works!'),
                   AC.changeMainPage('Students') ]);
    }
  
    render() {
      const p = this.props;

      // studentNum is used as a back-up if name is NOT retrieved (studentNum is ALWAYS returned)
      const selectedStudentName = p.selectedStudent ? `(${p.selectedStudent.firstName || p.selectedStudent.lastName || p.selectedStudent.studentNum})` : '';

      return <div className="app">
        <AppBar className="app-header"
                title={
                  <table>
                    <tbody>
                      <tr>
                        <td><i>GeekU</i></td>
                        <td>
                          <Tabs value={p.mainPage}
                                onChange={this.handleMainPageChange}>
                            <Tab value="Students" style={{textTransform: 'none', width: '15em'}} label={<span>Students <i>{selectedStudentName}</i></span>}/>
                            <Tab value="Courses"  style={{textTransform: 'none', width: '15em'}} label={<span>Courses  <i></i></span>}/>
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

                    <MenuItem primaryText="Sample Alerts"                    onTouchTap={this.tempAlert}/>
                    <MenuItem primaryText="Sample Message"                   onTouchTap={this.tempSampleMsg}/>
                    <MenuItem primaryText="Sample Multi-Message"             onTouchTap={this.tempSampleMultiMsg}/>
                    <MenuItem primaryText="Sample Message with User Action"  onTouchTap={this.tempSampleMsgWithUserAction}/>
                    <MenuItem primaryText="Test Student Retrieval"           onTouchTap={this.tempRetrieveStudents}/>
                    <MenuItem primaryText="Aggregate Test"                   onTouchTap={this.tempAggregateTest}/>
                  </IconMenu>}/>
        <Students/>
        <EditSelCrit/>
        <UserMsg/>
        <Alert/>
      </div>;
    }
  }, // end of ... component definition

  { // component property injection
    mapStateToProps(appState, ownProps) {
      return {
        mainPage:        appState.mainPage,
        selectedStudent: appState.students.selectedStudent,
      }
    }
  }); // end of ... component property injection

// define expected props
GeekUApp.propTypes = {
}

export default GeekUApp;
