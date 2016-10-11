'use strict';

import React              from 'react';
import * as ReactRedux    from 'react-redux';

import {autobind}         from 'core-decorators';
import assert             from 'assert';
import {AC}               from '../../actions';
import selectors          from '../../state';

import AddCircleOutlineIcon    from 'material-ui/lib/svg-icons/content/add-circle-outline';
import RemoveCircleOutlineIcon from 'material-ui/lib/svg-icons/content/remove-circle-outline'; // replaced with standard 'x'
import IconButton              from 'material-ui/lib/icon-button';
import IconMenu                from 'material-ui/lib/menus/icon-menu';
import MenuItem                from 'material-ui/lib/menus/menu-item';
import Select                  from 'react-select'
import SelectField             from 'material-ui/lib/select-field';
import Table                   from 'material-ui/lib/table/table';
import TableBody               from 'material-ui/lib/table/table-body';
import TableRow                from 'material-ui/lib/table/table-row';
import TableRowColumn          from 'material-ui/lib/table/table-row-column';
import TextField               from 'material-ui/lib/text-field';

import colors                  from 'material-ui/lib/styles/colors';


/**
 * The SelCritDetail component provides an interactive editor for the
 * selCrit.filter data content.
 *
 * This component is based off of state found in:
 *
 *    appState.editSelCrit.selCrit.filter: [
 *      { field: "gender",     op: "EQ",  value: "F" },
 *      { field: "addr.state", op: "IN",  value: ["Missouri","Indiana"] },
 *      { field: "gpa",        op: "GTE", value: "3.65" }
 *    ]
 */

@ReactRedux.connect( (appState, ownProps) => {
  return {
    filter: selectors.getEditSelCrit(appState).selCrit.filter,
  };
})

@autobind

export default class SelCritDetail extends React.Component {

  static propTypes = { // expected component props
    meta: React.PropTypes.any.isRequired,
  }

  constructor(props, context) {
    super(props, context);

    const p = this.props;

    assert(p.meta, "<SelCritDetail> meta property is required.");
  }


  /**
   * handleFilterChange()
   */
  handleFilterChange(newFilter) {
    const p = this.props;
    p.dispatch( AC.selCrit.edit.change.filter(newFilter) );
  }


  /**
   * handleOperatorChange()
   */
  handleOperatorChange(field, opValue) {
    const p = this.props;
    const newFilter = p.filter.map( (filterObj) => {
      if (filterObj.field === field) {
        return {...filterObj, op: opValue};
      }
      else {
        return filterObj;
      }
    });
    this.handleFilterChange(newFilter);
  }


  /**
   * handleTextValueChange()
   */
  handleTextValueChange(field, txtValue) {
    const p = this.props;
    const newFilter = p.filter.map( (filterObj) => {
      if (filterObj.field === field) {
        return {...filterObj, value: txtValue}; // prune options down to strictly the value strings
      }
      else {
        return filterObj;
      }
    });
    this.handleFilterChange(newFilter);
  }


  /**
   * handleSingleSelectValueChange()
   */
  handleSingleSelectValueChange(field, value) {
    const p = this.props;
    const newFilter = p.filter.map( (filterObj) => {
      if (filterObj.field === field) {
        return {...filterObj, value: value}; // prune option down to strictly the value string
      }
      else {
        return filterObj;
      }
    });
    this.handleFilterChange(newFilter);
  }


  /**
   * handleMultiSelectValueChange()
   */
  handleMultiSelectValueChange(field, options) {
    const p = this.props;
    const newFilter = p.filter.map( (filterObj) => {
      if (filterObj.field === field) {
        return {...filterObj, value: options.map( (option) => option.value)}; // prune options down to strictly the value strings
      }
      else {
        return filterObj;
      }
    });
    this.handleFilterChange(newFilter);
  }


  /**
   * handleAddFilter()
   */
  handleAddFilter(field) {
    const p = this.props;

    const metaSelCritField = p.meta.selCritFields[field];

    const initialOperator = {
      singleSelect:      'EQ',
      multiSelect:       'IN',
      multiSelectCreate: 'IN',
      comparison:        null, // require user selection (vs. '$eq')
    };

    const initialValue = {
      singleSelect:      '',
      multiSelect:       [],
      multiSelectCreate: [],
      comparison:        '',
    };

    const newFilterObj = { field, op: initialOperator[metaSelCritField.type], value: initialValue[metaSelCritField.type]};

    const newFilter    = [...(p.filter || []), newFilterObj];

    this.handleFilterChange(newFilter);
  }


  /**
   * handleDeleteFilter()
   */
  handleDeleteFilter(field) {
    const p = this.props;

    const indx           = p.filter.findIndex( (filter) => filter.field === field );
    const newFilter = [...p.filter.slice(0,indx), ...p.filter.slice(indx+1)];
    this.handleFilterChange(newFilter);
  }


