'use strict';

describe('Service: geometry', function () {

  // load the service's module
  beforeEach(module('datafestApp'));

  // instantiate service
  var geometry;
  beforeEach(inject(function (_geometry_) {
    geometry = _geometry_;
  }));

  it('should do something', function () {
    expect(!!geometry).toBe(true);
  });

});
