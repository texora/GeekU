'use strict';

import React              from 'react';
import * as ReactRedux    from 'react-redux';

import {autobind}         from 'core-decorators';

import actions            from '../actions';
import selectors          from '../state';

import term               from '../../shared/domain/term';
import itemTypes          from '../../shared/domain/itemTypes';
const  myItemType         = itemTypes.course;

import ArrowBackIcon      from 'material-ui/lib/svg-icons/navigation/arrow-back';
import AutoComplete       from 'material-ui/lib/auto-complete';
import SelectField        from 'material-ui/lib/select-field';
import MenuItem           from 'material-ui/lib/menus/menu-item';
import Dialog             from 'material-ui/lib/dialog';
import EditIcon           from 'material-ui/lib/svg-icons/image/edit';
import FlatButton         from 'material-ui/lib/flat-button';
import IconButton         from 'material-ui/lib/icon-button';
import Paper              from 'material-ui/lib/paper';
import Table              from 'material-ui/lib/table/table';
import TableBody          from 'material-ui/lib/table/table-body';
import TableRow           from 'material-ui/lib/table/table-row';
import TableRowColumn     from 'material-ui/lib/table/table-row-column';
import TextField          from 'material-ui/lib/text-field';

import colors             from 'material-ui/lib/styles/colors';

import Confirm            from './Confirm';


// TODO: Once functional, determine if this needs to utilize redux-logic and/or morph into a stateless functional component.

/**
 * The CourseDialog component displays a dialog of the details of a given course.
 */

@ReactRedux.connect( (appState, ownProps) => {
  return {
    course:   selectors.getItemsViewDetailItem     (appState, myItemType),
    editMode: selectors.getItemsViewDetailEditMode (appState, myItemType),
  }
})

@autobind

export default class CourseDialog extends React.Component {

  static propTypes = { // expected component props
  }

  constructor(props, context) {
    super(props, context);
  }

  // conditionally close self if NO un-saved changes
  closeRequested() {
    const p = this.props;
    const unsavedChanges = p.editMode; // TODO: activate this appropriatly

    // obtain user confirmation when unsaved changes exist
    if (unsavedChanges) {
      Confirm.display({
        title: 'Course Edit',
        msg:   'You have un-saved changes ... if you leave, your changes will NOT be saved!',
        actions: [
          { txt: 'Discard Changes', action: () => this.close() }, 
          { txt: 'Go Back (in order to Save Changes)' }
        ]
      });
    }
    // close self for no outstanding unsaved changes
    else {
      this.close();
    }
  }

  // unconditionally close self
  close() {
    const p = this.props;
    p.dispatch( actions.detailItem.close(myItemType) );
  }

  changeEditMode() {
    const p = this.props;
    p.dispatch( actions.detailItem.change.detailEditMode(myItemType) );
  }

  saveEdit() {
    const p = this.props;
    p.dispatch( actions.detailItem.close(myItemType) );
    p.dispatch( actions.userMsg.display('TODO: Save Complete') );
  }

  cancelEdit() {
    const p = this.props;
    p.dispatch( actions.detailItem.close(myItemType) );
    p.dispatch( actions.userMsg.display('Edit Canceled') );
  }

