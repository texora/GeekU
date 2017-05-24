'use strict';

import React              from 'react';
import * as ReactRedux    from 'react-redux';

import {autobind}         from 'core-decorators';

import itemTypes          from '../../shared/domain/itemTypes';
const  myItemType         = itemTypes.student;

import selectors          from '../state';

import FontIcon           from 'material-ui/lib/font-icon';
import TableRowColumn     from 'material-ui/lib/table/table-row-column';

import colors             from 'material-ui/lib/styles/colors';

import ItemsView          from './ItemsView';
import StudentDialog      from './StudentDialog';


/**
 * The StudentsView component implements the view displaying a student list.
 */

@ReactRedux.connect( (appState, ownProps) => {
  return {
    // NOTE: some of thes properties may only be used by our base class (ItemsView)
    itemsViewShown:  selectors.getActiveView            (appState) === myItemType,

    selectedItem:    selectors.getItemsViewSelectedItem (appState, myItemType),
    detailItem:      selectors.getItemsViewDetailItem   (appState, myItemType),

    inProgress:      selectors.isItemsViewInProgress    (appState, myItemType),
    selCrit:         selectors.getItemsViewSelCrit      (appState, myItemType),
    items:           selectors.getItemsViewItems        (appState, myItemType),
  }
})

@autobind

export default class StudentsView extends ItemsView {

  static propTypes = { // expected component props
  }


  constructor(props, context) {
    super(props, context);
  }


  /**
   * Return the meta object describing the concrete item being displayed.
   *
   * DERIVATION-HOOK
   */
  meta() {
    return itemTypes.meta[myItemType];
  }


  /**
   * Provide a derivation hook to perform any preperation for the
   * overall render process.
   *
   * DERIVATION-HOOK (by default, does nothing)
   */
  renderPrep() {
    const p = this.props;

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
    this.displayFirstNameFirst = analyzeFirstNameFirst();

    // define the order that our columns are displayed (based on selCrit)
    const displayFieldOrder = p.selCrit.fields && p.selCrit.fields.length > 0
            ? p.selCrit.fields
            : Object.keys(this.meta().defaultDisplayFields); // default found in meta obj

    // define a map of all fields to display ... ex: { 'lastName': true, 'firstName': true }
    this.fieldsInDisplay = displayFieldOrder.reduce( (obj, field) => {
      obj[field] = true;
      return obj;
    }, {});

  }


  /**
   * Provide a derivation hook to apply any item preperation for the
   * the renderField() process.
   *
   * @param {Student} student the student to prep.
   *
   * DERIVATION-HOOK (by default, does nothing)
   */
  renderItemPrep(student) {

    const genderColor = student.gender==='M' ? colors.blue900 : colors.pink300;
    const genderDisp  = this.fieldsInDisplay.gender // gendor-icon - alternative to Avatar (simply too expensive for LARGE lists)
                          ? <FontIcon className="material-icons" color={genderColor}>person</FontIcon>
                          : null;
    
    // format fullName based on optional sort order of first/last ... 'Bridges, Kevin' ... or 'Kevin Bridges'
    let fullName = '';
    if (this.displayFirstNameFirst) {
      if (this.fieldsInDisplay.firstName) {
        fullName += student.firstName;
      }
      if (this.fieldsInDisplay.lastName) {
        fullName += (fullName ? ' ' : '') + student.lastName;
      }
    }
    else {
      if (this.fieldsInDisplay.lastName) {
        fullName += student.lastName;
      }
      if (this.fieldsInDisplay.firstName) {
        fullName += (fullName ? ', ' : '') + student.firstName;
      }
    }

    // group studentEssentials in one field ... displays much better in <TableRow>
    this.studentEssentials = <TableRowColumn key={`${student.studentNum}-studentEssentials`}>
                               {genderDisp}
                               {fullName}
                               {this.fieldsInDisplay.studentNum ? <i>{` (${student.studentNum})`}</i> : <i/>}
                             </TableRowColumn>;

    // maintain indicator as to whether studentEssentials have been displayed (only do once per row)
    this.studentEssentialsDisplayed = false;

  }


  /**
   * Render the supplied student/field in a <TableRowColumn> element.
   *
   * @param {Student} student the student record which the field resides.
   * @param {string} field the field name of the student to render.
   *
   * @return {TableRowColumn} the <TableRowColumn> element containing the rendered field (or null to display nothing)
   *
   * DERIVATION-HOOK (by default, simply display un-labeled field value)
   */
  renderField(student, field) {

    // our fieldDisplayCntl provides additional control on how each field is displayed
    const fieldDisplayCntl = _fieldDisplayCntl[field];

    // never displayed (rare)
    if (!fieldDisplayCntl) {
      return null;
    }

    // display as part of our studentEssentials aggregate
    else if (fieldDisplayCntl==='#studentEssentials#') {
      if (this.studentEssentialsDisplayed) {
        return null;
      }
      this.studentEssentialsDisplayed = true;
      return [
        this.studentEssentials,
        this.hoverControls
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

  }


  /**
   * Render the Dialog element that manages the item-type detail.
   *
   * @return {Element}
   *
   * DERIVATION-HOOK
   */
  renderDetailDialog() {
    return <StudentDialog/>;
  }

}


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
