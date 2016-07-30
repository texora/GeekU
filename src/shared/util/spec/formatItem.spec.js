'use strict';

import '../../util/polyfill';
import expect     from 'expect';
import formatItem from '../formatItem';

describe('formatItem() tests', () => {

  describe('test formatItem(undefined)', () => {
    testIt(undefined, 'undefined');
  });

  describe('test formatItem(null)', () => {
    testIt(null, 'null');
  });

  describe('test formatItem(function)', () => {
    testIt(()=>{}, 'function');
  });

  describe('test formatItem(string)', () => {
    testIt('myStr', "'myStr'");
  });

  describe('test formatItem(Date)', () => {
    testIt(new Date('05 October 2011 14:48 UTC'), '2011-10-05T14:48:00.000Z');
  });

  describe('test formatItem(Array)', () => {
    testIt([1,'two'], `[
  1,
  "two"
]`);
  });

  describe('test formatItem(Object)', () => {
    testIt({key1: 'value1', key2: 2}, `{
  "key1": "value1",
  "key2": 2
}`);
  });

  describe('test formatItem(number)', () => {
    testIt(123, '123');
  });

});

function testIt(item, expectedResult) {
  it(`${item}`, () => {
    expect(formatItem(item)).toEqual(expectedResult);
  });
}
