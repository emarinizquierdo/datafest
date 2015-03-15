'use strict';

describe('Service: bicimad', function () {

  // load the service's module
  beforeEach(module('datafestApp'));

  // instantiate service
  var bicimad;
  beforeEach(inject(function (_bicimad_) {
    bicimad = _bicimad_;
  }));

  it('should do something', function () {
    expect(!!bicimad).toBe(true);
  });

});
