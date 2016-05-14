import React            from 'react';

import AppBar from 'material-ui/lib/app-bar';
import Log    from '../shared/util/Log';

// ??? krappy example stuff ... 
import RaisedButton     from 'material-ui/lib/raised-button';
import Dialog           from 'material-ui/lib/Dialog';
import colors           from 'material-ui/lib/styles/colors';
import FlatButton       from 'material-ui/lib/flat-button';

import ThemeManager     from 'material-ui/lib/styles/theme-manager';

import getMuiTheme      from 'material-ui/lib/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/lib/MuiThemeProvider';
import Checkbox         from 'material-ui/lib/checkbox';
import Tabs             from 'material-ui/lib/tabs/tabs';
import Tab              from 'material-ui/lib/tabs/tab';
import Paper            from 'material-ui/lib/paper';

import IconButton from 'material-ui/lib/icon-button';
import NavigationClose from 'material-ui/lib/svg-icons/navigation/close';
import IconMenu from 'material-ui/lib/menus/icon-menu';
import MoreVertIcon from 'material-ui/lib/svg-icons/navigation/more-vert';
import MenuItem from 'material-ui/lib/menus/menu-item';

import Avatar from 'material-ui/lib/avatar';

import Table from 'material-ui/lib/table/table';
import TableHeaderColumn from 'material-ui/lib/table/table-header-column';
import TableRow from 'material-ui/lib/table/table-row';
import TableHeader from 'material-ui/lib/table/table-header';
import TableRowColumn from 'material-ui/lib/table/table-row-column';
import TableBody from 'material-ui/lib/table/table-body';

import Card from 'material-ui/lib/card/card';
import CardActions from 'material-ui/lib/card/card-actions';
import CardHeader from 'material-ui/lib/card/card-header';
import CardText from 'material-ui/lib/card/card-text';

import TextField from 'material-ui/lib/text-field';

const log = new Log('GeekU');

const styles = {
  container: {
    // ? textAlign: 'center',
    // ? paddingTop: 200,
  },
};

const muiTheme = getMuiTheme({

  // ???$$$ height test NO WORKY ... appears to be restricted by a min of 50
  table: {
    // ? backgroundColor: '#ff0000',
  },
  tableRow: {
    // ? height: 10,
  },
  tableRowColumn: {
    // ? height: 180,
  },

  // ??? no worky
  paper: {
    padding: 16,
    margin: 16,
  },

  spacing: {
    // ? iconSize: 16,
    
    desktopGutter: 16,
    desktopGutterMore: 24,
    desktopGutterLess: 8,
    desktopGutterMini: 4,
    desktopKeylineIncrement: 32,
    desktopDropDownMenuItemHeight: 16,
    desktopDropDownMenuFontSize: 7,
    desktopLeftNavMenuItemHeight: 24,
    desktopSubheaderHeight: 24,
    desktopToolbarHeight: 8

    // from: material-ui/lib/styles/baseThemes/lightBaseTheme.js ...
    // iconSize: 24,
    // 
    // desktopGutter: 24,
    // desktopGutterMore: 32,
    // desktopGutterLess: 16,
    // desktopGutterMini: 8,
    // desktopKeylineIncrement: 64,
    // desktopDropDownMenuItemHeight: 32,
    // desktopDropDownMenuFontSize: 15,
    // desktopLeftNavMenuItemHeight: 48,
    // desktopSubheaderHeight: 48,
    // desktopToolbarHeight: 56
  },

  // from: material-ui/lib/styles/baseThemes/lightBaseTheme.js ...
  // fontFamily: 'Roboto, sans-serif',

  palette: {
    primary1Color:       colors.teal500,
    primary2Color:       colors.teal700,
    // primary3Color:       colors.grey400,
    accent1Color:        colors.deepOrangeA200,
    // accent2Color:        colors.grey100,
    // accent3Color:        colors.grey500,
    // textColor:           colors.darkBlack,
    // alternateTextColor:  colors.white,
    // canvasColor:         colors.white,
    // borderColor:         colors.grey300,
    pickerHeaderColor:   colors.teal500,
    // shadowColor:         colors.fullBlack,

    // from: material-ui/lib/styles/baseThemes/lightBaseTheme.js ...
    // ... made following mods (above)
    //      - change cyan to teal
    //      - change pink to deepOrange
    // primary1Color:       colors.cyan500,
    // primary2Color:       colors.cyan700,
    // primary3Color:       colors.grey400,
    // accent1Color:        colors.pinkA200,
    // accent2Color:        colors.grey100,
    // accent3Color:        colors.grey500,
    // textColor:           colors.darkBlack,
    // alternateTextColor:  colors.white,
    // canvasColor:         colors.white,
    // borderColor:         colors.grey300,
    // pickerHeaderColor:   colors.cyan500,
    // shadowColor:         colors.fullBlack,
  },
});

