import { assert } from 'chai';
import { LEVELS } from '../src/consts';
import { CountRepeatsConsoleHandler } from '../src/handlers';
import { IRecord, Logger, BaseHandler, SimpleFormater } from '../src/index';

describe('@adtonos/logging :: handler', () => {
  class TestHandler extends CountRepeatsConsoleHandler {
    public output: string[] = [];
    public rawEmit(text: string): void {
      this.output.push(text);
    }
  }

  it('should show lines without duplication message', () => {
    let logger = new Logger('test');
    const handler = new TestHandler();
    logger.addHandler(handler);

    logger.info('info-1');
    logger.debug('debug-1');

    assert.deepEqual(handler.output, ['test | INFO: info-1', 'test | DEBUG: debug-1']);
  });

  it('should show how many duplicates', () => {
    let logger = new Logger('test');
    const handler = new TestHandler();
    logger.addHandler(handler);

    logger.info('info-1');
    logger.info('info-1');
    logger.info('info-1');
    logger.info('other');

    assert.deepEqual(handler.output, [
      'test | INFO: info-1',
      'The last line was repeated 2 more times.',
      'test | INFO: other',
    ]);
  });

  it('should stringify rest of data', () => {
    let logger = new Logger('test');
    const handler = new TestHandler(LEVELS.NOTSET, 21);
    logger.addHandler(handler);

    logger.info('prefix-1 message');
    logger.info('prefix-2 message');
    logger.info('prefix-3 message');
    logger.info('other');

    assert.deepEqual(handler.output, [
      'test | INFO: prefix-1 message',
      'The last line was repeated 2 more times.',
      'test | INFO: other',
    ]);
  });
});
