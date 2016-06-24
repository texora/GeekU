'use strict';

import React              from 'react';
import ReduxUtil          from '../util/ReduxUtil';

import autoBindAllMethods from '../../shared/util/autoBindAllMethods';

import {AC}               from '../state/actions';

import ArrowBackIcon      from 'material-ui/lib/svg-icons/navigation/arrow-back';
import Avatar             from 'material-ui/lib/avatar';
import Dialog             from 'material-ui/lib/Dialog';
import Divider            from 'material-ui/lib/divider';
import IconButton         from 'material-ui/lib/icon-button';
import FlatButton         from 'material-ui/lib/flat-button';
import Paper              from 'material-ui/lib/paper';
import Table              from 'material-ui/lib/table/table';
import TableBody          from 'material-ui/lib/table/table-body';
import TableRow           from 'material-ui/lib/table/table-row';
import TableRowColumn     from 'material-ui/lib/table/table-row-column';
import TextField          from 'material-ui/lib/text-field';

import colors             from 'material-ui/lib/styles/colors';

import Alert              from './Alert';


/**
 * The Student component displays a dialog of the details of a given student.
 */
const Student = ReduxUtil.wrapCompWithInjectedProps(

  class Student extends React.Component { // component definition
    constructor(props, context) {
      super(props, context);
      autoBindAllMethods(this);
    }

    // conditionally close self if NO un-saved changes
    closeRequested() {
      const unsavedChanges = this.props.editMode; // TODO: activate this appropriatly

      // obtain user confirmation when unsaved changes exist
      if (unsavedChanges) {
        this.unsavedChangesAlert.open();
      }
      // close self for no outstanding unsaved changes
      else {
        this.close();
      }
    }

    // unconditionally close self
    close() {
      this.props.closeStudentDialogFn();
    }

    render() {
      const { student, editMode } = this.props;

      return (
        <Dialog modal={false}
                open={true}
                autoScrollBodyContent={true}
                onRequestClose={this.closeRequested}
                contentStyle={{
                    width:         '90%',
                    maxWidth:      'none',
                    verticalAlign: 'top',
                  }}>

          {/* outer content layout */}
          <div style={{
                 display:        'flex',
                 flexFlow:       'row nowrap',
               }}>

            {/* left panel */}
            <div style={{
                flex: '0 0 auto',

                display:     'flex',
                flexFlow:    'column nowrap',
                alignItems:  'center',
              
              }}>
              <IconButton onClick={this.closeRequested}
                          iconStyle={{
                            width:  24,
                            height: 24,          
                          }}
                          style={{
                            width:   36,
                            height:  36,          
                            padding: 6,
                            alignSelf: 'flex-start',
                          }}
                          tooltip='Back'
                          tooltipPosition='top-right'>
                <ArrowBackIcon color={colors.grey700}/>
              </IconButton>
              <Avatar src={`https://robohash.org/${student.firstName + student.lastName}.bmp?size=100x100&set=set2&bgset=any`}
                      size={100}/>
              <h2>{student.firstName} {student.lastName}</h2>
              <div>??? editMode: {editMode ? 'true' : 'false'}</div>
            </div>

            {/* right panel */}
            <div style={{
                   flex:   '1 1 auto',
                   margin: '0px 30px',

                   // for right panel layout (also a flex container)
                   display:        'flex',
                   flexFlow:       'column nowrap',
                   justifyContent: 'spece-between',
                 }}>

              {/* general student info */}
              <Paper style={{
                       width:     '100%',
                       padding:   '10px 15px',
                       flex:      '0 0 auto',
                     }}
                   zDepth={4}>

                <b>Contact</b>: {student.studentNum}
                <div style={{
                       padding: '0px 15px 0px 15px',
                     }}>
                  {student.email}
                  <Divider/>
                  {student.phone}
                  <Divider/>
                  {student.addr.line1}<br/>
                  {student.addr.line2 ? <span>{student.addr.line2}<br/></span> : <i/>}
                  {student.addr.city}, {student.addr.state}  {student.addr.zip}<br/>
                </div>

                <br/>
                <b>Profile</b>:

                <div style={{
                    padding: '0px 15px 0px 15px',
                  }}>
                  {student.gender==='M' ? 'Male' : 'Female'} ... <i>Birthday</i>: {student.birthday}
                  <br/>
                  <i>Degree</i>: {student.degree} ... <i>GPA</i>: {student.gpa} ... <i>Graduation</i>: {student.graduation}
                </div>

              </Paper>

              {/* spacer */}
              <div style={{
                      flex:   '0 0 auto',
                   }}>
                 &nbsp;
              </div>

              {/* enrollment student info */}
              <Paper style={{
                       width:     '100%',
                       padding:   '10px 15px',
                       flex:      '1 1 auto',
                     }}
                     zDepth={4}>
                <b>Enrollment</b>:
                <Table height={'inherit'}
                       fixedHeader={false}
                       selectable={false}
                       multiSelectable={false}
                       style={{
                           width: 'auto', // auto ColWidth: HONORED at this level and changes table width (from 'fixed')
                         }}>
                  <TableBody deselectOnClickaway={false}
                             displayRowCheckbox={false}
                             showRowHover={true}
                             stripedRows={false}>
                    { student.enrollment.map( (enroll, indx) => {
                        return (
                          <TableRow key={student.studentNum+enroll.term+enroll.courseNum}>
                            <TableRowColumn>{enroll.course.courseNum}</TableRowColumn>
                            <TableRowColumn>{enroll.grade || ''}</TableRowColumn>
                            <TableRowColumn>{enroll.term}</TableRowColumn>
                            <TableRowColumn>{enroll.course.courseTitle}</TableRowColumn>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </Paper>

            </div>
          </div>

          <Alert ref={(alert)=>{this.unsavedChangesAlert=alert}}
                 title='Student Edit'
                 actions={[
                   <FlatButton label="Discard Changes"
                               primary={true}
                               onTouchTap={ () => {
                                   this.unsavedChangesAlert.close();
                                   this.close(); // close our overall Student dialog (discarding changes)
                                 }}/>,
                   <FlatButton label="Go Back (in order to Save Changes)"
                               primary={true}
                               onTouchTap={ () => {
                                   this.unsavedChangesAlert.close();
                                 }}/>,
                 ]}>
            You have un-saved changes ... if you leave, your changes will NOT be saved!
          </Alert>

        </Dialog>
      );
    }
  }, // end of ... component definition

  { // component property injection
    mapStateToProps(appState, ownProps) {
      return {
        student:   appState.students.detailStudent,
        editMode:  appState.students.detailEditMode,
      }
    },
    mapDispatchToProps(dispatch, ownProps) {
      return {
        closeStudentDialogFn: () => { dispatch( AC.detailStudent.close() )},
      }
    }
  }); // end of ... component property injection

// define expected props
Student.propTypes = {
}

export default Student;
