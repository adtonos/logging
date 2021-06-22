import { assert } from 'chai';

import { IRecord, Filter, Filterer } from '../src/index';

describe('@adtonos/logging :: Filters', () => {
  function makeRecord(name: string): IRecord {
    return {
      name,
      timestamp: 1234,
      created: '2021-05-11T21:29:18.195Z',
      createdDate: new Date(),
      level: 1,
    };
  }

  it('Filter', () => {
    let filter = new Filter('a.b');

    assert.notOk(filter.filter(makeRecord('a')), 'a.b FAIL a');
    assert.notOk(filter.filter(makeRecord('a.bc')), 'a.bc FAIL a.b');
    assert.ok(filter.filter(makeRecord('a.b')), 'a.b PASS a.b');
    assert.ok(filter.filter(makeRecord('a.b.c')), 'a.b.c PASS a.b');
  });

  it('Filterer.addFilter(filter)', () => {
    let filter = new Filterer();
    assert.ok(filter.addFilter(new Filter('a')));
    assert.ok(filter.addFilter((record) => record.name === 'a'));
  });

  it('Filterer.filter', () => {
    let filter = new Filterer();
    filter.addFilter(new Filter('a.b'));
    assert.notOk(filter.filter(makeRecord('a')), 'a.b FAIL a');
    assert.notOk(filter.filter(makeRecord('a.bc')), 'a.bc FAIL a.b');
    assert.ok(filter.filter(makeRecord('a.b')), 'a.b PASS a.b');
    assert.ok(filter.filter(makeRecord('a.b.c')), 'a.b.c PASS a.b');
  });

  it('Filterer.removeFilter()', () => {
    let filter = new Filterer();
    let f = new Filter('a.b');
    filter.addFilter(f);
    filter.removeFilter(f);
    assert.ok(filter.filter(makeRecord('a')), 'a.b PASS a');
    assert.ok(filter.filter(makeRecord('a.bc')), 'a.bc PASS a.b');
    assert.ok(filter.filter(makeRecord('a.b')), 'a.b PASS a.b');
    assert.ok(filter.filter(makeRecord('a.b.c')), 'a.b.c PASS a.b');
  });
});
