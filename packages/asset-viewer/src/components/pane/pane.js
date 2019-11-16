import React, { useState } from 'react';
import { useCurrentAsset, useCurrentAssetActions } from '../../contexts/current-asset';
import getAssetSize from '../../utils/get-asset-size';
import CodeBlock from '../code-block';
import Placeholder from '../placeholder';
import Dropdown from '../dropdown';
import { assetShape } from '../../prop-types';
import { ReactComponent as FileIcon } from '../../images/icons/svg-file.svg';
import { ReactComponent as MoreIcon } from '../../images/icons/more.svg';
import { ReactComponent as PlaceholderIcon } from '../../images/icons/pane-placeholder.svg';
import './pane.scss';

function PreviewSection({ asset }) {
  const [previewScale, setPreviewScale] = useState(2);

  return (
    <section className="pane__section">
      <header className="pane__header">
        <h2 className="pane__title">
          Preview
        </h2>

        <div className="range pane__range">
          <input
            type="range"
            max="5"
            min="0.5"
            step="0.1"
            value={previewScale}
            onChange={({ target }) => setPreviewScale(target.value)}
          />
        </div>
      </header>

      <div className="pane__content">
        <div className="pane__preview">
          <div
            style={{ transform: `scale(${previewScale})` }}
            dangerouslySetInnerHTML={{ __html: asset.svg }}
          />
        </div>
      </div>
    </section>
  );
}

PreviewSection.propTypes = {
  asset: assetShape.isRequired,
};

function Pane() {
  const currentAsset = useCurrentAsset();
  const {
    copyHelper,
    copySVG,
    copyCSS,
    downloadSVG,
  } = useCurrentAssetActions();

  if (!currentAsset) {
    return (
      <Placeholder
        className="pane"
        icon={PlaceholderIcon}
        title="No selection"
      >
        Click an asset to see its info
      </Placeholder>
    );
  }

  return (
    <div className="pane">
      <section className="pane__section pane__section--header">
        <div className="pane__content">
          <div className="pane__file">
            <FileIcon className="pane__file-icon" aria-hidden />

            <span className="pane__file-name" title={currentAsset.fileName}>
              {currentAsset.fileName}
            </span>

            <Dropdown>
              <Dropdown.Trigger>
                <button
                  className="pane__file-button btn btn--small btn--icon-only"
                  type="button"
                  aria-label="Actions menu"
                >
                  <MoreIcon />
                </button>
              </Dropdown.Trigger>

              <Dropdown.Menu>
                <Dropdown.MenuItem onClick={copySVG}>
                  Copy SVG content
                </Dropdown.MenuItem>

                <Dropdown.MenuItem onClick={copyCSS}>
                  Copy CSS background
                </Dropdown.MenuItem>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
      </section>

      <PreviewSection asset={currentAsset} />

      <section className="pane__section">
        <header className="pane__header">
          <h2 className="pane__title">
            Helper
          </h2>

          <button
            className="btn btn--small btn--primary"
            type="button"
            onClick={copyHelper}
          >
            Copy
          </button>
        </header>

        <div className="pane__content">
          <CodeBlock
            code={currentAsset.helper}
            language="handlebars"
          />
        </div>
      </section>

      <section className="pane__section">
        <header className="pane__header">
          <h2 className="pane__title">
            Asset Info
          </h2>
        </header>

        <div className="pane__content">
          <ul>
            <li className="pane__info-item">
              <span className="pane__info-title">
                Directory
              </span>

              <span className="pane__info-text" title={currentAsset.fileDir}>
                {currentAsset.fileDir}
              </span>
            </li>

            <li className="pane__info-item">
              <span className="pane__info-title">
                Grid size
              </span>
              <span className="pane__info-text">
                {getAssetSize(currentAsset)}
              </span>
            </li>

            <li className="pane__info-item">
              <span className="pane__info-title">
                File size
              </span>
              <span className="pane__info-text">
                {currentAsset.fileSize} KB
              </span>
            </li>

            <li className="pane__info-item">
              <span className="pane__info-title">
                Strategy
              </span>
              <span className="pane__info-text">
                {currentAsset.strategy}
              </span>
            </li>
          </ul>
        </div>
      </section>

      <section className="pane__section pane__section--footer">
        <div className="pane__content">
          <button
            className="btn btn--full btn--outline"
            type="button"
            onClick={downloadSVG}
          >
            Download
          </button>
        </div>
      </section>
    </div>
  );
}

export default Pane;
