'use strict';

import React              from 'react';
import * as ReactRedux    from 'react-redux';

import autobind           from 'autobind-decorator';

import studentsMeta       from '../../shared/model/studentsMeta';
import SelCrit            from '../../shared/util/SelCrit';

import {AC}               from '../actions';

import AppBar             from 'material-ui/lib/app-bar';
import Avatar             from 'material-ui/lib/avatar';
import Divider            from 'material-ui/lib/divider';
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
import EditSelCrit        from './EditSelCrit';
import Confirm            from './Confirm';


/**
 * The Students component displays a list of students.
 */

@ReactRedux.connect( (appState, ownProps) => {
  return {
    inProgress:      appState.students.inProgress ? true : false,
    selCrit:         appState.students.selCrit || {desc: 'please select a filter from the Left Nav menu'},
    students:        appState.students.items,
    selectedStudent: appState.students.selectedStudent,
    studentsShown:   appState.mainPage==='Students',

    detailStudent:   appState.students.detailStudent,
  }
})

@autobind

export default class Students extends React.Component {

  static propTypes = { // expected component props
  }

  constructor(props, context) {
    super(props, context);

    // define our initial local component state
    this.state = { 
      hoveredStudent: null,
    };
  }

  /**
   * Handle changes to hoveredStudent.
   * @param {Student} hoveredStudent the student that is being overed over (null for none).
   */
  handleHover(hoveredStudent) {
    // optimize the number of setState() invocations
    // ... hover events happen in rapid succession
    // ... setState() is NOT guaranteed to be synchronous
    // ... utilize our own separate lastSetHoveredStudent setting to:
    //     - KEY: reduce the number of setState() invocations by 50%
    if (hoveredStudent !== this.lastSetHoveredStudent) {
      this.lastSetHoveredStudent = hoveredStudent;
      this.setState({hoveredStudent});
    }
  }

  handleRefresh() {
    const p = this.props;
    p.dispatch( AC.retrieveStudents(p.selCrit) );
  }

  handleEditSelCrit() {
    const p = this.props;
    EditSelCrit.edit(p.selCrit, (changedSelCrit) => AC.retrieveStudents(changedSelCrit));
  }

  handleSaveSelCrit() {
    const p = this.props;
    p.dispatch( AC.selCrit.save(p.selCrit) ) // SAVE selCrit
     .then( savedSelCrit => {                // SYNC our view
       p.dispatch( AC.retrieveStudents(savedSelCrit) )
     });
  }

  handleNewSelCrit() {
    // start an edit session of a new 'Students' selCrit
    EditSelCrit.edit('Students', newSelCrit => AC.retrieveStudents(newSelCrit) );
  }

  handleDuplicateSelCrit() {
    const p = this.props;

    // duplicate our selCrit
    const dupSelCrit = SelCrit.duplicate(p.selCrit);

    // start an edit session with this dup selCrit
    EditSelCrit.edit(dupSelCrit, changedDupSelCrit => AC.retrieveStudents(changedDupSelCrit) );
  }

  handleDeleteSelCrit() {
    const p = this.props;

    Confirm.display({
      title: 'Delete Filter',
      msg:   `Please confirm deletion of filter: ${p.selCrit.name} -  ${p.selCrit.desc}`,
      actions: [
        { txt: 'Delete',
          action: () => {
            const impactView = 'Students';
            if (p.selCrit.dbHash) { // is persised in DB
              p.dispatch( AC.selCrit.delete(p.selCrit, impactView) );
            }
            else { // is an in-memory only representation
              p.dispatch( AC.selCrit.delete.complete(p.selCrit, impactView) );
            }
          } },
        { txt: 'Cancel' },
      ]
    });

  }

  handleSelectStudent(student) {
    const p = this.props;
    if (student) {
      p.dispatch( AC.selectStudent(student) );
    }
  }

  handleDetailStudent(studentNum, editMode) {
    const p = this.props;
    p.dispatch( AC.detailStudent(studentNum, editMode) );
  }

