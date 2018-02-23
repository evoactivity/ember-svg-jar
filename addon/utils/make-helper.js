import Helper from '@ember/component/helper';
import Ember from 'ember';

export default function makeHelper(helperFunc) {
  let helper;

  if (Helper && Helper.helper) {
    helper = Helper.helper(function([assetId], options) {
      return helperFunc(assetId, options);
    });
  } else {
    helper = Ember.Handlebars.makeBoundHelper(function(assetId, options) {
      return helperFunc(assetId, options.hash || {});
    });
  }

  return helper;
}
