'use strict';

describe('Controller: SheetCtrl', function () {

  // load the controller's module
  beforeEach(module('datafestApp'));

  var SheetCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SheetCtrl = $controller('SheetCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