  render() {
    const p = this.props;

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
    if (!p.studentsShown) {
      myStyle.display = 'none';
    }

    // analyze fullName construct based on optional sort order of first/last
    // ... 'Bridges, Kevin' or 'Kevin Bridges' (DEFAULT)
    const sortFields = (p.selCrit.sort || []).map( sortField => sortField.charAt(0)==='-' ? sortField.substr(1) : sortField );
    function analyzeFirstNameFirst() {
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
    const displayFieldOrder = p.selCrit.fields && p.selCrit.fields.length > 0
            ? p.selCrit.fields
            : Object.keys(studentsMeta.defaultDisplayFields); // default found in student meta data

    // define a map of all fields to display ... ex: { 'lastName': true, 'firstName': true }
    const fieldsInDisplay = displayFieldOrder.reduce( (obj, field) => {
      obj[field] = true;
      return obj;
    }, {});

    // setup control structures supporting a visual break when values from the major-sort field changes
    let curMajorSortValue, lastMajorSortValue = null;
    const majorSortField = sortFields[0];

    const selCritName = p.selCrit.curHash===p.selCrit.dbHash
                         ? p.selCrit.name
                         : <span title="filter changes are NOT saved" style={{color: colors.deepOrangeA200, fontStyle: 'italic'}}>{p.selCrit.name}</span>;

    const selCritActionEnabled = p.selCrit.key ? true : false;

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
                title={<span>
                         <i>Students</i>
                         {p.inProgress && refreshInd}
                         <i style={{fontSize: 12}}>&nbsp;&nbsp;&nbsp;&nbsp; {selCritName}: {p.selCrit.desc}</i>
                       </span>}
                iconElementLeft={<i/>}
                iconElementRight={
                  <IconMenu iconButtonElement={ <IconButton><MoreVertIcon/></IconButton> }
                            targetOrigin={{vertical: 'top', horizontal: 'right', }}
                            anchorOrigin={{vertical: 'top', horizontal: 'right'}}>
                    <MenuItem primaryText="Edit Filter"      onTouchTap={this.handleEditSelCrit}      disabled={!selCritActionEnabled}/>
                    <MenuItem primaryText="Save Filter"      onTouchTap={this.handleSaveSelCrit}      disabled={SelCrit.isSaved(p.selCrit)}/>
                    <MenuItem primaryText="New Filter"       onTouchTap={this.handleNewSelCrit}/>
                    <MenuItem primaryText="Duplicate Filter" onTouchTap={this.handleDuplicateSelCrit} disabled={!selCritActionEnabled}/>
                    <MenuItem primaryText="Delete Filter"    onTouchTap={this.handleDeleteSelCrit}    disabled={!selCritActionEnabled}/>
                    <Divider/>
                    <MenuItem primaryText="Refresh View"     onTouchTap={this.handleRefresh}          disabled={p.selCrit.key ? false : true}/>
                  </IconMenu>}/>

        <Table className="page-content"
               height={'inherit'}
               fixedHeader={false}
               selectable={true}
               multiSelectable={false}
               onRowSelection={(selectedRows)=>this.handleSelectStudent(selectedRows.length===0 ? null : p.students[selectedRows[0]])}
               onRowHover={(rowNum)=> this.handleHover(p.students[rowNum])}
               onRowHoverExit={(rowNum)=> this.handleHover(null)}
               style={{
                   width: 'auto', // ColWidth: HONORED at this level and changes table width (from 'fixed')
                 }}>
          <TableBody deselectOnClickaway={false}
                     displayRowCheckbox={false}
                     showRowHover={true}
                     stripedRows={false}>

            { p.students.map( (student, studentIndx) => {

                // NOTE: student.studentNum is always emitted (enforced by server)

                if (studentIndx > 100) { // TODO: ?? temporally narrow entries till we figure out how to handle big lists or make them unneeded
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
                                             visibility: this.state.hoveredStudent===student ? 'visible' : 'hidden',
                                           }}>
                                          <FontIcon className="material-icons" color={colors.grey700} onClick={()=>this.handleDetailStudent(student.studentNum, false)}>portrait</FontIcon>
                                          <FontIcon className="material-icons" color={colors.red900}  onClick={()=>this.handleDetailStudent(student.studentNum, true)}>edit</FontIcon>
                                        </i>
                                      </TableRowColumn>;

                // maintain indicator as to whether studentEssentials have been displayed (only do once per row)
                let studentEssentialsDisplayed = false;

                // provide a visual break when the major-sort field changes
                curMajorSortValue = majorSortField ? student[majorSortField] : null;
                const majorSortBreakStyle = p.selCrit.distinguishMajorSortField && curMajorSortValue !== lastMajorSortValue && studentIndx !== 0
                                              ? {borderTop: '2px solid'}
                                              : {};
                lastMajorSortValue = curMajorSortValue;
                
                return (
                  <TableRow key={student.studentNum}
                            style={majorSortBreakStyle}
                            selected={student===p.selectedStudent}>

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

                          return <TableRowColumn key={`${student.studentNum}-${field}`}>{fieldLabel} {fieldValue}</TableRowColumn>
                        }
                      })}

                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </Paper>
      { p.detailStudent   && <Student/> }
    </Paper>
  }
}


 
// NOTE: Our retrieval is SO FAST, I am using a determinate mode because the animation is starting so small there is no time to see it
// NOTE: <CircularProgress> is VERY HOAKY ... insists on 50px by 50px outer rectangle (NO WAY TO DECREASE)
//       <CircularProgress size={0.3} color={colors.white}/> : <i/>;
// NOTE: <RefreshIndicator> is NOT MUCH BETTER ... any size under 50 has mucho transformation problems
const refreshInd = <RefreshIndicator size={50}
                                     top={10}
                                     left={60}
                                     percentage={80}
                                     color={"red"}
                                     status="ready"
                                     style={{display:  'inline-block',
                                             position: 'relative'}}/>


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
