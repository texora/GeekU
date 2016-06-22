'use strict';

import React              from 'react';
import ReduxUtil          from '../util/ReduxUtil';

import autoBindAllMethods from '../../shared/util/autoBindAllMethods';

import {AC}               from '../state/actions';

import AppBar             from 'material-ui/lib/app-bar';
import Avatar             from 'material-ui/lib/avatar';
import FontIcon           from 'material-ui/lib/font-icon';
import IconButton         from 'material-ui/lib/icon-button';
import IconMenu           from 'material-ui/lib/menus/icon-menu';
import MenuItem           from 'material-ui/lib/menus/menu-item';
import MoreVertIcon       from 'material-ui/lib/svg-icons/navigation/more-vert';
import Paper              from 'material-ui/lib/paper';
import RefreshIndicator   from 'material-ui/lib/refresh-indicator';
import Table              from 'material-ui/lib/table/table';
import TableBody          from 'material-ui/lib/table/table-body';
import TableRow           from 'material-ui/lib/table/table-row';
import TableRowColumn     from 'material-ui/lib/table/table-row-column';

import colors             from 'material-ui/lib/styles/colors';

import Student            from './Student';


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
      const { inProgress, students, selectedStudent, hoveredStudent, studentsShown, detailStudent, selectStudentFn, hoverStudentFn, detailStudentFn } = this.props;

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

      // NOTE: Our retrieval is SO FAST, I am using a determinate mode because the animation is starting so small there is no time to see it
      // NOTE: <CircularProgress> is VERY HOAKY ... insists on 50px by 50px outer rectangle (NO WAY TO DECREASE)
      //       const inProgressIndicator =  inProgress ? <CircularProgress size={0.3} color={colors.white}/> : <i/>;
      // NOTE: <RefreshIndicator> is NOT MUCH BETTER ... any size under 50 has mucho transformation problems
      const refreshInd = <RefreshIndicator size={50}
                                           top={10}
                                           left={60}
                                           percentage={80}
                                           color={"red"}
                                           status="ready"
                                           style={{display:  'inline-block',
                                                   position: 'relative'}}/>
      const inProgressIndicator =  inProgress ? refreshInd : <i/>;

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
                  title={<i>Students{inProgressIndicator}</i>}
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
                 selectable={true}
                 multiSelectable={false}
                 onRowSelection={(selectedRows)=>selectStudentFn(selectedRows.length===0 ? null : students[selectedRows[0]])}
                 onRowHover={(rowNum)=> hoverStudentFn(students[rowNum])}
                 onRowHoverExit={(rowNum)=> hoverStudentFn(null)}
                 style={{
                     width: 'auto', // ColWidth: HONORED at this level and changes table width (from 'fixed')
                   }}>
            <TableBody deselectOnClickaway={false}
                       displayRowCheckbox={false}
                       showRowHover={true}
                       stripedRows={false}>
              {/* Alternative to Avatar (may be too expensive for a LARGE list)
              <Avatar src={`https://robohash.org/${student.firstName+student.lastName}.bmp?size=100x100&set=set2&bgset=any`} size={20}/>
              - vs -
              <FontIcon className="material-icons" color={colors.blue900}>face</FontIcon>
              <FontIcon className="material-icons" color={colors.blue900}>person</FontIcon>
              */}
              { students.map( (student, indx) => {
                  if (indx > 100) { // TODO: ?? temporally narrow entries till we figure out how to handle big lists or make them unneeded
                    return '';
                  }

                  const genderColor = student.gender==='M' ? colors.blue900 : colors.pink300;

                  const hoverControls = <i style={{
                                             cursor:     'pointer',
                                             // ... we explicitly use visibility to take space even when hidden, so as to NOT be "jumpy"
                                             visibility: hoveredStudent===student ? 'visible' : 'hidden'
                                           }}>
                                          <FontIcon className="material-icons" color={colors.grey700} onClick={()=>detailStudentFn(student.studentNum, false)}>portrait</FontIcon>
                                          <FontIcon className="material-icons" color={colors.red900}  onClick={()=>detailStudentFn(student.studentNum, true)}>edit</FontIcon>
                                        </i>;
                  
                  return (
                    <TableRow key={student.studentNum} 
                              selected={student===selectedStudent}>
                      <TableRowColumn>
                        <FontIcon className="material-icons" color={genderColor}>person</FontIcon>
                        {student.firstName} {student.lastName}
                        <i>{` (${student.studentNum})`}</i>
                      </TableRowColumn>
                      <TableRowColumn>{hoverControls}</TableRowColumn>
                      <TableRowColumn>{student.degree}</TableRowColumn>
                      <TableRowColumn>{student.graduation || ''}</TableRowColumn>
                      <TableRowColumn><i>GPA</i>: {student.gpa}</TableRowColumn>
                      <TableRowColumn><i>birth</i>: {student.birthday}</TableRowColumn>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </Paper>
        { detailStudent &&  <Student/> }
      </Paper>
    }
  }, // end of ... component definition

  { // component property injection
    mapStateToProps(appState, ownProps) {
      return {
        inProgress:      appState.students.inProgress ? true : false,
        students:        appState.students.items,
        selectedStudent: appState.students.selectedStudent,
        hoveredStudent:  appState.students.hoveredStudent,
        studentsShown:   appState.mainPage==='students',

        detailStudent:   appState.students.detailStudent,
      }
    },
    mapDispatchToProps(dispatch, ownProps) {
      let latest_hoveredStudent = null;
      return {
        selectStudentFn: (student) => { if (student) dispatch( AC.selectStudent(student) )},
        hoverStudentFn:  (student) => { 
          if (latest_hoveredStudent !== student) { // optimization to prune duplicate requests (assumes this as a central logic point adjusting students hover)
            latest_hoveredStudent = student;
            dispatch( AC.hoverStudent(student) );
          }
        },
        detailStudentFn: (studentNum, editMode)  => { dispatch( AC.detailStudent(studentNum, editMode) )},
      }
    }
  }); // end of ... component property injection

// define expected props
Students.propTypes = {
  selectStudentFn: React.PropTypes.func, // .isRequired - injected via self's wrapper
  hoverStudentFn:  React.PropTypes.func, // .isRequired - injected via self's wrapper
  detailStudentFn: React.PropTypes.func, // .isRequired - injected via self's wrapper
}

export default Students;
