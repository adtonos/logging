# @adtonos/logging

A simple and fast logging module for Node.js services.

Based on great package [@stool/logging](https://github.com/smialy/stool/tree/master/packages/stool-logging) by [Piotr Smialkowski](https://github.com/smialy).

## Install:

```sh
npm install @adtonos/logging
```

### Using

#### Basic usage
```js
import { getDefaultLogger } from '@adtonos/logging';
const logger = getDefaultLogger();

logger.fatal('...');
logger.error('...');
logger.warn('...');
logger.info('...');
logger.debug('...');
logger.exception(e);

```

#### Advanced usage

```js
import { getLogger, ConsoleHandler } from '@adtonos/logging';

const logger = getLogger('app'); // or with root: const logger = getLogger();
logger.setLevel('DEBUG');

const consoleHandler = new ConsoleHandler();
consoleHandler.setFormater(new SimpleFormater('{name} {levelName} {msg}'));
logger.addHandler(consoleHandler);

// create app child logger
const dbLogger = getLogger('app.db');
```

## License
MIT
