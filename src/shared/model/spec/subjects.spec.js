'use strict';

import '../../util/polyfill.js';
import expect   from 'expect';
import subjects from '../subjects';


// ***
// *** all subjects tests ...
// ***

describe('subject tests', () => {


  describe('allAcademicGroups() tests', () => {
    it('Array Check', () => {
      expect(subjects.allAcademicGroups())
        .toBeA('array');
    });

    it('Expected academicGroup: Engineering', () => {
      expect(subjects.allAcademicGroups())
        .toInclude('Engineering');
    });
  });


  describe('academicGroupExists() tests', () => {
    it('NON-EXIST-GROUP', () => {
      expect(subjects.academicGroupExists('NON-EXIST-GROUP'))
        .toEqual(false);
    });

    it('Expected Group: Engineering', () => {
      expect(subjects.academicGroupExists('Engineering'))
        .toEqual(true);
    });
  });


  describe('academicGroupForSubject() tests', () => {
    it('Bad Subject', () => {
      expect( () => { subjects.academicGroupForSubject('NON-EXIST-SUBJ') })
                               .toThrow(/non-existent subject/);
    });

    it('Expected Group', () => {
      expect(subjects.academicGroupForSubject('CS'))
                      .toEqual('Engineering');
    });

    it('Non Expected Group', () => {
      expect(subjects.academicGroupForSubject('MUSIC'))
                      .toNotEqual('Engineering');
    });
  });


  describe('subjects() tests', () => {
    it('Array Check', () => {
      expect(subjects.allSubjects())
        .toBeA('array');
    });

    it('Expected subject: CS', () => {
      expect(subjects.allSubjects())
        .toInclude('CS');
    });
  });


  describe('subjectExists() tests', () => {
    it('NON-EXIST-SUBJ', () => {
      expect(subjects.subjectExists('NON-EXIST-SUBJ'))
        .toEqual(false);
    });

    it('Expected Subject: CS', () => {
      expect(subjects.subjectExists('CS'))
        .toEqual(true);
    });
  });


  describe('subjectsForAcademicGroup() tests', () => {
    it('Bad Group', () => {
      expect( () => { subjects.subjectsForAcademicGroup('NON-EXIST-GROUP') })
        .toThrow(/non-existent academicGroup/);
    });

    it('Expected Subject', () => {
      expect(subjects.subjectsForAcademicGroup('Engineering'))
        .toInclude('CS');
    });

    it('Non Expected Subject', () => {
      expect(subjects.subjectsForAcademicGroup('Engineering'))
        .toExclude('MUSIC');
    });
  });

});
