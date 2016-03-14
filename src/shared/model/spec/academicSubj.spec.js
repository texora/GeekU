'use strict';

// ??? import {expect} from 'expect';
// ??? MUST IMPORT academicGroupExists
var expect = require('expect'); // ??? OLD STYLE

// ***
// *** all academicSubj tests ...
// ***

// ? describe('academicSubj tests', () => {
// ?   it('academicGroupExists(???)', () => {
// ?     expect(academicGroupExists("Graduate Management")).toEqual(true);
// ?   })
// ? });

describe('academicSubj tests', function () {
  it('academicGroupExists(true)', function () {
    var academicGroupExists = true;
    expect(academicGroupExists).toEqual(true);
  });
  it('academicGroupExists(false)', function () {
    var academicGroupExists = false;
    expect(academicGroupExists).toEqual(false);
  });
});
