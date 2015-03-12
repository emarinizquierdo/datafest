'use strict';

describe('Service: aire', function () {

  // load the service's module
  beforeEach(module('datafestApp'));

  // instantiate service
  var aire;
  beforeEach(inject(function (_aire_) {
    aire = _aire_;
  }));

  it('should do something', function () {
    expect(!!aire).toBe(true);
  });

});
