'use strict';

import React              from 'react';
import ReduxUtil          from '../util/ReduxUtil';

import autoBindAllMethods from '../../shared/util/autoBindAllMethods';
import studentsMeta       from '../../shared/model/studentsMeta';

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
      const { inProgress, selCrit, students, selectedStudent, hoveredStudent, studentsShown, detailStudent, selectStudentFn, hoverStudentFn, detailStudentFn } = this.props;

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
      // ... one side-benefit is that we retain scrolling state from previous renderings
      //     TODO: doesn't seem to help - in fact it even takes longer to take it down ... hmmmm
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

      // analyze fullName construct based on optional sort order of first/last
      // ... 'Bridges, Kevin' or 'Kevin Bridges' (DEFAULT)
      function analyzeFirstNameFirst() {
        const sortFields = (selCrit && selCrit.sort) ? Object.keys(selCrit.sort) : []; // in precedence order
        for (const field of sortFields) {
          if (field === 'firstName')
            return true;
          if (field === 'lastName')
            return false;
        }
        return true; // default
      }
      const displayFirstNameFirst = analyzeFirstNameFirst();

      // define the order that our columns are displayed (based on selCrit)
      const displayFieldOrder = (selCrit && selCrit.fields)
              ? selCrit.fields
                // default found in student meta info
              : Object.keys(studentsMeta.defaultDisplayFields);
              // ?   // TECHNICALLY: only should include items with a true value // ??? keep as example, eliminate when in version control
              // ? : Object.keys(studentsMeta.defaultDisplayFields).reduce( (accum, field) => { 
              // ?     if (studentsMeta.defaultDisplayFields[field]) {
              // ?       accum.push(field);
              // ?     }
              // ?     return accum;
              // ?   }, []);

      // define a map of all fields to display ... ex: { 'lastName': true, 'firstName': true }
      const fieldsInDisplay = displayFieldOrder.reduce( (obj, field) => {
        obj[field] = true;
        return obj;
      }, {});

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

              { students.map( (student, indx) => {

                  // NOTE: student.studentNum is always emitted (enforced by server)

                  if (indx > 100) { // TODO: ?? temporally narrow entries till we figure out how to handle big lists or make them unneeded
                    return '';
                  }

                  const genderColor = student.gender==='M' ? colors.blue900 : colors.pink300;
                  const genderDisp  = fieldsInDisplay.gender // gendor-icon - alternative to Avatar (simply too expensive for LARGE lists)
                                        ? <FontIcon className="material-icons" color={genderColor}>person</FontIcon>
                                        : null;

                  
                  // format fullName based on optional sort order of first/last ... 'Bridges, Kevin' ... or 'Kevin Bridges'
                  let fullName = '';
                  if (displayFirstNameFirst) {
                    if (fieldsInDisplay.firstName) {
                      fullName += student.firstName;
                    }
                    if (fieldsInDisplay.lastName) {
                      fullName += (fullName ? ' ' : '') + student.lastName;
                    }
                  }
                  else {
                    if (fieldsInDisplay.lastName) {
                      fullName += student.lastName;
                    }
                    if (fieldsInDisplay.firstName) {
                      fullName += (fullName ? ', ' : '') + student.firstName;
                    }
                  }

                  // group studentEssentials in one field ... displays much better in <TableRow>
                  const studentEssentials = <TableRowColumn key={`${student.studentNum}-studentEssentials`}>
                                              {genderDisp}
                                              {fullName}
                                              {fieldsInDisplay.studentNum ? <i>{` (${student.studentNum})`}</i> : <i/>}
                                            </TableRowColumn>;


                  // define the control buttons to use when row is 'hovered' over
                  const hoverControls = <TableRowColumn key={`${student.studentNum}-hoverControls`}>
                                          <i style={{
                                               cursor:     'pointer',
                                               // ... we explicitly use visibility to take space even when hidden, so as to NOT be "jumpy"
                                               visibility: hoveredStudent===student ? 'visible' : 'hidden'
                                             }}>
                                            <FontIcon className="material-icons" color={colors.grey700} onClick={()=>detailStudentFn(student.studentNum, false)}>portrait</FontIcon>
                                            <FontIcon className="material-icons" color={colors.red900}  onClick={()=>detailStudentFn(student.studentNum, true)}>edit</FontIcon>
                                          </i>
                                        </TableRowColumn>;

                  // maintain indicator as to whether studentEssentials have been displayed (only do once per row)
                  let studentEssentialsDisplayed = false;

                  return (
                    <TableRow key={student.studentNum} 
                              selected={student===selectedStudent}>

                      { displayFieldOrder.map( (field) => { // columns are ordered based on the definition in selCrit

                          // our fieldDisplayCntl provides additional control on how each field is displayed
                          const fieldDisplayCntl = _fieldDisplayCntl[field];

                          // never displayed (rare)
                          if (!fieldDisplayCntl) {
                            return null;
                          }

                          // display as part of our studentEssentials aggregate
                          else if (fieldDisplayCntl==='#studentEssentials#') {
                            if (studentEssentialsDisplayed) {
                              return null;
                            }
                            studentEssentialsDisplayed = true;
                            return [
                              studentEssentials,
                              hoverControls
                            ];
                          }

                          // display through hybrid function (ex: 'addr' handled by formatting entire address)
                          else if (typeof fieldDisplayCntl === 'function') {

                            const fieldValue = fieldDisplayCntl(student);
                            
                            return fieldValue
                                     ? <TableRowColumn key={`${student.studentNum}-${field}`}>{fieldValue}</TableRowColumn>
                                     : null;
                          }

                          // plain display of unformatted field (with optional label)
                          else {
                            const fieldLabel = typeof fieldDisplayCntl === 'string' ? <i>{fieldDisplayCntl}</i> : '';

                            const fieldValue = student[field]
                                                  // normal case
                                                ? student[field]
                                                  // handle dotted fields (ex: 'addr.state') by dereferencing (ex: student['addr']['state'])
                                                : field.split('.').reduce( (obj, node) => obj ? obj[node] : null, student);

                            return fieldValue
                                     ? <TableRowColumn key={`${student.studentNum}-${field}`}>{fieldLabel} {fieldValue}</TableRowColumn>
                                     : null;
                          }
                        })}

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
        selCrit:         appState.students.selCrit,
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




// define our control structure of how individual fields are displayed
// ... possible values:
//     - true:                 display plain (without a label)
//     - false:                never display (rare) ... same as non-existent entry (ex: '_id')
//     - '#studentEssentials#' displayed as part of a studentEssentials grouping (first field hit displays all studentEssentials)
//     - string:               displays with defined label
//     - function(student)     invoke function, returning content to display
const _fieldDisplayCntl = {
  'studentNum':  '#studentEssentials#',
  'gender':      '#studentEssentials#',
  'firstName':   '#studentEssentials#',
  'lastName':    '#studentEssentials#',
  'birthday':    'birth:',
  'phone':       true,
  'email':       true,
  'addr':        (student) => {
                   const addr = student.addr;
                   return <span>
                            {addr.line1}<br/>
                            {addr.line2 ? <span>{addr.line2}<br/></span> : <i/>}
                            {addr.city}, {addr.state}  {addr.zip}
                          </span>
                 },
  'addr.line1':  true,
  'addr.line2':  true,
  'addr.city':   true,
  'addr.state':  'from:',
  'addr.zip':    true,
  'gpa':         'GPA',
  'graduation':  true,
  'degree':      true,
};
