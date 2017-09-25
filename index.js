function createServicePack(execlib) {
  'use strict';
  return {
    service: {
      dependencies: ['.', 'allex:leveldb:lib']
    },
    sinkmap: {
      dependencies: ['.']
    }, /*
    tasks: {
      dependencies: []
    }
    */
  }
}

module.exports = createServicePack;
