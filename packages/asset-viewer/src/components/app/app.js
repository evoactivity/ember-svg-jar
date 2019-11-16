import React from 'react';
import useAxios from 'axios-hooks';
import { ASSETS_PATH } from '../../constants';
import { useBreakpoints } from '../../contexts/breakpoints';
import { useDrawersState, useDrawersActions } from '../../contexts/drawers';
import Drawer from '../drawer';
import GlobalShortcuts from '../global-shortcuts';
import ShortcutsBar from '../shortcuts-bar';
import TabBar from '../tab-bar';
import Sidebar from '../sidebar';
import ActionsBar from '../actions-bar';
import Assets from '../assets';
import Pane from '../pane';
import Placeholder from '../placeholder';
import { ReactComponent as PlaceholderIcon } from '../../images/full-logo.svg';
import './app.scss';

function useAssets() {
  const [{ data, error, loading }] = useAxios(ASSETS_PATH);

  return {
    ...(data || { assets: [] }),
    isLoading: loading,
    isError: !!error,
  };
}

function App() {
  const { isLoading, isError, assets } = useAssets();
  const breakpoints = useBreakpoints();
  const {
    isSidebarOpen,
    isPaneOpen,
    isShortcutsOpen,
  } = useDrawersState();
  const {
    closeSidebar,
    closePane,
    closeShortcuts,
  } = useDrawersActions();

  if (isLoading) {
    return (
      <Placeholder
        className="app app--placeholder"
        icon={PlaceholderIcon}
        title="Loading assets..."
      />
    );
  }

  if (isError) {
    return (
      <Placeholder
        className="app app--placeholder"
        icon={PlaceholderIcon}
        title="Unable to load assets file"
      />
    );
  }

  return (
    <div className="app">
      <GlobalShortcuts />
      <TabBar />

      {breakpoints.large
        ? <Sidebar assets={assets} />
        : (
          <Drawer
            placement="left"
            isOpen={isSidebarOpen}
            onClose={closeSidebar}
          >
            <Sidebar assets={assets} />
          </Drawer>
        )
      }

      <main className="app__main">
        <ActionsBar />
        <Assets assets={assets} />
      </main>

      {breakpoints.medium
        ? <Pane />
        : (
          <Drawer
            placement="right"
            isOpen={isPaneOpen}
            onClose={closePane}
          >
            <Pane />
          </Drawer>
        )
      }

      <Drawer
        placement="bottom"
        isOpen={isShortcutsOpen}
        onClose={closeShortcuts}
      >
        <ShortcutsBar onClose={closeShortcuts} />
      </Drawer>
    </div>
  );
}

export default App;
