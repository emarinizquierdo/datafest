'use strict';

describe('Service: geoloc', function () {

  // load the service's module
  beforeEach(module('datafestApp'));

  // instantiate service
  var geoloc;
  beforeEach(inject(function (_geoloc_) {
    geoloc = _geoloc_;
  }));

  it('should do something', function () {
    expect(!!geoloc).toBe(true);
  });

});
