function createMultiplierService(execlib, ParentService) {
  'use strict';
  

  function factoryCreator(parentFactory) {
    return {
      'service': require('./users/serviceusercreator')(execlib, parentFactory.get('service')),
      'user': require('./users/usercreator')(execlib, parentFactory.get('user')) 
    };
  }

  function MultiplierService(prophash) {
    ParentService.call(this, prophash);
  }
  
  ParentService.inherit(MultiplierService, factoryCreator);
  
  MultiplierService.prototype.__cleanUp = function() {
    ParentService.prototype.__cleanUp.call(this);
  };
  
  return MultiplierService;
}

module.exports = createMultiplierService;
