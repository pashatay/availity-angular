/* global inject, spyOn, describe, beforeEach, it, expect, module */

import angular from 'angular';

import ngModule from '../users';

describe('avUsersResource', () => {

  let avUsersResource;
  let $q;

  beforeEach(() => {

    angular.mock.module(ngModule.name);

    inject((_avUsersResource_, _$q_) => {
      avUsersResource = _avUsersResource_;
      $q = _$q_;
    });

  });

  it('should exist', () => {
    expect(avUsersResource).toBeDefined();
    expect(avUsersResource.me).toBeDefined();
  });

  it('should build url', () => {
    expect(avUsersResource.getUrl()).toBe('/api/sdk/platform/v1/users');
  });

  it('should allow config object for avUsersResource.me()', () => {

    const spyMe = spyOn(avUsersResource, 'me').and.callFake(() => $q.when({name: 'Ariana'}));

    const config = {cacheBust: true};
    avUsersResource.me(config);

    expect(spyMe).toHaveBeenCalledWith(config);

  });

});
