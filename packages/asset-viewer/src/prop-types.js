import PropTypes from 'prop-types';

export const assetShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  svg: PropTypes.string.isRequired,
  gridWidth: PropTypes.number,
  gridHeight: PropTypes.number,
  fileName: PropTypes.string.isRequired,
  fileDir: PropTypes.string.isRequired,
  fileSize: PropTypes.number.isRequired,
  helper: PropTypes.string.isRequired,
  strategy: PropTypes.oneOf(['inline', 'symbol']).isRequired,
});
