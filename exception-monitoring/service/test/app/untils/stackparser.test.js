'use strict';
// const path = require('path');
// chunk-vendors.6e86e937.js.map
// app.553cbaa1.js.map
const expect = require('expect.js');
const StackParser = require('../../../app/untils/stackparser');
const error = {
  stack: `ReferenceError: xxx is not defined
  at Proxy.mounted (app.553cbaa1.js:1:2128)
  at Er (chunk-vendors.6e86e937.js:1:55603)
  at Pr (chunk-vendors.6e86e937.js:1:55694)
  at Array.t.__weh.t.__weh (chunk-vendors.6e86e937.js:1:28650)
  at eo (chunk-vendors.6e86e937.js:1:57157)
  at J (chunk-vendors.6e86e937.js:1:46794)
  at mount (chunk-vendors.6e86e937.js:1:36973)
  at Object.t.mount (chunk-vendors.6e86e937.js:1:67350)
  at Module.56d7 (app.553cbaa1.js:1:2380)
  at l (app.553cbaa1.js:1:564)`,
  message: 'ReferenceError: xxx is not defined',
  filename: 'chunk-vendors.6e86e937.js.map',
};
describe('test/stackparser', () => {
  it('test', async () => {
    const stackParser = new StackParser(__dirname);
    const stackFrame = stackParser.parseStackTrack(error.stack, error.message);
    // console.log('stackFrame:', stackFrame);
    const originStack = await stackParser.getOriginalErrorStack(stackFrame);
    // console.log('originStack:', originStack);

    expect(originStack[0]).to.eql({
      source: 'webpack:///src/components/HelloWorld.vue',
      line: 14,
      column: 4,
      name: 'xxx',
    });
  });
});
