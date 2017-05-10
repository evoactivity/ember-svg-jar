import {
  setResolver
} from 'ember-qunit';
import { start } from 'ember-cli-qunit';
import resolver from './helpers/resolver';

setResolver(resolver);
start();
