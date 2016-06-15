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
      const { students, poopFn } = this.props; // ??? no poopFn

      // ?? use this in <Table attr=> to show detail student
      //    ... onCellClick={this.showStudent}

      const myStyle = {
        margin:    '15px auto', // 15px spacing top/bottom, center left/right
        textAlign: 'left',
        width:     '90%', // ColWidth: HONORED (adding to inline <div> style),
        // 'auto' has NO impact
        // '90%' is honored
        // 'max-content'/'fit-content' works on chrome NOT IE
        // 'available' still big
        // ... can't even read/understand code: node_modules/material-ui/lib/paper.js
      };

      return <Paper className="page-content"
                    style={myStyle}
                    zDepth={4}>
        <h1>Students</h1>
        <Table height={'inherit'}
               fixedHeader={false}
               selectable={false}
               multiSelectable={false}
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
            {students.map( (student, indx) => (
            <TableRow key={student.studentNum} selected={student==='???this.state.selectedStudent'}>
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
              <TableRowColumn><i>born</i>: {student.birthday}</TableRowColumn>
            </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    }
  }, // end of ... component definition

  { // component property injection
    mapStateToProps(appState, ownProps) {
      return {
        students:      appState.students.items,
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
