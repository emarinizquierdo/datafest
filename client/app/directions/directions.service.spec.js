'use strict';

describe('Service: directions', function () {

  // load the service's module
  beforeEach(module('datafestApp'));

  // instantiate service
  var directions;
  beforeEach(inject(function (_directions_) {
    directions = _directions_;
  }));

  it('should do something', function () {
    expect(!!directions).toBe(true);
  });

});
