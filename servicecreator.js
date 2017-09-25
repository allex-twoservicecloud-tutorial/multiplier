function createMultiplierService(execlib, ParentService, leveldblib) {
  'use strict';
  
  var execSuite = execlib.execSuite,
    RemoteServiceListenerServiceMixin = execSuite.RemoteServiceListenerServiceMixin,
    taskRegistry = execSuite.taskRegistry,
    lib = execlib.lib,
    q = lib.q;

  function factoryCreator(parentFactory) {
    return {
      'service': require('./users/serviceusercreator')(execlib, parentFactory.get('service')),
      'user': require('./users/usercreator')(execlib, parentFactory.get('user')) 
    };
  }

  function MultiplierService(prophash) {
    ParentService.call(this, prophash);
    RemoteServiceListenerServiceMixin.call(this);
    this.multiplier = null;
    this.findRemote(prophash.configsinkname, null, 'Config');
    this.state.data.listenFor('Config', this.onConfig.bind(this), true);
  }
  
  ParentService.inherit(MultiplierService, factoryCreator);
  RemoteServiceListenerServiceMixin.addMethods(MultiplierService);
  
  MultiplierService.prototype.__cleanUp = function() {
    this.multiplier = null;
    RemoteServiceListenerServiceMixin.prototype.destroy.call(this);
    ParentService.prototype.__cleanUp.call(this);
  };

  MultiplierService.prototype.onConfig = function (configsink) {
    taskRegistry.run('queryLevelDB', {
      queryMethodName: 'query',
      sink: configsink,
      scanInitially: true,
      filter: {
        keys: {
          op: 'eq',
          field: null,
          value: 'multiplier'
        }
      },
      onPut: this.onMultiplierSet.bind(this),
      onDel: this.onMultiplierRemoved.bind(this)
    });
  };

  MultiplierService.prototype.onMultiplierSet = function (keyvalarray) {
    var key = keyvalarray[0], val = keyvalarray[1];
    this.multiplier = val;
  };

  MultiplierService.prototype.onMultiplierRemoved = function (key) {
    this.multiplier = null;
  };

  MultiplierService.prototype.multiply = function (number) {
    return q(number*this.multiplier);
  };

  MultiplierService.prototype.propertyHashDescriptor = {
    configsinkname: {
      type: ['string', 'array']
    }
  };
  
  return MultiplierService;
}

module.exports = createMultiplierService;
