'use strict';

import '../../util/polyfill.js';
import expect from 'expect';
import grade   from '../grade';


// ***
// *** all grade tests ...
// ***

describe('grade tests', () => {

  describe('grades() tests', () => {

    const grades = grade.grades();
    // console.log(`grades(): ${grades}`);
    it('grades()', () => {
      expect(grades).toEqual(['A','B','C','D','F']);
    });

  });

  describe('isValid() tests', () => {
    function test_isValid(testGrade, expectedValue) {
      it(testGrade, () => {
        expect(grade.isValid(testGrade)).toEqual(expectedValue);
      });
    }
    test_isValid('A',        true);
    test_isValid('B',        true);
    test_isValid('C',        true);
    test_isValid('D',        true);
    test_isValid('F',        true);
    test_isValid(null,       false);
    test_isValid('E',        false);
    test_isValid(new Date(), false);
  });

  describe('credit() tests', () => {
    function test_credit(testGrade, expectedValue) {
      it(testGrade, () => {
        expect(grade.credit(testGrade)).toEqual(expectedValue);
      });
    }
    test_credit('A',        4.0);
    test_credit('B',        3.0);
    test_credit('C',        2.0);
    test_credit('D',        1.0);
    test_credit('F',        0.0);
    test_credit(null,       0.0);
    test_credit('E',        0.0);
    test_credit(new Date(), 0.0);
  });

  describe('gpa() tests', () => {
    it('A/B', () => {
      expect(grade.gpa('A', 'B')).toEqual(3.5);
    });
    it('A/A/A/A/A', () => {
      expect(grade.gpa('A','A','A','A','A')).toEqual(4.0);
    });
    it('A/B/C/A/A', () => {
      expect(grade.gpa('A','B','C','A','A')).toEqual(3.4);
    });
    it('[A,B,C,A,A]', () => {
      expect(grade.gpa(...['A','B','C','A','A'])).toEqual(3.4);
    });
  });

});
