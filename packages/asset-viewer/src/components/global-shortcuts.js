import { useHotkeys } from 'react-hotkeys-hook';
import { useCurrentAssetActions } from '../contexts/current-asset';
import { useDrawersActions } from '../contexts/drawers';

function GlobalShortcuts() {
  const { toggleShortcuts } = useDrawersActions();
  const {
    copyHelper,
    copySVG,
    copyCSS,
    downloadSVG,
  } = useCurrentAssetActions();

  // Search focus `/` is defined in search-bar component.
  useHotkeys('enter', copyHelper, [copyHelper]);
  useHotkeys('s', copySVG, [copySVG]);
  useHotkeys('c', copyCSS, [copyCSS]);
  useHotkeys('d', downloadSVG, [downloadSVG]);
  useHotkeys('shift+/', toggleShortcuts);

  return null;
}

export default GlobalShortcuts;
