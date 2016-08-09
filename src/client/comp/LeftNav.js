'use strict';

import React               from 'react';
import ReduxUtil           from '../util/ReduxUtil';

import assert              from 'assert';
import autoBindAllMethods  from '../../shared/util/autoBindAllMethods';

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
const LeftNav = ReduxUtil.wrapCompWithInjectedProps(

  class LeftNav extends React.Component { // component definition
    constructor(props, context) {
      super(props, context);

      autoBindAllMethods(this);

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
      else                                  this.handleCoursesSelection(selCrit);
    }

    handleStudentsSelection(selCrit) {
      const p = this.props;

      // we always close our LeftNav
      this.setState({open: false})

      // create/use new selCrit
      if (!selCrit) {
        // start an edit session of a new selCrit
        EditSelCrit.edit('Students', (newSelCrit) => {
          return [
            AC.changeMainPage('Students'),   // display view
            AC.retrieveStudents(newSelCrit), // with new selCrit
          ];
        });
      }

      // use selected selCrit
      else {
        const actions = [ AC.changeMainPage('Students') ];

        // refresh view when it is NOT reflective of this selCrit
        if (!p.studentsSelCrit ||                            // view not yet retrieved -or-
            p.studentsSelCrit.key     !== selCrit.key ||     // view currently has different selCrit -or-
            p.studentsSelCrit.curHash !== selCrit.curHash) { // view currently has different version of selCrit
              actions.push(AC.retrieveStudents(selCrit));
        }

        p.dispatch( actions );
      }

    }
    
    handleCoursesSelection() {
      const p = this.props;

      const actions = [ AC.changeMainPage('Courses') ];

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

      // determine if our view is using this selCrit
      const selCritDisplayedInView = p.studentsSelCrit && p.studentsSelCrit.key === selCrit.key;

      // when view is using this selCrit, refresh it (in edit() completion callback)
      const refreshViewFn = selCritDisplayedInView
                              ? (changedSelCrit) => AC.retrieveStudents(changedSelCrit)
                              : null;

      // start an edit session with this selCrit
      EditSelCrit.edit(selCrit, refreshViewFn);
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
      p.dispatch( AC.selCrit.save(selCrit) );
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
        return [
          AC.changeMainPage('Students'),          // display view
          AC.retrieveStudents(changedDupSelCrit), // with our duplicated selCrit
        ];
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
               if (selCrit.dbHash) { // is persised in DB
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
        
            const targetSelCrit = target==='Students' ? p.studentsSelCrit : p.coursesSelCrit;

            return (
              <Card key={target} initiallyExpanded={true}>
              
                <CardTitle title={target}
                           titleStyle={{fontSize: 20}}
                           actAsExpander={true}
                           showExpandableButton={true}/>
              
                <CardText expandable={true}>
                  { p.filters.map( (selCrit) => {
                      if (selCrit.target===target) {
                        const txt = selCrit.curHash===selCrit.dbHash
                                     ? selCrit.name
                                     : <span title="filter changes are NOT saved" style={{color: colors.deepOrangeA200, fontStyle: 'italic'}}>{selCrit.name}</span>;
                        if (this.state.editMode) {
                          return (
                            <MenuItem key={selCrit.key}
                                      primaryText={txt}
                                      insetChildren={true}
                                      checked={targetSelCrit && targetSelCrit.key===selCrit.key}
                                      rightIcon={<MoreVertIcon color={colors.grey700}/>}
                                      menuItems={[
                                        <MenuItem primaryText="Edit Filter"      onTouchTap={ () => this.handleEdit(selCrit) }/>,
                                        <MenuItem primaryText="Save Filter"      onTouchTap={ () => this.handleSave(selCrit) } disabled={SelCrit.isSaved(selCrit)}/>,
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
                                      checked={targetSelCrit && targetSelCrit.key===selCrit.key}
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
  }, // end of ... component definition

  { // component property injection
    mapStateToProps(appState, ownProps) {
      return {
        filters:         appState.filters,
        mainPage:        appState.mainPage,
        studentsSelCrit: appState.students.selCrit,
        coursesSelCrit:  null, // appState.courses.selCrit, // TODO: NOT available yet
      }
    }
  }); // end of ... component property injection

// define expected props
LeftNav.propTypes = {
}

export default LeftNav;

// our one-and-only instance
let _singleton = null;
