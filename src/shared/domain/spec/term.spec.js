'use strict';

import '../../util/polyfill.js';
import expect from 'expect';
import term   from '../term';


// ***
// *** all term tests ...
// ***

describe('term tests', () => {

  describe('terms() tests', () => {

    const terms = term.terms();
    // console.log(`terms(): ${terms}`);
    it('terms()', () => {
      expect(terms).toInclude('2017-Fall');
      expect(terms).toInclude('2017-Summer');
      expect(terms).toInclude('2017-Spring');
      expect(terms).toInclude('2016-Fall');
      expect(terms).toInclude('1966-Spring');
      expect(terms).toExclude('1965-Fall');
    });

    const filteredTerms = term.terms('1988');
    it('term.terms("1988") 3 element', () => {
      expect(filteredTerms.length).toEqual(3);
      expect(filteredTerms).toInclude('1988-Spring');
      expect(filteredTerms).toInclude('1988-Summer');
      expect(filteredTerms).toInclude('1988-Fall');
    });

    const filteredTerms2 = term.terms('summer');
    it('term.terms("summer") 0 element (case sensitive)', () => {
      expect(filteredTerms2.length).toEqual(0);
    });

    const filteredTerms3 = term.terms('88-Sum');
    it('term.terms("88-Sum") 1 element', () => {
      expect(filteredTerms3.length).toEqual(1);
      expect(filteredTerms3).toInclude('1988-Summer');
    });


  });

  describe('isValid() tests', () => {
    function test_isValid(testTerm, expectedValue) {
      it(testTerm, () => {
        expect(term.isValid(testTerm)).toEqual(expectedValue);
      });
    }
    test_isValid('',              false);
    test_isValid('Ouch',          false);
    test_isValid('1978-Spring',   true);
    test_isValid('1974-Summer',   true);
    test_isValid('2011-Fall',     true);
    test_isValid('1966-Fall',     true); // boundry
    test_isValid('1965-Fall',     false);
    test_isValid('1978-',         false);
    test_isValid('1978',          false);
    test_isValid('1978-Ouch',     false);
    test_isValid('1978-Spring-x', false);
  });

  describe('validate() tests', () => {
    function test_validate(testTerm, expectedValue) {
      it(testTerm, () => {
        const expectRes = expect(term.validate(testTerm));
        if (expectedValue)
          expectRes.toContain(expectedValue);
        else
          expectRes.toEqual(expectedValue);
      });
    }
    test_validate('',              'Year NOT supplied');
    test_validate('Ouch',          'Invalid Year');
    test_validate('1978-Spring',   null);
    test_validate('1974-Summer',   null);
    test_validate('2011-Fall',     null);
    test_validate('1966-Fall',     null); // boundry
    test_validate('1965-Fall',     'out of range');
    test_validate('1978-',         'Session NOT supplied');
    test_validate('1978',          'Session NOT supplied');
    test_validate('1978-Ouch',     'Invalid session');
    test_validate('1978-Spring-',  'Too many elements');
    test_validate('1978-Spring-x', 'Too many elements');
  });

  describe('compare() tests', () => {

    let terms = null;
    beforeEach( () => {
      terms = ['1966-Fall',
               '2015-Fall',
               '1966-Spring',
               '2015-Spring',
               '1966-Summer',
               '2015-Summer',];
    });

    it('sort() oldest first', () => {
      terms.sort(term.compare);
      expect(terms).toEqual(['1966-Spring',
                             '1966-Summer',
                             '1966-Fall',
                             '2015-Spring',
                             '2015-Summer',
                             '2015-Fall',]);
    });

    it('sort() newest first', () => {
      terms.sort( (a,b) => {return term.compare(a,b)*-1;} );
      expect(terms).toEqual(['2015-Fall',
                             '2015-Summer',
                             '2015-Spring',
                             '1966-Fall',
                             '1966-Summer',
                             '1966-Spring',]);
    });

  });

});
