'use strict';

import                            '../../util/polyfill.js';
import expect                from 'expect';
import {academicGroupExists} from '../academicSubj';


// ***
// *** all academicSubj tests ...
// ***

describe('academicSubj tests', () => {

  it('academicGroupExists("NON Existant Academic Group")', () => {
    expect(academicGroupExists("NON Existant Academic Group")).toEqual(false);
  });

  it('academicGroupExists("Graduate Management")', () => {
    expect(academicGroupExists("Graduate Management")).toEqual(true);
  });

});
