'use strict';

/**
 * Promotes valid GeekU Grades: A/B/C/D/F.
 * 
 * This utility is used for validation (client/server), and client-side
 * GUI list drivers, etc.
 * 
 * Due to the static nature of these elements, a programmatic
 * maintenance is utilized, rather than one modeled in our DB (refer
 * to the "Internals" section below).
 */


//***
//*** Public API
//***

const grade = {

  // promote all grades <string[]>
  grades() {
    return _allGrades;
  },
  

  // is supplied grade valid? <boolean>
  isValid(grade) {
    return _credits[grade] !== undefined;
  },


  // promote the numeric credit for the supplied grade (used in GPA calculation). <number>
  credit(grade) {
    return _credits[grade] || 0.0;
  },


  // calculate a gpa for the supplied grades (based on a 4.0 scale). <number>
  gpa(...grades) {
    let gpa = 0.0;
    for (const grade of grades) {
      gpa += this.credit(grade);
    }
    gpa = gpa / grades.length;
    return gpa;
  },

};
export default grade;



//***
//*** Internals
//***

// credits for each grade
const _credits = {
  A: 4.0,
  B: 3.0,
  C: 2.0,
  D: 1.0,
  F: 0.0
};


// ALL grades <string[]>
const _allGrades = []; // ... machine genereated (below)
for (let grade in _credits) {
  _allGrades.push(grade);
}