log.info(()=>`muiTheme:`, muiTheme);

const _students = [
  {
    "studentNum": "S-001002",
    "firstName": "Kelly",
    "lastName": "Johnson",
    "addr": {
      "state": "Ohio"
    }
  },
  {
    "studentNum": "S-001003",
    "firstName": "Stephanie",
    "lastName": "Sims",
    "addr": {
      "state": "Florida"
    }
  },
  {
    "studentNum": "S-001004",
    "firstName": "Anne",
    "lastName": "Watson",
    "addr": {
      "state": "Ohio"
    }
  },
  {
    "studentNum": "S-001005",
    "firstName": "Wanda",
    "lastName": "Hansen",
    "addr": {
      "state": "Florida"
    }
  },
  {
    "studentNum": "S-001006",
    "firstName": "Victor",
    "lastName": "Bryant",
    "addr": {
      "state": "California"
    }
  },
  {
    "studentNum": "S-001007",
    "firstName": "Donald",
    "lastName": "Lawrence",
    "addr": {
      "state": "South Carolina"
    }
  },
  {
    "studentNum": "S-001008",
    "firstName": "Jose",
    "lastName": "Little",
    "addr": {
      "state": "New Jersey"
    }
  },
  {
    "studentNum": "S-001009",
    "firstName": "Bonnie",
    "lastName": "Day",
    "addr": {
      "state": "Ohio"
    }
  },
  {
    "studentNum": "S-001010",
    "firstName": "Roger",
    "lastName": "Butler",
    "addr": {
      "state": "New York"
    }
  },
  {
    "studentNum": "S-001011",
    "firstName": "Gary",
    "lastName": "Simmons",
    "addr": {
      "state": "Ohio"
    }
  },
  {
    "studentNum": "S-001012",
    "firstName": "Dennis",
    "lastName": "Gordon",
    "addr": {
      "state": "Virginia"
    }
  },
  {
    "studentNum": "S-001013",
    "firstName": "Teresa",
    "lastName": "Miller",
    "addr": {
      "state": "New York"
    }
  },
  {
    "studentNum": "S-001014",
    "firstName": "Chris",
    "lastName": "Hayes",
    "addr": {
      "state": "Kansas"
    }
  },
  {
    "studentNum": "S-001001",
    "firstName": "Jacqueline",
    "lastName": "Adams",
    "addr": {
      "state": "Nevada"
    }
  },
  {
    "studentNum": "S-001015",
    "firstName": "Donald",
    "lastName": "Garcia",
    "addr": {
      "state": "Florida"
    }
  },
  {
    "studentNum": "S-001017",
    "firstName": "Kevin",
    "lastName": "George",
    "addr": {
      "state": "Alabama"
    }
  },
  {
    "studentNum": "S-001018",
    "firstName": "Sharon",
    "lastName": "Jones",
    "addr": {
      "state": "California"
    }
  },
  {
    "studentNum": "S-001019",
    "firstName": "Brian",
    "lastName": "Griffin",
    "addr": {
      "state": "Arizona"
    }
  },
  {
    "studentNum": "S-001016",
    "firstName": "Dorothy",
    "lastName": "Burke",
    "addr": {
      "state": "District of Columbia"
    }
  },
  {
    "studentNum": "S-001020",
    "firstName": "Dennis",
    "lastName": "Crawford",
    "addr": {
      "state": "Oklahoma"
    }
  },
  {
    "studentNum": "S-001027",
    "firstName": "Scott",
    "lastName": "Cooper",
    "addr": {
      "state": "New York"
    }
  },
  {
    "studentNum": "S-001028",
    "firstName": "Jose",
    "lastName": "Burke",
    "addr": {
      "state": "Ohio"
    }
  },
  {
    "studentNum": "S-001029",
    "firstName": "Phyllis",
    "lastName": "James",
    "addr": {
      "state": "Nevada"
    }
  },
  {
    "studentNum": "S-001021",
    "firstName": "Patrick",
    "lastName": "Richards",
    "addr": {
      "state": "Virginia"
    }
  },
  {
    "studentNum": "S-001031",
    "firstName": "Patrick",
    "lastName": "Holmes",
    "addr": {
      "state": "California"
    }
  },
  {
    "studentNum": "S-001030",
    "firstName": "Martha",
    "lastName": "Howard",
    "addr": {
      "state": "Minnesota"
    }
  },
  {
    "studentNum": "S-001033",
    "firstName": "Howard",
    "lastName": "Watkins",
    "addr": {
      "state": "California"
    }
  },
  {
    "studentNum": "S-001034",
    "firstName": "Frances",
    "lastName": "Hart",
    "addr": {
      "state": "Illinois"
    }
  },
  {
    "studentNum": "S-001036",
    "firstName": "Kathleen",
    "lastName": "Bradley",
    "addr": {
      "state": "Oklahoma"
    }
  },
  {
    "studentNum": "S-001022",
    "firstName": "Amanda",
    "lastName": "Robinson",
    "addr": {
      "state": "Oklahoma"
    }
  },
  {
    "studentNum": "S-001035",
    "firstName": "Martha",
    "lastName": "Stanley",
    "addr": {
      "state": "Florida"
    }
  },
  {
    "studentNum": "S-001037",
    "firstName": "Judith",
    "lastName": "Larson",
    "addr": {
      "state": "Tennessee"
    }
  },
  {
    "studentNum": "S-001710",
    "gender": "M",
    "firstName": "Ralph",
    "lastName": "Ramos",
    "birthday": "1910-07-12",
    "phone": "1-(281)990-3457",
    "email": "rramosjp@google.cn",
    "addr": {
      "line1": "97 Sherman Alley",
      "city": "Houston",
      "state": "Texas",
      "zip": "77075"
    },
    "gpa": "2.49",
    "graduation": "1979-Summer",
    "degree": "CHEME",
    "enrollment": [
      {
        "term": "2002-Summer",
        "grade": "B",
        "course": {
          "courseNum": "BME-5960",
          "courseTitle": "Business and Management Fundamentals for Biomedical Engineers"
        }
      },
      {
        "term": "2005-Spring",
        "grade": "F",
        "course": {
          "courseNum": "ECE-4990",
          "courseTitle": "International Research Internship"
        }
      },
      {
        "term": "2003-Summer",
        "grade": "B",
        "course": {
          "courseNum": "ECE-4960",
          "courseTitle": "Special Topics in Electrical and Computer Engineering"
        }
      }
    ]
  }
];



