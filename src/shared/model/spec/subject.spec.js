'use strict';

import '../../util/polyfill.js';
import expect   from 'expect';
import subject from '../subject';


// ***
// *** all subjects tests ...
// ***

describe('subject tests', () => {


  describe('academicGroups() tests', () => {
    it('Array Check', () => {
      expect(subject.academicGroups())
        .toBeA('array');
    });

    it('Expected academicGroup: Engineering', () => {
      expect(subject.academicGroups())
        .toInclude('Engineering');
    });
  });


  describe('academicGroupExists() tests', () => {
    it('NON-EXIST-GROUP', () => {
      expect(subject.academicGroupExists('NON-EXIST-GROUP'))
        .toEqual(false);
    });

    it('Expected Group: Engineering', () => {
      expect(subject.academicGroupExists('Engineering'))
        .toEqual(true);
    });
  });


  describe('academicGroupForSubject() tests', () => {
    it('Bad Subject', () => {
      expect( () => { subject.academicGroupForSubject('NON-EXIST-SUBJ') })
        .toThrow(/non-existent subject/);
    });

    it('Expected Group', () => {
      expect(subject.academicGroupForSubject('CS'))
        .toEqual('Engineering');
    });

    it('Non Expected Group', () => {
      expect(subject.academicGroupForSubject('MUSIC'))
        .toNotEqual('Engineering');
    });
  });


  describe('subjects() tests', () => {
    it('Array Check', () => {
      expect(subject.subjects())
        .toBeA('array');
    });

    it('Expected subject: CS', () => {
      expect(subject.subjects())
        .toInclude('CS');
    });
  });


  describe('subjectExists() tests', () => {
    it('NON-EXIST-SUBJ', () => {
      expect(subject.subjectExists('NON-EXIST-SUBJ'))
        .toEqual(false);
    });

    it('Expected Subject: CS', () => {
      expect(subject.subjectExists('CS'))
        .toEqual(true);
    });
  });


  describe('subjectsForAcademicGroup() tests', () => {
    it('Bad Group', () => {
      expect( () => { subject.subjectsForAcademicGroup('NON-EXIST-GROUP') })
        .toThrow(/non-existent academicGroup/);
    });

    it('Expected Subject', () => {
      expect(subject.subjectsForAcademicGroup('Engineering'))
        .toInclude('CS');
    });

    it('Non Expected Subject', () => {
      expect(subject.subjectsForAcademicGroup('Engineering'))
        .toExclude('MUSIC');
    });
  });

});
