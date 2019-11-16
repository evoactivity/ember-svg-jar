import React, {
  useState, useContext, createContext, useEffect, useRef, useMemo, useCallback,
} from 'react';
import PropTypes from 'prop-types';
import makeCSSBG from '../utils/make-css-bg';
import copyToClipboard from '../utils/copy-to-clipboard';
import saveAsset from '../utils/save-asset';
import { useNotifier } from './notifier';

const CurrentAssetContext = createContext();
const CurrentAssetActionsContext = createContext();

function useCurrentAsset() {
  const context = useContext(CurrentAssetContext);

  if (context === undefined) {
    throw new Error('useCurrentAsset must be used within CurrentAssetProvider');
  }

  return context;
}

function useCurrentAssetActions() {
  const context = useContext(CurrentAssetActionsContext);

  if (context === undefined) {
    throw new Error('useCurrentAssetActions must be used within CurrentAssetProvider');
  }

  return context;
}

function CurrentAssetProvider({ children }) {
  const notify = useNotifier();
  const [currentAsset, setCurrentAsset] = useState(null);
  const asset = useRef();

  useEffect(() => {
    asset.current = currentAsset;
  }, [currentAsset]);

  const copyAndNotify = useCallback((content, messagePrefix) => {
    const message = copyToClipboard(content)
      ? `${messagePrefix} is copied 👍`
      : 'Copy to clipboard failed!';

    notify(message);
  }, [notify]);

  const actions = useMemo(() => ({
    setCurrentAsset,

    copyHelper() {
      if (asset.current) {
        copyAndNotify(asset.current.helper, 'Helper');
      }
    },

    copySVG() {
      if (asset.current) {
        copyAndNotify(asset.current.svg, 'SVG');
      }
    },

    copyCSS() {
      if (asset.current) {
        copyAndNotify(makeCSSBG(asset.current.svg), 'CSS background');
      }
    },

    downloadSVG() {
      if (asset.current) {
        saveAsset(asset.current);
      }
    },
  }), [copyAndNotify]);

  return (
    <CurrentAssetContext.Provider value={currentAsset}>
      <CurrentAssetActionsContext.Provider value={actions}>
        {children}
      </CurrentAssetActionsContext.Provider>
    </CurrentAssetContext.Provider>
  );
}

CurrentAssetProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { useCurrentAsset, useCurrentAssetActions, CurrentAssetProvider };
