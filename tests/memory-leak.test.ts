/*
 * memory-leak.test.js: Tests for memory leak (https://github.com/winstonjs/winston/issues/1871)
 */

import { assert } from "chai";

import { LEVELS } from "../src/consts";
import { Logger, SimpleFormater, ConsoleHandler } from "../src/index";

describe("@adtonos/logging :: Memory leak", function () {
  it("should not leak memory when logging a lot", function (done) {
    this.timeout(30 * 1000);

    let logger = new Logger("test");
    const handler = new ConsoleHandler(LEVELS.INFO);
    handler.setFormater(new SimpleFormater());
    logger.addHandler(handler);

    if (global.gc) {
      global.gc();
    }
    const totalMemBefore =
      Math.round((process.memoryUsage().rss / 1024 / 1024) * 100) / 100; // MB

    let iter = 0;
    while (iter <= 3000000) {
      iter += 1;
      logger.debug("BENCHMARK LOG");
    }

    if (global.gc) {
      global.gc();
    }
    // wait for GC to finish cleanup
    setTimeout(() => {
      const totalMemAfter =
        Math.round((process.memoryUsage().rss / 1024 / 1024) * 100) / 100; // MB

      assert.isBelow(
        totalMemAfter,
        totalMemBefore * 1.2,
        "shouldn't take more than 20% extra mem"
      );
      done();
    }, 100);
  });
});
