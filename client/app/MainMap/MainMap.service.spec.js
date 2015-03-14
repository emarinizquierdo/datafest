'use strict';

describe('Service: MainMap', function () {

  // load the service's module
  beforeEach(module('datafestApp'));

  // instantiate service
  var MainMap;
  beforeEach(inject(function (_MainMap_) {
    MainMap = _MainMap_;
  }));

  it('should do something', function () {
    expect(!!MainMap).toBe(true);
  });

});
