'use strict';

import React              from 'react';
import ReduxUtil          from '../util/ReduxUtil';
import colors             from 'material-ui/lib/styles/colors';
import Paper              from 'material-ui/lib/paper';
import Table              from 'material-ui/lib/table/table';
import TableBody          from 'material-ui/lib/table/table-body';
import TableRow           from 'material-ui/lib/table/table-row';
import TableRowColumn     from 'material-ui/lib/table/table-row-column';
import Avatar             from 'material-ui/lib/avatar';
import FontIcon           from 'material-ui/lib/font-icon';
import autoBindAllMethods from '../../shared/util/autoBindAllMethods';
import {AC}               from '../state/actions';

// FYI: following used to add AppBar to Students page
import AppBar             from 'material-ui/lib/app-bar';
import IconMenu           from 'material-ui/lib/menus/icon-menu';
import IconButton         from 'material-ui/lib/icon-button';
import MoreVertIcon       from 'material-ui/lib/svg-icons/navigation/more-vert';
import MenuItem           from 'material-ui/lib/menus/menu-item';


/**
 * The Students component displays a list of students.
 */
const Students = ReduxUtil.wrapCompWithInjectedProps(

  class Students extends React.Component { // component definition
    constructor(props, context) {
      super(props, context);
      autoBindAllMethods(this);
    }

    render() {
      const { students, studentsShown, poopFn } = this.props; // ??? no poopFn

      // ?? use this in <Table attr=> to show detail student
      //    ... onCellClick={this.showStudent}

      const myStyle = {
        margin:    '15px auto', // 15px spacing top/bottom, center left/right
        textAlign: 'left',
        width:     '97%',       // ColWidth: HONORED (adding to inline <div> style),
        // 'auto' has NO impact
        // '90%' is honored
        // 'max-content'/'fit-content' works on chrome NOT IE
        // 'available' still big
        // ... can't even read/understand code: node_modules/material-ui/lib/paper.js
      };
      // we actually hide the students if NOT displayed as an attempted optimization for large list
      // ... doesn't seem to help - in fact it even takes longer to take it down ... hmmmm
      // >>> one side-benefit is that we retain scrolling state from previous renderings
      if (!studentsShown) {
        myStyle.display = 'none';
      }

      return <Paper className="app-content"
                    style={myStyle}
                    zDepth={4}>

        <Paper className="page"
               style={{
                 textAlign: 'left',
                 width:     '100%',
               }}
               zDepth={1}>

          <AppBar className="page-header"
                  style={{
                    backgroundColor: colors.blueGrey700, // also like lime900
                  }}
                  title={<i>Students</i>}
                  iconElementLeft={<i/>}
                  iconElementRight={
                    <IconMenu iconButtonElement={ <IconButton><MoreVertIcon/></IconButton> }
                              targetOrigin={{vertical: 'top', horizontal: 'right', }}
                              anchorOrigin={{vertical: 'top', horizontal: 'right'}}>
                      <MenuItem primaryText="Select"/>
                      <MenuItem primaryText="Filter"/>
                      <MenuItem primaryText="... more"/>
                    </IconMenu>}/>

          <Table className="page-content"
                 height={'inherit'}
                 fixedHeader={false}
                 selectable={false}
                 multiSelectable={false}
                 style={{
                     width: 'auto', // ColWidth: HONORED at this level and changes table width (from 'fixed')
                   }}>
            <TableBody deselectOnClickaway={false}
                       displayRowCheckbox={false}
                       showRowHover={true}
                       stripedRows={true}>
              {/* Alternative to Avatar (may be too expensive for a LARGE list)
              <Avatar src={`https://robohash.org/${student.firstName+student.lastName}.bmp?size=100x100&set=set2&bgset=any`} size={20}/>
              - vs -
              <FontIcon className="material-icons" color={colors.blue900}>face</FontIcon>
              <FontIcon className="material-icons" color={colors.blue900}>person</FontIcon>
              */}
              {students.map( (student, indx) => (
              indx > 100 ? '' : // TODO: ??? temporally narrow entries till we figure out how to handle big lists or make them unneeded
              <TableRow key={student.studentNum} 
                        selected={student.studentNum==='S-001004' || student==='TODO: ??? this.state.selectedStudent'}>
                <TableRowColumn>
                  {
                  student.gender==='M'
                  ? <FontIcon className="material-icons" color={colors.blue900}>person</FontIcon>
                  : <FontIcon className="material-icons" color={colors.pink300}>person</FontIcon>
                  }
                  {' ' + student.firstName + ' ' + student.lastName}
                  <i>{` (${student.studentNum})`}</i>
                </TableRowColumn>
                <TableRowColumn>{student.degree}</TableRowColumn>
                <TableRowColumn>{student.graduation || ''}</TableRowColumn>
                <TableRowColumn><i>GPA</i>: {student.gpa}</TableRowColumn>
                <TableRowColumn><i>birth</i>: {student.birthday}</TableRowColumn>
              </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Paper>
    }
  }, // end of ... component definition

  { // component property injection
    mapStateToProps(appState, ownProps) {
      return {
        students:      appState.students.items,
        studentsShown: appState.mainPage==='students',
      }
    },
    mapDispatchToProps(dispatch, ownProps) {
      return {
        poopFn: () => { dispatch([ AC.userMsg.display(`Sample Multi-Message 1`), AC.userMsg.display(`Sample Multi-Message 2`)]) },
      }
    }
  }); // end of ... component property injection

// define expected props
Students.propTypes = {
  poopFn: React.PropTypes.func, // .isRequired - injected via self's wrapper
}

export default Students;
