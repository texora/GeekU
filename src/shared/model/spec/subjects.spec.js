'use strict';

import '../../util/polyfill.js';
import expect   from 'expect';
import subjects from '../subjects';


// ***
// *** all subjects tests ...
// ***

describe('subject tests', () => {


  describe('academicGroups() tests', () => {
    it('Array Check', () => {
      expect(subjects.academicGroups())
        .toBeA('array');
    });

    it('Expected academicGroup: Engineering', () => {
      expect(subjects.academicGroups())
        .toInclude('Engineering');
    });
  });


  describe('academicGroupExist() tests', () => {
    it('NON-EXIST-GROUP', () => {
      expect(subjects.academicGroupExist('NON-EXIST-GROUP'))
        .toEqual(false);
    });

    it('Expected Group: Engineering', () => {
      expect(subjects.academicGroupExist('Engineering'))
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
      expect(subjects.subjects())
        .toBeA('array');
    });

    it('Expected subject: CS', () => {
      expect(subjects.subjects())
        .toInclude('CS');
    });
  });


  describe('subjectExist() tests', () => {
    it('NON-EXIST-SUBJ', () => {
      expect(subjects.subjectExist('NON-EXIST-SUBJ'))
        .toEqual(false);
    });

    it('Expected Subject: CS', () => {
      expect(subjects.subjectExist('CS'))
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
