'use strict';

describe('Service: shData', function () {

  // load the service's module
  beforeEach(module('datafestApp'));

  // instantiate service
  var shData;
  beforeEach(inject(function (_shData_) {
    shData = _shData_;
  }));

  it('should do something', function () {
    expect(!!shData).toBe(true);
  });

});
