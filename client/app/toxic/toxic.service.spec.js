'use strict';

describe('Service: toxic', function () {

  // load the service's module
  beforeEach(module('datafestApp'));

  // instantiate service
  var toxic;
  beforeEach(inject(function (_toxic_) {
    toxic = _toxic_;
  }));

  it('should do something', function () {
    expect(!!toxic).toBe(true);
  });

});
