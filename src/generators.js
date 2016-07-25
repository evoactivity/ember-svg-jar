module.exports = {
  symbolIdGen: (path, { prefix }) => `${prefix}${path}`.replace(/[\s]/g, '-'),
  symbolCopypastaGen: (id) => `{{svg-jar "#${id}"}}`,
  inlineIdGen: (path) => path,
  inlineCopypastaGen: (id) => `{{svg-jar "${id}"}}`
};
