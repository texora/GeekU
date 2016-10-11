'use strict';

import React               from 'react';
import * as ReactRedux     from 'react-redux';

import assert              from 'assert';
import {autobind}          from 'core-decorators';

import {AC}                from '../actions';
import selectors           from '../state';
import SelCrit             from '../../shared/domain/SelCrit';
import itemTypes           from '../../shared/domain/itemTypes';

import EditSelCrit         from './EditSelCrit';

import AppBar              from 'material-ui/lib/app-bar';
import ArrowBackIcon       from 'material-ui/lib/svg-icons/navigation/arrow-back';
import Card                from 'material-ui/lib/card/card';
import CardText            from 'material-ui/lib/card/card-text';
import CardTitle           from 'material-ui/lib/card/card-title';
import ConfigIcon          from 'material-ui/lib/svg-icons/action/settings';
import IconButton          from 'material-ui/lib/icon-button';
import LeftNavMUI          from 'material-ui/lib/left-nav'; // NOTE: using LeftNavMUI because original Material UI component name (LeftNav) conflicts with ours
import MenuItem            from 'material-ui/lib/menus/menu-item';
import MoreVertIcon        from 'material-ui/lib/svg-icons/navigation/more-vert';
import colors              from 'material-ui/lib/styles/colors';


/**
 * The GeekU LeftNav component.
 *
 * NOTE: We maintain our own internal state for this LeftNav component
 *       (open/editMode).  This is done for no definitive reason other
 *       than to simplify our overall appState (with what could be
 *       considered burdensome low-level information).  This is really
 *       no different from using low-level 3rd party components (such as
 *       react-select) that maintain their own state.  This heuristic could
 *       easily be changed (if desired).
 *
 * NOTE: Because of our state management (see note above) the LeftNav is
 *       a component class vs. a stateless functional component.  As a
 *       result our handleXxx() functionality is implemented as methods
 *       rather than injected function properties.
 */

@ReactRedux.connect( (appState, ownProps) => {
  return {
    filters: selectors.getFilters(appState),
    appState,
  }
})

@autobind

export default class LeftNav extends React.Component {

  static propTypes = { // expected component props
  }

  constructor(props, context) {
    super(props, context);

    // keep track of our one-and-only instance
    assert(!_singleton, "<LeftNav> only ONE LeftNav is needed and therefore may be instantiated within the app.");
    _singleton = this;

    // define initial state controlling our display
    this.state = {
      open:     false,
      editMode: false
    };
  }

  /**
   * Open our one-and-only LeftNav ... a public access point.
   *
   * @public
   */
  static open() {
    // validate that an <LeftNav> has been instantiated
    assert(_singleton, "LeftNav.display() ... ERROR: NO <LeftNav> has been instantiated within the app.");

    // pass-through to our instance method
    _singleton.open();
  }

  open() {
    this.setState({
      open:     true,
      editMode: false
    });
  }

  handleVisible(open) {
    this.setState({open});
  }

  handleEditModeToggle() {
    this.setState({editMode: !this.state.editMode});
  }


  /**
   * Select the view to display the supplied selCrit.
   * 
   * @param {SelCrit -or- itemType-string} selCrit the selCrit to
   * select (in the view):
   *   - itemType-string: create/select a new selCrit of itemType
   *   - selCrit:         select the supplied selCrit
   */
  handleSelection(selCrit) {
    const p = this.props;

    // for selCrit object ... activate it
    if (SelCrit.isSelCrit(selCrit)) {
      p.dispatch( AC.itemsView(selCrit.itemType, selCrit, 'activate') );
    }

    // for itemType-string ... create a new selCrit of the specified itemType and edit/activate it
    else if (typeof selCrit === 'string') {
      const itemType = selCrit;
      assert(itemTypes[itemType], `LeftNav.handleSelection() INVALID itemType-string: ${FMT(itemType)}`);

      // start an edit session with a new selCrit of specified itemType
      const newSelCrit = SelCrit.new(itemType);
      p.dispatch( AC.selCrit.edit(newSelCrit, 
                                  true, // isNew
                                  this.state.editMode
                                    ? SelCrit.SyncDirective.none
                                    : SelCrit.SyncDirective.activate ) );
    }

    // invalid param
    else {
      throw new TypeError(`LeftNav.handleSelection() INVALID selCrit param: ${FMT(selCrit)}`);
    }

    // close our LeftNav, providing we are NOT in the edit mode
    if (!this.state.editMode) {
      this.setState({open: false});
    }
  }


