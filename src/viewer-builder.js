/**
  Merge JSON asset stores into a single JSON file and add additional
  meta data. The output file will be used by the asset viewer as the model
  in development mode.

  The input node files must be generated with the ViewerAssetsBuilder.

  Required options:
    outputFile

  Optional options:
    annotation

  Examples of input and output:

  Input node:
  ├── inline.json
  └── symbol.json

  Output node:
  └── output.json

  inline.json can content:
  [
    {
      "svg": { "content": "<path />", "attrs": { ... } },
      "fileName": "alarm.svg",
      "strategy": "inline",
      ...
    },

    { ... }
  ]

  symbol.json can content:
  [
    {
      "svg": { "content": "<path />", "attrs": { ... } },
      "fileName": "cat.svg",
      "strategy": "symbol",
      ...
    },

    { ... }
  ]

  output.json can content:
  {
    "assets": [
      {
        "svg": { "content": "<path />", "attrs": { ... } },
        "fileName": "alarm.svg",
        "strategy": "inline",
        ...
      },

      {
        "svg": { "content": "<path />", "attrs": { ... } },
        "fileName": "cat.svg",
        "strategy": "symbol",
        ...
      },

      { ... }
    ],

    "details": [
      { "name": "File name", "key": "fileName" }
    ],

    "searchKeys": ["fileName", "fileDir"],

    "sortBy": [
      { "name": "File name", "key": "fileName" }
    ],

    "arrangeBy": [
      { "name": "Directory", "key": "fileDir" }
    ],

    "filters": [
      { "name": "Directory", "key": "fileDir", "items": [{ "name": "/", "count": 74 }] }
    ],

    "links": [
      { "text": "Contribute", "url": "https://github.com/ivanvotti/ember-svg-jar" }
    ]
  }
*/
const path = require('path');
const _ = require('lodash');
const fp = require('lodash/fp');
const CachingWriter = require('broccoli-caching-writer');
const { filePathsOnly, readFile, saveToFile } = require('./utils');

function filtersFor(assets, filters) {
  return filters.map((filter) => (
    {
      name: filter.name,
      key: filter.key,
      items: _(assets)
        .map(filter.key)
        .without(undefined)
        .countBy()
        .toPairs()
        .map(([name, count]) => ({ name, count }))
        .sortBy('name')
        .value()
    }
  ));
}

function assetsToViewerModel(assets, hasManyStrategies) {
  let details = [
    { name: 'File name', key: 'fileName' },
    { name: 'Directory', key: 'fileDir' },
    { name: 'Base size', key: 'fullBaseSize' },
    { name: 'Original file size', key: 'fileSize' },
    { name: 'Optimized file size', key: 'optimizedFileSize' },
    { name: 'Strategy', key: 'strategy' }
  ];

  let searchKeys = ['fileName', 'fileDir'];

  let sortBy = [
    { name: 'File name', key: 'fileName' },
    { name: 'Base size', key: 'height' }
  ];

  let arrangeBy = [
    { name: 'Directory', key: 'fileDir' },
    { name: 'Base size', key: 'baseSize' }
  ];

  let filterBy = [
    { name: 'Directory', key: 'fileDir' },
    { name: 'Base size', key: 'baseSize' }
  ];

  if (hasManyStrategies) {
    filterBy.push({ name: 'Strategy', key: 'strategy' });
  }

  let links = [
    { text: 'Contribute', url: 'https://github.com/ivanvotti/ember-svg-jar' },
    { text: 'About', url: 'https://svgjar.firebaseapp.com' }
  ];

  return {
    assets,
    details,
    searchKeys,
    sortBy,
    arrangeBy,
    filters: filtersFor(assets, filterBy),
    links
  };
}

class ViewerBuilder extends CachingWriter {
  constructor(inputNode, options = {}) {
    super([inputNode], {
      name: 'ViewerBuilder',
      annotation: options.annotation,
    });

    this.options = options;
  }

  build() {
    let outputFilePath = path.join(this.outputPath, this.options.outputFile);
    let filePaths = filePathsOnly(this.listFiles());
    let hasManyStrategies = filePaths.length > 1;

    fp.pipe(
      fp.flatMap(fp.pipe(readFile, JSON.parse)),
      (assets) => assetsToViewerModel(assets, hasManyStrategies),
      JSON.stringify,
      saveToFile(outputFilePath)
    )(filePaths);
  }
}

module.exports = ViewerBuilder;
