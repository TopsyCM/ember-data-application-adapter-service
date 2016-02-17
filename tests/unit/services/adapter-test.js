import Ember from 'ember';
import { moduleFor, test } from 'ember-qunit';
import sinon from 'sinon';

const {
  RSVP: { Promise }
} = Ember;

let service;
let adapterForStub, ajaxStub;

moduleFor('service:adapter', 'Unit | Service | adapter', {
  beforeEach() {
    ajaxStub = sinon.stub().returns(Promise.resolve(12));
    adapterForStub = sinon.stub().returns({
      host: 'test-host',
      namespace: 'test-namespace',
      ajax: ajaxStub
    });

    service = this.subject({
      store: {
        adapterFor: adapterForStub
      }
    });
  }
});

test('grabs application adapter', function(assert) {
  return service.ajax().then(() => {
    assert.deepEqual(adapterForStub.args, [['application']]);
  });
});

test('calls adapter.ajax with full url', function(assert) {
  return service.ajax('test-url').then(() => {
    assert.deepEqual(ajaxStub.args, [['test-host/test-namespace/test-url']]);
  });
});

test('calls adapter.ajax with remaining params', function(assert) {
  return service.ajax('test-url', 23, 34).then(() => {
    assert.deepEqual(ajaxStub.args, [['test-host/test-namespace/test-url', 23, 34]]);
  });
});

test('returns adapter.ajax response', function(assert) {
  return service.ajax().then(response => {
    assert.strictEqual(response, 12);
  });
});