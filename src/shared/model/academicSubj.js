'use strict';

/**
 * Promotes both AcademicGroups Subjects and the relationship between
 * them (AcademicGroups --1:M-- Subjects).
 *
 * This utility is used for validation, and GUI drivers for lists, etc.
 */

// for each academicGroup, an array of subjects
const academicGroups = {
  "Engineering": ["AEP", "BME", "CHEME", "CEE", "CS", "EAS", "ECE", "ENGRC", "ENGRD", "ENGRG", "ENGRI", "INFO", "MSE", "MAE", "NSE", "ORIE", "STSCI", "SYSEN"],
  "Graduate Management": ["NBA", "NCC", "NMI", "NRE"],
  "Arts and Sciences": [ "AMST", "ANTHR", "ARKEO", "ARTH", "ASTRO", "BSOC", "CHEM", "CLASS", "COGST", "ECON", "ENGL", "FREN", "GERST", "GOVT", "HIST", "JAPAN", "JPLIT", "JWST", "LATIN", "LING", "MATH", "MEDVL", "MUSIC", "PHIL", "PHYS", "PSYCH", "RELST", "STS", "WRIT",],
};

// for each subject, it's cooresponding academicGroups
const subjects = {}; // ... machine genereated (below)
for (let academicGroup in academicGroups) {
  const subjs = academicGroups[academicGroup];
  for (let subj of subjs) {
    subjects[subj] = academicGroup;
  }
}

// ? console.log("??? Wow: academicGroups: ", academicGroups);
// ? console.log("??? Zee: subjects: ", subjects);

export function academicGroupExists(academicGroup) {
  return academicGroups[academicGroup] ? true : false;
}
