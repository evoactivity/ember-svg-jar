import { setApplication } from '@ember/test-helpers';
import { start } from 'ember-qunit';
import Application from '../app';

setApplication(Application.create({ autoboot: false }));

start();
