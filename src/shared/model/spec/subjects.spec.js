'use strict';

import '../../util/polyfill.js';
import expect         from 'expect';
import * as underTest from '../subjects';


// ***
// *** all subjects tests ...
// ***

describe('subject tests', () => {


  describe('academicGroups() tests', () => {
    it('Array Check', () => {
      expect(underTest.academicGroups())
        .toBeA('array');
    });

    it('Expected academicGroup: Engineering', () => {
      expect(underTest.academicGroups())
        .toInclude('Engineering');
    });
  });


  describe('academicGroupExists() tests', () => {
    it('NON-EXIST-GROUP', () => {
      expect(underTest.academicGroupExists('NON-EXIST-GROUP'))
        .toEqual(false);
    });

    it('Expected Group: Engineering', () => {
      expect(underTest.academicGroupExists('Engineering'))
        .toEqual(true);
    });
  });


  describe('academicGroupForSubject() tests', () => {
    it('Bad Subject', () => {
      expect( () => { underTest.academicGroupForSubject('NON-EXIST-SUBJ') })
                               .toThrow(/non-existent subject/);
    });

    it('Expected Group', () => {
      expect(underTest.academicGroupForSubject('CS'))
                      .toEqual('Engineering');
    });

    it('Non Expected Group', () => {
      expect(underTest.academicGroupForSubject('MUSIC'))
                      .toNotEqual('Engineering');
    });
  });


  describe('subjects() tests', () => {
    it('Array Check', () => {
      expect(underTest.subjects())
        .toBeA('array');
    });

    it('Expected subject: CS', () => {
      expect(underTest.subjects())
        .toInclude('CS');
    });
  });


  describe('subjectExists() tests', () => {
    it('NON-EXIST-SUBJ', () => {
      expect(underTest.subjectExists('NON-EXIST-SUBJ'))
        .toEqual(false);
    });

    it('Expected Subject: CS', () => {
      expect(underTest.subjectExists('CS'))
        .toEqual(true);
    });
  });


  describe('subjectsForAcademicGroup() tests', () => {
    it('Bad Group', () => {
      expect( () => { underTest.subjectsForAcademicGroup('NON-EXIST-GROUP') })
        .toThrow(/non-existent academicGroup/);
    });

    it('Expected Subject', () => {
      expect(underTest.subjectsForAcademicGroup('Engineering'))
        .toInclude('CS');
    });

    it('Non Expected Subject', () => {
      expect(underTest.subjectsForAcademicGroup('Engineering'))
        .toExclude('MUSIC');
    });
  });

});
