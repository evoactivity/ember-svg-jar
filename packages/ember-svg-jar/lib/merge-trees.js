'use strict';

const fs = require('fs');
const path = require('path');
const Plugin = require('broccoli-plugin').default;

// Copies the contents of `sourceDir` into `targetDir`, replacing files that
// already exist. Input trees are often symlinks to other plugins' output, so
// stat follows symlinks and the files they point to are copied.
function copyDir(sourceDir, targetDir) {
  fs.mkdirSync(targetDir, { recursive: true });

  for (let name of fs.readdirSync(sourceDir)) {
    let sourcePath = path.join(sourceDir, name);
    let targetPath = path.join(targetDir, name);

    if (fs.statSync(sourcePath).isDirectory()) {
      copyDir(sourcePath, targetPath);
    } else {
      fs.copyFileSync(sourcePath, targetPath);
    }
  }
}

/**
 * Copies every input tree into one output tree. When two trees have a file
 * at the same path, the file from the later tree is kept.
 *
 * This replaces broccoli-merge-trees, which depends on a vulnerable version
 * of `tmp` that has no fixed release.
 */
module.exports = class MergeTrees extends Plugin {
  constructor(inputNodes, options = {}) {
    super(inputNodes, {
      annotation: options.annotation,
      persistentOutput: false,
      needsCache: false,
    });
  }

  build() {
    for (let inputPath of this.inputPaths) {
      copyDir(inputPath, this.outputPath);
    }
  }
};
