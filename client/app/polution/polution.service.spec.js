'use strict';

describe('Service: polution', function () {

  // load the service's module
  beforeEach(module('datafestApp'));

  // instantiate service
  var polution;
  beforeEach(inject(function (_polution_) {
    polution = _polution_;
  }));

  it('should do something', function () {
    expect(!!polution).toBe(true);
  });

});
