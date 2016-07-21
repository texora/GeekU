'use strict';

import React              from 'react';
import ReduxUtil          from '../util/ReduxUtil';

import autoBindAllMethods from '../../shared/util/autoBindAllMethods';

import moment             from 'moment';

import {AC}               from '../state/actions';

import subject            from '../../shared/model/subject';
import term               from '../../shared/model/term';

import ArrowBackIcon      from 'material-ui/lib/svg-icons/navigation/arrow-back';
import AutoComplete       from 'material-ui/lib/auto-complete';
import SelectField        from 'material-ui/lib/select-field';
import MenuItem           from 'material-ui/lib/menus/menu-item';
import Avatar             from 'material-ui/lib/avatar';
import DatePicker         from 'material-ui/lib/date-picker/date-picker';
import Dialog             from 'material-ui/lib/dialog';
import Divider            from 'material-ui/lib/divider';
import EditIcon           from 'material-ui/lib/svg-icons/image/edit';
import FlatButton         from 'material-ui/lib/flat-button';
import IconButton         from 'material-ui/lib/icon-button';
import Paper              from 'material-ui/lib/paper';
import RadioButton        from 'material-ui/lib/radio-button';
import RadioButtonGroup   from 'material-ui/lib/radio-button-group';
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
      const p = this.props;
      const unsavedChanges = p.editMode; // TODO: activate this appropriatly

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
      const p = this.props;
      p.dispatch( AC.detailStudent.close() );
    }

    changeEditMode() {
      const p = this.props;
      p.dispatch( AC.detailStudent.changeEditMode() );
    }

    saveEdit() {
      const p = this.props;
      p.dispatch([ AC.detailStudent.close(),
                   AC.userMsg.display('TODO: Save Complete') ]);
    }

    cancelEdit() {
      const p = this.props;
      p.dispatch([ AC.detailStudent.close(),
                   AC.userMsg.display('Edit Canceled') ]);
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


      const contentForm = p.editMode ?
        <div style={{
               padding: '0px 15px 0px 15px',
             }}>
          <TextField floatingLabelText="First"
                     style={{ width: '15em' }}
                     defaultValue={p.student.firstName}/>
          &emsp;
          <TextField floatingLabelText="Last"
                     style={{ width: '15em' }}
                     defaultValue={p.student.lastName}/>
          <br/>
          <TextField floatingLabelText="Email"
                     style={{ width: '15em' }}
                     defaultValue={p.student.email}
                     hintText="yourMail@gmail.com"/>
          &emsp;
          <TextField floatingLabelText="Phone"
                     style={{ width: '15em' }}
                     defaultValue={p.student.phone}
                     hintText="618.555.1212"/>
          <br/>
          <TextField floatingLabelText="Address"
                     style={{ width: '15em' }}
                     defaultValue={p.student.addr.line1}
                     hintText="line 1"/>
          <br/>
          <TextField style={{ width: '15em' }}
                     defaultValue={p.student.addr.line2}
                     hintText="line 2"/>
          <br/>
          <TextField floatingLabelText="City"
                     style={{ width: '10em' }}
                     defaultValue={p.student.addr.city}/>
          &emsp;
          <AutoComplete floatingLabelText="State"
                        style={{ width: '10em' }}
                        filter={AutoComplete.caseInsensitiveFilter}
                        searchText={p.student.addr.state}
                        dataSource={['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming']}

                        openOnFocus={true}
                        onFocus={()=>console.log('xxx AutoComplete FOCUS')}
                        onBlur={()=> console.log('xxx AutoComplete BLUR')}

                        onNewRequest={(txt, indx)=>     console.log(`xxx onNewRequest  txt: '${txt}', indx: ${indx}`)}
                        onUpdateInput={(txt, dataArr)=> console.log(`xxx onUpdateInput txt: '${txt}'`)}

                        />
          &emsp;
          &emsp;
          &emsp;
          {/*
            AutoComplete CRAPPIENESS ...
            - this component is REALLY BAD ... definitly NOT production ready
            - NO WORK: openOnFocus={true}
            - NO WORK: onFocus={()=>console.log('xxx AutoComplete now has focus')}
            - NO WORK: maxSearchResults={5}
            - can't figure out how to FORCE selection (it accepts free-formed entered text)
            - open={true} causes weird error
                ... popover.js:278 Uncaught TypeError: Cannot read property 'getBoundingClientRect' of null
            - keyboard focus tab order goes into oblivia after selection
            - popup is ALL OVER THE PLACE - JUMPY JUMPY (sometimes on top of screen)
            - doesn't support async data source (that I can tell)
          */}
          <TextField floatingLabelText="Zip"
                     style={{ width: '4em' }}
                     defaultValue={p.student.addr.zip}/>
        </div>
      : <div style={{
               padding: '0px 15px 0px 15px',
             }}>
          {p.student.email}
          <Divider/>
          {p.student.phone}
          <Divider/>
          {p.student.addr.line1}<br/>
          {p.student.addr.line2 ? <span>{p.student.addr.line2}<br/></span> : <i/>}
          {p.student.addr.city}, {p.student.addr.state}  {p.student.addr.zip}<br/>
        </div>;

      const profileForm = p.editMode ?
        <div style={{
               padding: '0px 15px 0px 15px',
             }}>

          <div style={{
                 display:        'flex',
                 flexFlow:       'row nowrap',
                 justifyContent: 'space-between',
                 alignItems:     'center',
               }}>

            <RadioButtonGroup name="gender"
                              defaultSelected={p.student.gender}
                              style={{ width: '10em' }}>
              <RadioButton value='M'
                           label='Male'/>
              <RadioButton value='F'
                           label='Female'/>
            </RadioButtonGroup>

            <DatePicker floatingLabelText="Birthday"
                        autoOk={true}
                        style={{ width: '8em' }}
                        textFieldStyle={{ width: '8em' }}
                        minDate={moment().subtract(200, 'years').toDate() /* we have some really old dates in our data */}
                        formatDate={(date)=> moment(date).format('YYYY-MM-DD')}
                        defaultDate={moment(p.student.birthday, 'YYYY-MM-DD').toDate()}
                        />
            {/*
              DatePicker CRAPPIENESS ...
              - no way to simply enter date as a string
              - it is a MONSTOR BIG dialog ... container="inline" is TOO BIG for my dialog
            */}

            <AutoComplete floatingLabelText="Degree"
                          style={{ width: '4em' }}
                          filter={AutoComplete.caseInsensitiveFilter}
                          searchText={p.student.degree}
                          dataSource={subject.subjects()}

                          openOnFocus={true}
                          onFocus={()=>console.log('xxx degree: AutoComplete FOCUS')}
                          onBlur={()=> console.log('xxx degree: AutoComplete BLUR')}

                          onNewRequest={(txt, indx)=>     console.log(`xxx degree: onNewRequest  txt: '${txt}', indx: ${indx}`)}
                          onUpdateInput={(txt, dataArr)=> console.log(`xxx degree: onUpdateInput txt: '${txt}'`)}
                          />

            <TextField floatingLabelText="GPA"
                       style={{ width: '4em' }}
                       type='number'
                       disabled={true}
                       defaultValue={p.student.gpa}/>

            <AutoComplete floatingLabelText="Graduation"
                          style={{ width: '6em' }}
                          filter={AutoComplete.caseInsensitiveFilter}
                          searchText={p.student.graduation}
                          dataSource={term.terms()}

                          openOnFocus={true}
                          onFocus={()=>console.log('xxx graduation: AutoComplete FOCUS')}
                          onBlur={()=> console.log('xxx graduation: AutoComplete BLUR')}

                          onNewRequest={(txt, indx)=>     console.log(`xxx graduation: onNewRequest  txt: '${txt}', indx: ${indx}`)}
                          onUpdateInput={(txt, dataArr)=> console.log(`xxx graduation: onUpdateInput txt: '${txt}'`)}
                          />
          </div>
        </div>
      : <div style={{
               padding: '0px 15px 0px 15px',
             }}>
          {p.student.gender==='M' ? 'Male' : 'Female'} ... <i>Birthday</i>: {p.student.birthday}
          <br/>
          <i>Degree</i>: {p.student.degree} ... <i>GPA</i>: {p.student.gpa} ... <i>Graduation</i>: {p.student.graduation}
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
              <Avatar src={`https://robohash.org/${p.student.firstName + p.student.lastName}.bmp?size=100x100&set=set2&bgset=any`}
                      size={100}/>
              <h2>{p.student.firstName} {p.student.lastName}</h2>
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

                <b>Contact</b>: {p.student.studentNum}
                {contentForm}

                <br/>
                <b>Profile</b>:
                {profileForm}

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
                    { p.student.enrollment.map( (enroll, indx) => {
                        return (
                          <TableRow key={p.student.studentNum+enroll.term+enroll.courseNum}>
                            <TableRowColumn>{enroll.course.courseNum}</TableRowColumn>
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
    }
  }); // end of ... component property injection

// define expected props
Student.propTypes = {
}

export default Student;
