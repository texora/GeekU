'use strict';

/**
 * Promotes both AcademicGroups, Subjects, and the relationship between
 * them (AcademicGroups --1:M-- Subjects).
 *
 * This utility is used for validation (client/server), and client-side 
 * GUI drivers for lists, etc.
 */


//***
//*** public API
//***

// promote all academicGroups <string[]>
export function academicGroups() {
  return _allAcademicGroups;
}

// does supplied academicGroup exist? <boolean>
export function academicGroupExists(academicGroup) {
  return _academicGroups[academicGroup] ? true : false;
}

// promote academicGroup for given subject <string>
export function academicGroupForSubject(subject) {
  const academicGroup = _subjects[subject];
  if (!academicGroup)
    throw new Error(`ERROR: academicGroupForSubject('${subject}') ... non-existent subject`);
  return academicGroup;
}

// promote all subjects <string[]>
export function subjects() {
  return _allSubjects;
}

// does supplied subject exist? <boolean>
export function subjectExists(subject) {
  return _subjects[subject] ? true : false;
}

// promote subjects for given academicGroup <string[]>
export function subjectsForAcademicGroup(academicGroup) {
  const subjects = _academicGroups[academicGroup];
  if (!subjects)
    throw new Error(`ERROR: subjectsForAcademicGroup('${academicGroup}') ... non-existent academicGroup`);
  return subjects;
}



//***
//*** internals
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