  render() {
    const p = this.props;
    
    // conditionally provide Save/Cancel edit buttons
    const editActions = !p.editMode ? null : [
      <FlatButton label="Save"
                  primary={true}
                  onTouchTap={ () => {
                      this.saveEdit();
                    }}/>,
      <FlatButton label="Cancel"
                  primary={true}
                  onTouchTap={ () => {
                      this.cancelEdit();
                    }}/>,
    ];

    const contentForm = p.editMode
      ? <div style={{
               padding: '0px 15px 0px 15px',
             }}>
          <TextField floatingLabelText="Title"
                     style={{ width: '15em' }}
                     defaultValue={p.course.courseTitle}/>
          <br/>
          <TextField floatingLabelText="Description"
                     style={{ width: '15em' }}
                     defaultValue={p.course.courseDesc}/>
        </div>
      : <div style={{
               padding: '0px 15px 0px 15px',
             }}>
          {p.course.courseTitle}
          <br/>
          <br/>
          {p.course.courseDesc}
        </div>;

    return (
      <Dialog modal={false}
              open={true}
              autoScrollBodyContent={true}
              onRequestClose={this.closeRequested}
              actions={editActions}
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

            {/* button panel */}
            <div style={{
                   width:          '100%',
                   display:        'flex',
                   flexFlow:       'row nowrap',
                   alignItems:     'center',
                   justifyContent: 'space-between',
                 }}>
              <IconButton onClick={this.closeRequested}
                          iconStyle={{
                            width:  24,
                            height: 24,          
                          }}
                          style={{
                            width:   36,
                            height:  36,          
                            padding:  6,
                          }}
                          tooltip='Back'
                          tooltipPosition='top-right'>
                <ArrowBackIcon color={colors.grey700}/>
              </IconButton>
              { !p.editMode &&
                <IconButton onClick={this.changeEditMode}
                            iconStyle={{
                                width:  24,
                                height: 24,          
                              }}
                            style={{
                                width:   36,
                                height:  36,          
                                padding:  6,
                              }}
                            tooltip='Edit'
                            tooltipPosition='top-right'>
                  <EditIcon color={colors.red900}/>
                </IconButton>
              }
            </div>
            <h2>{p.course.courseNum}</h2>
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

            {/* general course info */}
            <Paper style={{
                     width:     '100%',
                     padding:   '10px 15px',
                     flex:      '0 0 auto',
                   }}
                 zDepth={4}>

              <b>Course</b>: {p.course.courseNum}
              {contentForm}

            </Paper>

            {/* spacer */}
            <div style={{
                    flex:   '0 0 auto',
                 }}>
               &nbsp;
            </div>

            {/* enrollment course info */}
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
                  { p.course.enrollment.map( (enroll, indx) => {
                      return (
                        <TableRow key={p.course.courseNum+enroll.term+enroll.student.studentNum}>
                          <TableRowColumn>{enroll.student.firstName} {enroll.student.lastName} ({enroll.student.studentNum})</TableRowColumn>
                          <TableRowColumn>
                            { !p.editMode ? enroll.grade || '' // xxx this stupid SelectField (CRAPPIENESS) CAN ONLY be controlled ... NO defaultValue semantics
                            : <SelectField floatingLabelText="Grade"
                                           style={{ width: '2em' }}
                                           value={enroll.grade}>
                                <MenuItem key={'A'} value={'A'} primaryText="A"/>
                                <MenuItem key={'B'} value={'B'} primaryText="B"/>
                                <MenuItem key={'C'} value={'C'} primaryText="C"/>
                                <MenuItem key={'D'} value={'D'} primaryText="D"/>
                                <MenuItem key={'F'} value={'F'} primaryText="F"/>
                              </SelectField>}
                          </TableRowColumn>
                          <TableRowColumn>
                            { !p.editMode ? enroll.term
                            : <AutoComplete floatingLabelText="Term"
                                            style={{ width: '8em' }}
                                            filter={AutoComplete.caseInsensitiveFilter}
                                            searchText={enroll.term}
                                            dataSource={term.terms()}
                            
                                            openOnFocus={true}
                                            onFocus={()=>console.log('xxx term: AutoComplete FOCUS')}
                                            onBlur={()=> console.log('xxx term: AutoComplete BLUR')}
                            
                                            onNewRequest={(txt, indx)=>     console.log(`xxx term: onNewRequest  txt: '${txt}', indx: ${indx}`)}
                                            onUpdateInput={(txt, dataArr)=> console.log(`xxx term: onUpdateInput txt: '${txt}'`)}
                                            />}
                          </TableRowColumn>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </Paper>

          </div>
        </div>

      </Dialog>
    );
  }
}