// ?? extend from MyComponent ?? eliminating need for bind()
class GeekUApp extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.handleRequestClose = this.handleRequestClose.bind(this);
    this.handleTouchTap     = this.handleTouchTap.bind(this);
    this.showStudent        = this.showStudent.bind(this);

    this.state = {
      students: _students,
      selectedStudent: null
    };
  }

  // ???$$$ height test
  getChildContext() {
    return {
      muiTheme: ThemeManager.getMuiTheme(muiTheme),
    };
  }


  showStudent(row, col) {
    // onRowSelection(selectedRows[])
    // ? const selectedStudent = (selectedRows.length === 0) ? null : this.state.students[selectedRows[0]];
    // ? log.info(()=>`showStudent(${selectedRows}): ${JSON.stringify(selectedStudent, null, 2)}`);
    // ? this.setState({
    // ?   selectedStudent
    // ? });
    // showStudent(row, col)
    const student = this.state.students[row];
    log.info(()=>`showStudent(${row}): ${JSON.stringify(student, null, 2)}`);
    this.setState({
      selectedStudent: student
    });
  }

  handleRequestClose() {
    this.setState({
      open: false,
    });
  }

  handleTouchTap() {
    this.setState({
      open: true,
    });
  }

  render() {
    const standardActions = <FlatButton label="Ok"
                                        secondary={true}
                                        onTouchTap={this.handleRequestClose}/>;

    // ??? display: 'inline-block' is allowing the two papers to align ??? may be better off to use a simple flexbox
    const selectedContainerStyle = {
      margin:    30,
      width:     '75%',
      // ? textAlign: 'center',
      display:   'inline-block',
    };

    // ???$$$ applying height ...  
    return <MuiThemeProvider muiTheme={muiTheme}>
      <span style={styles.container}>
        <AppBar style={{
               // backgroundColor: colors.brown400, // xx now handled via muiTheme

                  position: 'fixed', // keep AppBar at top ?? covers up 
               // top:      0,       // ?? works but not sure best way
                }}
                title={
                  <span>
                    <i>GeekU</i>
                    <Tabs style={{
                        width: '50%'
                      }}>
                      <Tab label="Students (Jane)"/>
                      <Tab label="Courses (CS-101)"/>
                    </Tabs>
                  </span>}
                iconElementRight={
                  <IconMenu iconButtonElement={ <IconButton><MoreVertIcon/></IconButton> }
                            targetOrigin={{horizontal: 'right', vertical: 'top'}}
                            anchorOrigin={{horizontal: 'right', vertical: 'top'}}>
                    <MenuItem primaryText="Refresh"/>
                    <MenuItem primaryText="Help"/>
                    <MenuItem primaryText="Sign Out"/>
                  </IconMenu>}/>

        <Paper style={{
                 margin:    15,
                 textAlign: 'left',
                 // position: 'relative', // keep AppBar at top ?? covers up fix attempt
                 // ? display:   'inline-block',
               }}
               zDepth={4}>
          <h1>Students</h1>
          <Table height={'inherit'}
                 fixedHeader={false}
                 selectable={false}
                 multiSelectable={false}
                 onCellClick={this.showStudent}>
            <TableHeader enableSelectAll={false}
                         adjustForCheckbox={false}
                         displaySelectAll={false}>
              <TableRow>
                <TableHeaderColumn tooltip="Picture">&nbsp;</TableHeaderColumn>
                <TableHeaderColumn tooltip="Student ID">ID</TableHeaderColumn>
                <TableHeaderColumn tooltip="Student Name">Name</TableHeaderColumn>
                <TableHeaderColumn tooltip="Student Origin State">Origin State</TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody deselectOnClickaway={false}
                       displayRowCheckbox={false}
                       showRowHover={true}
                       stripedRows={false}>
              {/* ???$$$ can't get the row height to adjust ... style={{height:10}} -or-  muiTheme={muiTheme}*/}
              {this.state.students.map( (student, indx) => (
                 <TableRow key={student.studentNum} selected={student===this.state.selectedStudent}>
                   <TableRowColumn><Avatar src={`https://robohash.org/${student.firstName+student.lastName}.bmp?size=100x100&set=set2&bgset=any`} size={30}/></TableRowColumn>
                   <TableRowColumn>{student.studentNum}</TableRowColumn>
                   <TableRowColumn>{student.firstName + ' ' + student.lastName}</TableRowColumn>
                   <TableRowColumn>{student.addr.state}</TableRowColumn>
                 </TableRow>
               ))}
            </TableBody>
          </Table>
        </Paper>

        { this.state.selectedStudent && 
          <Dialog title="Selected Student"
                  modal={false}
                  open={true}
                  autoScrollBodyContent={true}
                  onRequestClose={() => this.setState({selectedStudent: false})}
                  contentStyle={{
                    width: '80%',
                    maxWidth: 'none',
                    verticalAlign: 'top',
                  }}>
            <Paper zDepth={0}
                   style={{
                       width: '110',
                       display: 'inline-block'
                     }}>
              <Avatar src={`https://robohash.org/${this.state.selectedStudent.firstName+this.state.selectedStudent.lastName}.bmp?size=100x100&set=set2&bgset=any`}
                      size={100}/><br/>
              {this.state.selectedStudent.firstName} {this.state.selectedStudent.lastName}
            </Paper>
            <Paper style={selectedContainerStyle}  zDepth={4}>
              <TextField disabled={false}
                         style={{
                             width: '25%',
                             // FROM: material-ui/lib/TextField/TextField.js
                             // ? width: props.fullWidth ? '100%' : 256,
                             // ? height: (props.rows - 1) * 24 + (props.floatingLabelText ? 72 : 48),
                         }}
                         floatingLabelText="Student Number"
                         value={this.state.selectedStudent.studentNum}/>&nbsp;
              <TextField disabled={false}
                         style={{ width: 100 }}
                         floatingLabelText="First Name"
                         value={this.state.selectedStudent.firstName}/>&nbsp;
              <TextField disabled={false}
                         style={{ width: 200 }}
                         floatingLabelText="Last Name"
                         value={this.state.selectedStudent.lastName}/>
              { this.state.selectedStudent.enrollment &&
                <div>
                  <h3>Enrollment</h3>
                  <Table height={'inherit'}
                         fixedHeader={false}
                         selectable={false}
                         multiSelectable={false}>
                    <TableHeader enableSelectAll={false}
                                 adjustForCheckbox={false}
                                 displaySelectAll={false}>
                      <TableRow>
                        <TableHeaderColumn tooltip="the enrollment term">Term</TableHeaderColumn>
                        <TableHeaderColumn style={{width: 400}} tooltip="the course">Course</TableHeaderColumn>
                        <TableHeaderColumn tooltip="the grade for this course">Grade</TableHeaderColumn>
                      </TableRow>
                    </TableHeader>
                    <TableBody deselectOnClickaway={false}
                               displayRowCheckbox={false}
                               showRowHover={true}
                               stripedRows={false}>
                      {this.state.selectedStudent.enrollment.map( (enroll, indx) => (
                        <TableRow key={enroll.term+enroll.course.courseNum}>
                          <TableRowColumn>{enroll.term}</TableRowColumn>
                          <TableRowColumn style={{width: 400}}><b>{enroll.course.courseNum}</b>: {enroll.course.courseTitle}</TableRowColumn>
                          <TableRowColumn>{enroll.grade}</TableRowColumn>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              }
            </Paper>
          </Dialog>
        }

        {/* ? TRASH
        <Dialog open={this.state.open}
                title="Super Secret Password"
                actions={standardActions}
                onRequestClose={this.handleRequestClose}>
          1-2-3-4-5
        </Dialog>
        <h1>material-ui</h1>
        <h2>example project</h2>
        <RaisedButton label="Super Secret Password"
                      primary={true}
                      onTouchTap={this.handleTouchTap}/>
        <Checkbox id="checkboxId1"
                  name="checkboxName1"
                  value="checkboxValue1"
                  label="Learned Material UI Today"
                  style={{
                      width: '50%',
                    }}
                  iconStyle={{
                      // fill: colors.brown400 xx now handled via muiTheme
                    }}/>
        */}
      </span>
    </MuiThemeProvider>;

    // ?? krappy example
    // ? return <MuiThemeProvider muiTheme={muiTheme}>
    // ?   <div style={styles.container}>
    // ?     <Dialog open={this.state.open}
    // ?             title="Super Secret Password"
    // ?             actions={standardActions}
    // ?             onRequestClose={this.handleRequestClose}>
    // ?       1-2-3-4-5
    // ?     </Dialog>
    // ?     <h1>material-ui</h1>
    // ?     <h2>example project</h2>
    // ?     <RaisedButton label="Super Secret Password"
    // ?                   primary={true}
    // ?                   onTouchTap={this.handleTouchTap}/>
    // ?   </div>
    // ? </MuiThemeProvider>;
  }
}

// ???$$$
GeekUApp.childContextTypes = {
  muiTheme: React.PropTypes.object
};


export default GeekUApp;
