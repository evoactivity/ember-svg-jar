import React, { forwardRef, memo } from 'react';
import PropTypes from 'prop-types';
import { useQueryParams, StringParam } from 'use-query-params';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeGrid as Grid } from 'react-window';
import { useCurrentAsset, useCurrentAssetActions } from '../../contexts/current-asset';
import getAssetSize from '../../utils/get-asset-size';
import Placeholder from '../placeholder';
import { ReactComponent as searchPlaceholder } from '../../images/icons/search-placeholder.svg';
import { ReactComponent as assetsPlaceholder } from '../../images/icons/assets-placeholder.svg';
import Asset from './asset';
import { assetShape } from '../../prop-types';
import './assets.scss';

const baseCellSize = 64;
const padding = 16;

const sorters = {
  name({ fileName: a }, { fileName: b }) {
    return a.localeCompare(b);
  },

  dir({ fileDir: a }, { fileDir: b }) {
    return a.localeCompare(b);
  },

  size({ gridWidth: aW, gridHeight: aH }, { gridWidth: bW, gridHeight: bH }) {
    const byWidth = aW - bW;
    return byWidth !== 0 ? byWidth : aH - bH;
  },
};

// For adding padding around the grid.
const GridInner = forwardRef(function GridInner({ style, ...props }, ref) {
  return (
    <div
      style={{
        ...style,
        width: `${style.width + padding}px`,
        height: `${style.height + padding * 2}px`,
      }}
      ref={ref}
      {...props}
    />
  );
});

GridInner.propTypes = {
  style: PropTypes.shape({
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
  }).isRequired,
};

// Workaround for creating a unique key for a grid item
// when there's no actual data.
function getFallbackID({ columnIndex, rowIndex }) {
  return columnIndex * rowIndex;
}

// We rely on `FixedSizeGrid` from `react-window` to improve
// rendering perfomance of large asset collections.
const Assets = memo(function Assets({ assets }) {
  const currentAsset = useCurrentAsset();
  const { setCurrentAsset } = useCurrentAssetActions();
  const [queryParams] = useQueryParams({
    dir: StringParam,
    size: StringParam,
    q: StringParam,
    sort: StringParam,
  });

  const {
    dir: dirFilter,
    size: sizeFilter,
    q: searchQuery,
    sort: sortBy,
  } = queryParams;

  let filteredAssets = [...assets];

  filteredAssets = dirFilter
    ? filteredAssets.filter(({ fileDir }) => fileDir === dirFilter)
    : filteredAssets;

  filteredAssets = sizeFilter
    ? filteredAssets.filter((asset) => getAssetSize(asset) === sizeFilter)
    : filteredAssets;

  filteredAssets = searchQuery
    ? filteredAssets.filter(({ fileName }) => fileName.includes(searchQuery))
    : filteredAssets;

  filteredAssets = Object.keys(sorters).includes(sortBy)
    ? filteredAssets.sort(sorters[sortBy])
    : filteredAssets;

  if (filteredAssets.length) {
    return (
      <div className="assets">
        <AutoSizer>
          {({ width, height }) => {
            const widthMinusPadding = width - padding * 2;
            const itemsCount = filteredAssets.length;
            const maxColumnCount = Math.trunc(widthMinusPadding / baseCellSize);
            const columnCount = Math.min(itemsCount, maxColumnCount);
            const rowCount = Math.ceil(itemsCount / columnCount);

            // Remove extra space on the right of the grid
            // by making columns to take all the available width.
            const cellSize = itemsCount >= maxColumnCount
              ? widthMinusPadding / columnCount
              : baseCellSize;

            function getItem({ columnIndex, rowIndex }) {
              return filteredAssets[rowIndex * columnCount + columnIndex];
            }

            return (
              <Grid
                // Add padding around the grid with `GridInner`.
                innerElementType={GridInner}
                width={width}
                height={height}
                columnWidth={cellSize}
                rowHeight={cellSize}
                columnCount={columnCount}
                rowCount={rowCount}
                overscanRowCount={1}
                itemKey={(itemData) => {
                  const item = getItem(itemData);
                  return item ? item.id : getFallbackID(itemData);
                }}
              >
                {({ style, ...itemData }) => {
                  const item = getItem(itemData);

                  if (!item) {
                    return null;
                  }

                  const styleWithPadding = {
                    ...style,
                    top: `${parseFloat(style.top) + padding}px`,
                    left: `${parseFloat(style.left) + padding}px`,
                  };

                  return (
                    <Asset
                      asset={item}
                      isActive={item === currentAsset}
                      style={styleWithPadding}
                      onClick={setCurrentAsset}
                    />
                  );
                }}
              </Grid>
            );
          }}
        </AutoSizer>
      </div>
    );
  }

  const atFilters = !!(dirFilter || sizeFilter) && (
    <>
      at
      {' '}
      {[dirFilter, sizeFilter].filter(Boolean).map((item) => (
        <b key={item}>{item}</b>
      ))}
    </>
  );

  if (searchQuery) {
    return (
      <Placeholder
        className="assets assets--placeholder"
        icon={searchPlaceholder}
        title="No assets were found"
      >
        Your search <b>{searchQuery}</b> did not match any assets {atFilters}
      </Placeholder>
    );
  }

  if (dirFilter || sizeFilter) {
    return (
      <Placeholder
        className="assets assets--placeholder"
        icon={searchPlaceholder}
        title="No assets were found"
      >
        Can’t find any assets {atFilters}
      </Placeholder>
    );
  }

  return (
    <Placeholder
      className="assets assets--placeholder"
      icon={assetsPlaceholder}
      title="Your assets library is empty"
    >
      Drop some SVG files to your <b>public</b> directory
    </Placeholder>
  );
});

Assets.propTypes = {
  assets: PropTypes.arrayOf(assetShape).isRequired,
};

export default Assets;
