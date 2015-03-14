'use strict';

describe('Service: polygons', function () {

  // load the service's module
  beforeEach(module('datafestApp'));

  // instantiate service
  var polygons;
  beforeEach(inject(function (_polyline_) {
    polygons = _polyline_;
  }));

  it('should do something', function () {
    expect(!!polygons).toBe(true);
  });

});
