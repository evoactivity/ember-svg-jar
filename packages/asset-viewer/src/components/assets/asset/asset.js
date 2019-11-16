import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { areEqual } from 'react-window';
import classNames from 'classnames';
import { assetShape } from '../../../prop-types';
import './asset.scss';

const Asset = memo(function Asset({
  asset, isActive, style, onClick,
}) {
  return (
    <button
      className={classNames('asset', { 'is-active': isActive })}
      type="button"
      dangerouslySetInnerHTML={{ __html: asset.svg }}
      style={style}
      aria-label="Select asset"
      onClick={() => onClick(asset)}
    />
  );
}, areEqual);

Asset.propTypes = {
  asset: assetShape.isRequired,
  isActive: PropTypes.bool.isRequired,
  style: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default Asset;
