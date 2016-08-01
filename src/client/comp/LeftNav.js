'use strict';

import React                from 'react';
import ReduxUtil            from '../util/ReduxUtil';
import IconButton           from 'material-ui/lib/icon-button';
import IconMenu             from 'material-ui/lib/menus/icon-menu';
import MenuItem             from 'material-ui/lib/menus/menu-item';
import MenuIcon             from 'material-ui/lib/svg-icons/navigation/menu';
import autoBindAllMethods   from '../../shared/util/autoBindAllMethods';
import {AC}                 from '../actions';
import EditSelCrit          from './EditSelCrit';


/**
 * GeekU LeftNav component.
 */
const LeftNav = ReduxUtil.wrapCompWithInjectedProps(

  class LeftNav extends React.Component { // component definition
    constructor(props, context) {
      super(props, context);
      autoBindAllMethods(this);
    }

    // selCrit ... 
    //   - 'selectView': to select view only
    //   - null:         create/use new selCrit
    //   - selCrit:      use supplied selCrit
    handleStudentsSelection(selCrit) {
      const p = this.props;

      // process select view only
      if (selCrit === 'selectView') {
        p.dispatch( AC.changeMainPage('Students') );
      }

      // create/use new selCrit
      else if (!selCrit) {
        // start an edit session of a new selCrit
        EditSelCrit.edit(selCrit, (newSelCrit) => {
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

    render() {
      const p = this.props;

      // ... why is MenuIcon the opposite color of the baseTheme?
      //     - I suspect because it is supposed to appear on the baseTheme background
      //     - I altered to white when displayed in my toolbar (which is darker on a light background)
      return <IconMenu iconButtonElement={ <IconButton><MenuIcon color="white"/></IconButton> }
                       targetOrigin={{vertical: 'top', horizontal: 'left', }}
                       anchorOrigin={{vertical: 'top', horizontal: 'left'}}>

        <MenuItem primaryText="Students" onTouchTap={ () => this.handleStudentsSelection('selectView')}/>
        { p.filters.map( (selCrit) => {
            if (selCrit.target==='Students') {
              const txt = selCrit.curHash===selCrit.dbHash
                           ? selCrit.name
                           : <span title="changes are NOT saved" style={{color: 'red', fontStyle: 'italic'}}>{selCrit.name}</span>;
              return <MenuItem key={selCrit.key} primaryText={txt} checked={p.studentsSelCrit && p.studentsSelCrit.key===selCrit.key} insetChildren={true} onTouchTap={ () => this.handleStudentsSelection(selCrit)}/>
            }
            else {
              return null;
            }
          })}
        <MenuItem primaryText={<i>... new</i>} insetChildren={true} onTouchTap={ () => this.handleStudentsSelection(null)}/>

        <MenuItem primaryText="Courses"  onTouchTap={ () => this.handleCoursesSelection('selectView') }/>
      </IconMenu>;
    }
  }, // end of ... component definition

  { // component property injection
    mapStateToProps(appState, ownProps) {
      return {
        filters:         appState.filters,
        mainPage:        appState.mainPage,
        studentsSelCrit: appState.students.selCrit,
      }
    }
  }); // end of ... component property injection

// define expected props
LeftNav.propTypes = {
}

export default LeftNav;
