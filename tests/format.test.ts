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

    assert.deepEqual(handler.events, ['test::INFO::info-1', 'test::DEBUG::debug-1']);
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
});
