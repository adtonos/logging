import { assert } from 'chai';
import { IRecord, Logger, BaseHandler, SimpleFormater } from '../src/index';

describe('@adtonos/logging :: formater', () => {
  class TestHandler extends BaseHandler {
    public events: string[] = [];
    public emit(record: IRecord): void {
      this.events.push(this.formater.format(record));
    }
  }

  it('should generate simple format', () => {
    let logger = new Logger('test');
    const handler = new TestHandler();
    handler.setFormater(new SimpleFormater());
    logger.addHandler(handler);

    logger.info('info-1');
    logger.debug('debug-1');

    assert.deepEqual(handler.events, ['test | INFO: info-1', 'test | DEBUG: debug-1']);
  });

  it('should generate custom format', () => {
    let logger = new Logger('test');
    const handler = new TestHandler();
    handler.setFormater(new SimpleFormater('{name}|{levelName}|{msg}'));
    logger.addHandler(handler);

    logger.info('info-1');
    logger.debug('debug-1');

    assert.deepEqual(handler.events, ['test|INFO|info-1', 'test|DEBUG|debug-1']);
  });

  it('should stringify rest of data', () => {
    let logger = new Logger('test');
    const handler = new TestHandler();
    handler.setFormater(new SimpleFormater());
    logger.addHandler(handler);

    logger.info('info-1', { param1: 'p1', param2: true, param3: { sumparam: 123 } });
    logger.debug('debug-1', {});

    assert.deepEqual(handler.events, [
      'test | INFO: info-1 param1=p1, param2=true, sumparam=123',
      'test | DEBUG: debug-1',
    ]);
  });

  it('should attach exception details in the log', () => {
    let logger = new Logger('test');
    const handler = new TestHandler();
    handler.setFormater(new SimpleFormater());
    logger.addHandler(handler);

    const err = new Error('TestException');

    logger.info('info-1', err);

    assert(handler.events[0].startsWith('test | INFO: info-1 Error: TestException'));
  });

  it('should attach exception details and extra data in the log', () => {
    let logger = new Logger('test');
    const handler = new TestHandler();
    handler.setFormater(new SimpleFormater());
    logger.addHandler(handler);

    const err = new Error('TestException');

    logger.debug('info-1', err, { extra: true, next: err });

    const result = handler.events[0];
    assert(result.startsWith('test | DEBUG: info-1 Error: TestException\nstack: '), `exception in ${result}`);
    assert(result.endsWith('extra=true, next=Error: TestException'), `stringify extra not found in ${result}`);
  });
});
