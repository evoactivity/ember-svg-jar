import React, { memo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useQueryParams, StringParam } from 'use-query-params';
import getAssetSize from '../../utils/get-asset-size';
import { ReactComponent as FolderIcon } from '../../images/icons/folder-outline.svg';
import { ReactComponent as SizeIcon } from '../../images/icons/grid-size.svg';
import { assetShape } from '../../prop-types';
import './sidebar.scss';

const Sidebar = memo(function Sidebar({ assets }) {
  const [queryParams, setQueryParams] = useQueryParams({
    dir: StringParam,
    size: StringParam,
  });

  const {
    dir: currentDir,
    size: currentSize,
  } = queryParams;

  const directories = assets
    .map(({ fileDir }) => fileDir)
    .filter((item, index, items) => items.indexOf(item) === index)
    .sort((a, b) => a.localeCompare(b));

  const sizes = assets
    .sort(({ gridWidth: aW, gridHeight: aH }, { gridWidth: bW, gridHeight: bH }) => {
      const byWidth = Number(aW) - Number(bW);
      return byWidth !== 0 ? byWidth : Number(aH) - Number(bH);
    })
    .map((asset) => getAssetSize(asset))
    .filter((item, index, items) => items.indexOf(item) === index);

  function toggleQueryParam(param) {
    const [[key, value]] = Object.entries(param);
    const newValue = queryParams[key] === value ? null : value;
    setQueryParams({ [key]: newValue });
  }

  return (
    <div className="sidebar">
      <section className="sidebar__section">
        <button
          className={classNames('sidebar__item', {
            'is-active': !currentDir && !currentSize,
          })}
          type="button"
          onClick={() => setQueryParams({ dir: null, size: null })}
        >
          <FolderIcon className="sidebar__icon" aria-hidden />

          <span className="sidebar__text">
            All assets
          </span>
        </button>
      </section>

      {!!directories.length && (
        <section className="sidebar__section">
          <h2 className="sidebar__title">
            By directory
          </h2>

          <ul>
            {directories.map((dir) => (
              <li key={dir}>
                <button
                  className={classNames('sidebar__item', {
                    'is-active': dir === currentDir,
                  })}
                  type="button"
                  onClick={() => toggleQueryParam({ dir })}
                >
                  <FolderIcon className="sidebar__icon" aria-hidden />

                  <span className="sidebar__text">
                    {dir}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {!!sizes.length && (
        <section className="sidebar__section">
          <h2 className="sidebar__title">
            By grid size
          </h2>

          <ul>
            {sizes.map((size) => (
              <li key={size}>
                <button
                  className={classNames('sidebar__item', {
                    'is-active': size === currentSize,
                  })}
                  type="button"
                  onClick={() => toggleQueryParam({ size })}
                >
                  <SizeIcon className="sidebar__icon" aria-hidden />

                  <span className="sidebar__text">
                    {size}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
});

Sidebar.propTypes = {
  assets: PropTypes.arrayOf(assetShape).isRequired,
};

export default Sidebar;
