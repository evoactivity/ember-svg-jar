// 'use strict';

// var expect = require('chai').expect;
// var fixture = require('broccoli-fixture');
// var InlinePacker = require('../../lib/inline-packer');

// describe('InlinePacker', function() {
//   it('works', function() {
//     var inputNode = new fixture.Node({
//       'foo.svg': '<svg viewBox="0 0 1 1"><path d="foo"/></svg>',
//       'bar.svg': '<svg height="10px" viewBox="0 0 2 2"><path d="bar"/></svg>'
//     });

//     var inlinePacker = new InlinePacker(inputNode, {
//       idGen: function(filePath) { return filePath; },
//       stripPath: true,
//       outputFile: 'no-export.js',
//       moduleExport: false
//     });

//     expect(inlinePacker.listFiles()).to.equal('[]');
//   });
// });
