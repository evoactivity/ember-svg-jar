import Application from 'dummy/app';
import config from 'dummy/config/environment';
import * as QUnit from 'qunit';
import { setApplication } from '@ember/test-helpers';
import { setup } from 'qunit-dom';
import { loadTests } from 'ember-qunit/test-loader';
import { start, setupEmberOnerrorValidation } from 'ember-qunit';

setup(QUnit.assert);

setApplication(Application.create(config.APP));

setup(QUnit.assert);
setupEmberOnerrorValidation();
loadTests();

// ember-qunit 9 ignores these options. The ember-qunit 6 used for Ember 3.28
// would otherwise load the tests a second time.
start({ loadTests: false, setupEmberOnerrorValidation: false });