  /**
   * Edit the supplied selCrit.
   * 
   * @param {SelCrit} selCrit the selCrit to edit.
   */
  handleEdit(selCrit) {
    const p = this.props;
    p.dispatch( AC.selCrit.edit(selCrit) );
  }


  /**
   * Save the supplied selCrit.
   * 
   * @param {SelCrit} selCrit the selCrit to save.
   */
  handleSave(selCrit) {
    const p = this.props;
    p.dispatch( AC.selCrit.save(selCrit) );
  }


  /**
   * Duplicate the supplied selCrit.
   * 
   * @param {SelCrit} selCrit the selCrit to duplicate.
   */
  handleDuplicate(selCrit) {
    const p = this.props;

    // start an edit session with a duplicated (new) selCrit
    const dupSelCrit = SelCrit.duplicate(selCrit);
    p.dispatch( AC.selCrit.edit(dupSelCrit, 
                                true, // isNew
                                SelCrit.SyncDirective.none ) );

    // close our LeftNav, providing we are NOT in the edit mode
    if (!this.state.editMode) {
      this.setState({open: false});
    }
  }


  /**
   * Delete the supplied selCrit.
   * 
   * @param {SelCrit} selCrit the selCrit to delete.
   */
  handleDelete(selCrit) {
    const p = this.props;
    p.dispatch( AC.selCrit.delete(selCrit) );
  }


  render() {
    const p = this.props;

    return (
      <LeftNavMUI docked={false}
                  open={this.state.open}
                  onRequestChange={this.handleVisible}>
      
        <AppBar title={this.state.editMode ? 'Configure Views' : 'Select View'}
                showMenuIconButton={false}
                iconElementRight={<IconButton onTouchTap={this.handleEditModeToggle}
                                              title={this.state.editMode ? 'go back to select view/filter' : 'change mode to configure view filters'}>
                                    {this.state.editMode ? <ArrowBackIcon/> : <ConfigIcon/>}
                                  </IconButton>}/>
      
        { itemTypes.meta.allTypes.map( (itemType) => {
      
          const selectedSelCrit = selectors.getItemsViewSelCrit(p.appState, itemType);

          return (
            <Card key={itemType} initiallyExpanded={false}>
            
              <CardTitle title={itemTypes.meta[itemType].label.plural}
                         titleStyle={{fontSize: 20}}
                         actAsExpander={true}
                         showExpandableButton={true}/>
            
              <CardText expandable={true}>
                { p.filters.map( (selCrit) => {
                    if (selCrit.itemType===itemType) {
                      const txt = SelCrit.isCurrentContentSaved(selCrit)
                                   ? selCrit.name
                                   : <span title="filter changes are NOT saved" style={{color: colors.deepOrangeA200, fontStyle: 'italic'}}>{selCrit.name}</span>;
                      if (this.state.editMode) {
                        return (
                          <MenuItem key={selCrit.key}
                                    primaryText={txt}
                                    insetChildren={true}
                                    checked={selectedSelCrit && selectedSelCrit.key===selCrit.key}
                                    rightIcon={<MoreVertIcon color={colors.grey700}/>}
                                    menuItems={[
                                      <MenuItem primaryText="Edit Filter"      onTouchTap={ () => this.handleEdit(selCrit) }/>,
                                      <MenuItem primaryText="Save Filter"      onTouchTap={ () => this.handleSave(selCrit) } disabled={SelCrit.isCurrentContentSaved(selCrit)}/>,
                                      <MenuItem primaryText="Duplicate Filter" onTouchTap={ () => this.handleDuplicate(selCrit) }/>,
                                      <MenuItem primaryText="Delete Filter"    onTouchTap={ () => this.handleDelete(selCrit) }/>,
                                    ]}/>
                        );
                      }
                      else {
                        return (
                          <MenuItem key={selCrit.key}
                                    primaryText={txt}
                                    insetChildren={true}
                                    checked={selectedSelCrit && selectedSelCrit.key===selCrit.key}
                                    onTouchTap={ () => this.handleSelection(selCrit)}/>
                        );
                      }
                    }
                    else {
                      return null;
                    }
                  })}
            
                <MenuItem primaryText={<i>... New Filter</i>} insetChildren={true} onTouchTap={ () => this.handleSelection(itemType)}/>
            
              </CardText>
            </Card>
          );
        })}
      
      </LeftNavMUI>
    );
  }
}

// our one-and-only instance
let _singleton = null;
