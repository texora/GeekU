'use strict';

/**
 * Promotes GeekU Subjects, and AcademicGroups, along with the
 * associative relationship between them:
 *
 *   AcademicGroups --1:M-- Subjects
 *
 * A subject is a consistent acronym used within one field of study,
 * and is prefixed by each course of that subject.  For example, the
 * subject "CS" represents Computer Science studies, and CS-1001 is
 * one course within that curriculum.
 *
 * AcademicGroups is a classification of several study fields
 * (i.e. Subjects).  For example, the AcademicGroup of "Engineering"
 * contains several Subjects, including "CS".
 * 
 * This utility is used for validation (client/server), and
 * client-side GUI drivers of lists, etc.
 *
 * Due to the static nature of these elements, a programmatic
 * maintenance is utilized, rather than one modeled in our DB (refer
 * to the "Internals" section below).
 */


//***
//*** Public API
//***

const subjects = {

  // promote all academicGroups <string[]>
  allAcademicGroups() {
    return _allAcademicGroups;
  },

  // does supplied academicGroup exist? <boolean>
  academicGroupExists(academicGroup) {
    return _academicGroups[academicGroup] ? true : false;
  },

  // promote academicGroup for given subject <string>
  academicGroupForSubject(subject) {
    const academicGroup = _subjects[subject];
    if (!academicGroup)
      throw new Error(`ERROR: academicGroupForSubject('${subject}') ... non-existent subject`);
    return academicGroup;
  },

  // promote all subjects <string[]>
  allSubjects() {
    return _allSubjects;
  },

  // does supplied subject exist? <boolean>
  subjectExists(subject) {
    return _subjects[subject] ? true : false;
  },

  // promote subjects for given academicGroup <string[]>
  subjectsForAcademicGroup(academicGroup) {
    const subjects = _academicGroups[academicGroup];
    if (!subjects)
      throw new Error(`ERROR: subjectsForAcademicGroup('${academicGroup}') ... non-existent academicGroup`);
    return subjects;
  },

};
export default subjects;



//***
//*** Internals
//***

// for each academicGroup <string>, an array of subjects <string[]>
const _academicGroups = {
  'Engineering': ['AEP', 'BME', 'CHEME', 'CEE', 'CS', 'EAS', 'ECE', 'ENGRC', 'ENGRD', 'ENGRG', 'ENGRI', 'INFO', 'MSE', 'MAE', 'NSE', 'ORIE', 'STSCI', 'SYSEN'],
  'Graduate Management': ['NBA', 'NCC', 'NMI', 'NRE'],
  'Arts and Sciences': [ 'AMST', 'ANTHR', 'ARKEO', 'ARTH', 'ASTRO', 'BSOC', 'CHEM', 'CLASS', 'COGST', 'ECON', 'ENGL', 'FREN', 'GERST', 'GOVT', 'HIST', 'JAPAN', 'JPLIT', 'JWST', 'LATIN', 'LING', 'MATH', 'MEDVL', 'MUSIC', 'PHIL', 'PHYS', 'PSYCH', 'RELST', 'STS', 'WRIT',],
};

// for each subject <string>, it's cooresponding academicGroups <string>
const _subjects = {}; // ... machine genereated (below)

// ALL subjects <string[]>
const _allSubjects = []; // ... machine genereated (below)

// ALL academicGroups <string[]>
const _allAcademicGroups = []; // ... machine genereated (below)

// machine generate various renditions, from the master definition in academicGroups
for (let academicGroup in _academicGroups) {
  const subjs = _academicGroups[academicGroup];
  _allAcademicGroups.push(academicGroup);  // generate: _allAcademicGroups
  for (let subj of subjs) {
    _subjects[subj] = academicGroup;       // generate: _subjects
    _allSubjects.push(subj);               // generate: _allSubjects
  }
}
_allAcademicGroups.sort();
_allSubjects.sort();
