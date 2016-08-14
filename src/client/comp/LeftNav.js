'use strict';

import React               from 'react';
import * as ReactRedux     from 'react-redux';

import assert              from 'assert';
import autobind            from 'autobind-decorator';

import {AC}                from '../actions';
import SelCrit             from '../../shared/util/SelCrit';

import Confirm             from './Confirm';
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
 * GeekU LeftNav component.
 */

@ReactRedux.connect( (appState, ownProps) => {
  return {
    filters:         appState.filters,
    selectedView:        appState.selectedView,
    studentsSelCrit: appState.studentsView.selCrit,
    coursesSelCrit:  null, // appState.courses.selCrit, // TODO: NOT available yet
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


  //***
  //*** handleSelection(selCrit) ... select the view using the supplied selCrit
  //***
  //***   selCrit ... 
  //***     - target-string: create/select a new selCrit of target type ('Students' or 'Courses')
  //***     - selCrit:       select the supplied selCrit
  //***

  // TODO: consider embedding ALL Selection logic in this one method
  handleSelection(selCrit) {
    if (selCrit==='Students')             this.handleStudentsSelection(null);
    else if (selCrit==='Courses')         this.handleCoursesSelection(null);
    else if (selCrit.target==='Students') this.handleStudentsSelection(selCrit);
    else if (selCrit.target==='Courses')  this.handleCoursesSelection(selCrit);
    else throw new Error(`LeftNav.handleSelection() INVALID selCrit supplied: ${FMT(selCrit)}`);
  }

  handleStudentsSelection(selCrit) {
    const p = this.props;

    // we always close our LeftNav
    this.setState({open: false})

    // create/use new selCrit
    if (!selCrit) {
      // start an edit session of a new selCrit
      EditSelCrit.edit('Students', (newSelCrit) => {
        return AC.selectStudentsView(newSelCrit);
      });
    }

    // use selected selCrit
    else {
      p.dispatch( AC.selectStudentsView(selCrit) );
    }

  }
  
  handleCoursesSelection() {
    const p = this.props;

    const actions = [ AC.selectCoursesView.activate() ];

    // TODO: add this with courses are supported

    p.dispatch( actions );
  }



  //***
  //*** handleEdit(selCrit) ... edit the supplied selCrit
  //***

  // TODO: consider embedding ALL Edit logic in this one method
  handleEdit(selCrit) {
    if (selCrit.target==='Students')
      this.handleStudentsEdit(selCrit);
    else
      this.handleCoursesEdit(selCrit);
  }

  handleStudentsEdit(selCrit) {
    const p = this.props;

    // start an edit session with supplied selCrit
    EditSelCrit.edit(selCrit, selCrit => {
      // on edit change ... issue re-retrieval IF view is currently based on this selCrit
      const selCritDisplayedInView = p.studentsSelCrit && p.studentsSelCrit.key === selCrit.key;
      if (selCritDisplayedInView) {
        return AC.selectStudentsView(selCrit); // side-effect of refactor is it will select view too :-(
      }
      else {
        return null;
      }
      
    });
  }

  handleCoursesEdit(selCrit) {
    console.log('TODO: handleCoursesEdit()');
  }



  //***
  //*** handleSave(selCrit) ... save the supplied selCrit
  //***

  handleSave(selCrit) {
    if (selCrit.target==='Students')
      this.handleStudentsSave(selCrit);
    else
      this.handleCoursesSave(selCrit);
  }

  handleStudentsSave(selCrit) {
    const p = this.props;
    p.dispatch( AC.selCrit.save(selCrit) ) // SAVE selCrit
     .then( savedSelCrit => {              // SYNC our view when using same selCrit
        const selCritDisplayedInView = p.studentsSelCrit && p.studentsSelCrit.key === savedSelCrit.key;
        if (selCritDisplayedInView) {
          p.dispatch( AC.selectStudentsView(savedSelCrit) ) // side-effect of refactor is it will select view too :-(
        }
      });
  }

  handleCoursesSave(selCrit) {
    console.log('TODO: handleCoursesSave()');
  }



  //***
  //*** handleDuplicate(selCrit) ... duplicate the supplied selCrit
  //***

  handleDuplicate(selCrit) {
    if (selCrit.target==='Students')
      this.handleStudentsDuplicate(selCrit);
    else
      this.handleCoursesDuplicate(selCrit);
  }

  handleStudentsDuplicate(selCrit) {
    // duplicate ths supplied selCrit
    const dupSelCrit = SelCrit.duplicate(selCrit);

    // close our LeftNav
    this.setState({open: false});

    // start an edit session with this selCrit
    EditSelCrit.edit(dupSelCrit, (changedDupSelCrit) => {
      return AC.selectStudentsView(changedDupSelCrit);
    });
  }

  handleCoursesDuplicate(selCrit) {
    console.log('TODO: handleCoursesDuplicate()');
  }



  //***
  //*** handleDelete(selCrit) ... delete the supplied selCrit
  //***

  handleDelete(selCrit) {
    if (selCrit.target==='Students')
      this.handleStudentsDelete(selCrit);
    else
      this.handleCoursesDelete(selCrit);
  }

  handleStudentsDelete(selCrit) {
    const p = this.props;

     Confirm.display({
       title: 'Delete Filter',
       msg:   `Please confirm deletion of filter: ${selCrit.name} -  ${selCrit.desc}`,
       actions: [
         { txt: 'Delete',
           action: () => {
             const impactView = (p.studentsSelCrit && p.studentsSelCrit.key === selCrit.key) ? 'Students' : null;
             if (SelCrit.isPersisted(selCrit)) { // is persised in DB
               p.dispatch( AC.selCrit.delete(selCrit, impactView) );
             }
             else { // is an in-memory only representation
               p.dispatch( AC.selCrit.delete.complete(selCrit, impactView) );
             }
           } },
         { txt: 'Cancel' },
       ]
     });
  }

  handleCoursesDelete(selCrit) {
    console.log('TODO: handleCoursesDelete()');
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
      
        { ['Students', 'Courses'].map( (target) => {
      
          const selectedSelCrit = target==='Students' ? p.studentsSelCrit : p.coursesSelCrit;

          return (
            <Card key={target} initiallyExpanded={true}>
            
              <CardTitle title={target}
                         titleStyle={{fontSize: 20}}
                         actAsExpander={true}
                         showExpandableButton={true}/>
            
              <CardText expandable={true}>
                { p.filters.map( (selCrit) => {
                    if (selCrit.target===target) {
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
            
                <MenuItem primaryText={<i>... New Filter</i>} insetChildren={true} onTouchTap={ () => this.handleSelection(target)}/>
            
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
