import Ember from 'ember';

export default function makeHelper(helperFunc) {
  let helper;

  if (Ember.Helper && Ember.Helper.helper) {
    helper = Ember.Helper.helper(function([assetId], options) {
      return helperFunc(assetId, options);
    });
  } else {
    helper = Ember.Handlebars.makeBoundHelper(function(assetId, options) {
      return helperFunc(assetId, options.hash || {});
    });
  }

  return helper;
}