  /**
   * genFilterOperatorElm(filterObj)
   */
  genFilterOperatorElm(filterObj) {
    const p = this.props;

    const metaSelCritField = p.meta.selCritFields[filterObj.field];

    switch (metaSelCritField.type) {

      case 'singleSelect':
        return 'matches';

      case 'multiSelect':
      case 'multiSelectCreate':
        return 'any of';

      case 'comparison':
        return (
          <SelectField value={filterObj.op}
                       onChange={ (e, key, value) => this.handleOperatorChange(filterObj.field, value) }
                       errorText={filterObj.op ? null : 'operator is required'}
                       style={{width: '4em'}}
                       iconStyle={{fill: '#666'}}
                       hintText="operator">
            <MenuItem value="EQ"  primaryText="="/>
            <MenuItem value="GT"  primaryText=">"/>
            <MenuItem value="GTE" primaryText=">="/>
            <MenuItem value="LT"  primaryText="<"/>
            <MenuItem value="LTE" primaryText="<="/>
            <MenuItem value="NE"  primaryText="!="/>
          </SelectField>
        );

      default:
        return `UNSUPPORTED meta.selCritFields.type: '${metaSelCritField.type}' with value: ${filterObj.value}`;
    }
  }


  /**
   * genFilterValueElm(filterObj)
   */
  genFilterValueElm(filterObj) {
    const p = this.props;

    const metaSelCritField = p.meta.selCritFields[filterObj.field];

    switch (metaSelCritField.type) {

      case 'singleSelect':
        return (
          <SelectField value={filterObj.value}
                       onChange={ (e, key, value) => this.handleSingleSelectValueChange(filterObj.field, value) }
                       errorText={filterObj.value ? null : 'value is required'}
                       autoWidth={true}
                       iconStyle={{fill: '#666'}}>
            { metaSelCritField.options.map( (option) => {
                return <MenuItem key={option.value} value={option.value} primaryText={option.label}/>
              })}
          </SelectField>
        );

      case 'multiSelect':
        return <Select multi={true}
                       style={{width: '10em'}}
                       options={metaSelCritField.options}
                       value={filterObj.value}
                       onChange={ (options) => this.handleMultiSelectValueChange(filterObj.field, options) }
                       placeholder={<span style={{color: colors.red900}}>value is required</span>}
                       resetValue={[]}/>;

      case 'multiSelectCreate': // TODO: multiSelectCreate is NOT operational because allowCreate is NOT supported in react-select 1.0.0-beta (for now, don't use)
        return <Select multi={true}
                       allowCreate={true}
                       style={{width: '10em'}}
                       options={metaSelCritField.options}
                       value={filterObj.value}
                       onChange={ (options) => this.handleMultiSelectValueChange(filterObj.field, options) }
                       placeholder={<span style={{color: colors.red900}}>value is required</span>}
                       resetValue={[]}/>;

      case 'comparison':
        return <TextField style={{ width: '20em' }}
                          value={filterObj.value}
                          onChange={ (e) => this.handleTextValueChange(filterObj.field, e.target.value) }
                          errorText={filterObj.value ? null : 'value is required'}/>;

      default:
        return `UNSUPPORTED meta.selCritFields.type: '${metaSelCritField.type}' with value: ${filterObj.value}`;
    }
  }


  /**
   * render()
   */
  render() {
    const p = this.props;

    const metaSelCritFields = Object.keys(p.meta.selCritFields);

    return (
      <div style={{width: '100%'}}>
        <span style={{color: 'grey'}}>Selection Criteria:</span>
        <IconMenu iconButtonElement={ <IconButton title="Add new field to Selection Criteria">
                                        <AddCircleOutlineIcon color={colors.deepOrangeA200}/>
                                      </IconButton> }
                  targetOrigin={{vertical: 'top', horizontal: 'right', }}
                  anchorOrigin={{vertical: 'top', horizontal: 'right'}}>
          { metaSelCritFields.map( (field) => { // add MenuItem's for fields that are NOT already part of the filter
              return ((p.filter || []).find( (filter) => filter.field === field))
                     ? null
                     : <MenuItem key={field} 
                                 primaryText={p.meta.validFields[field]}
                                 onTouchTap={()=> this.handleAddFilter(field)}/>;
          })}
        </IconMenu>
        <br/>
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
            { (p.filter || []).map( (filterObj) => {
                return (
                  <TableRow key={filterObj.field}>
                    <TableRowColumn>{p.meta.validFields[filterObj.field]}</TableRowColumn>
                    <TableRowColumn>{this.genFilterOperatorElm(filterObj)}</TableRowColumn>
                    <TableRowColumn>{this.genFilterValueElm(filterObj)}</TableRowColumn>
                    <TableRowColumn>
                      <IconButton title="Remove field from Selection Criteria"
                                  onTouchTap={()=> this.handleDeleteFilter(filterObj.field)}>
                        <RemoveCircleOutlineIcon color={colors.deepOrangeA200}/>
                      </IconButton>
                    </TableRowColumn>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </div>
    );
  }
}
