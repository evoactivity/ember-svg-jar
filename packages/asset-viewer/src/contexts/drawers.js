import React, {
  useReducer, useContext, createContext, useMemo,
} from 'react';
import PropTypes from 'prop-types';

const DrawersStateContext = createContext();
const DrawersActionsContext = createContext();

function useDrawersState() {
  const context = useContext(DrawersStateContext);

  if (context === undefined) {
    throw new Error('useDrawersState must be used within DrawersProvider');
  }

  return context;
}

function useDrawersActions() {
  const context = useContext(DrawersActionsContext);

  if (context === undefined) {
    throw new Error('useDrawersActions must be used within DrawersProvider');
  }

  return context;
}

const actionTypes = {
  toggleSidebar: 'toggleSidebar',
  closeSidebar: 'closeSidebar',
  togglePane: 'togglePane',
  closePane: 'closePane',
  toggleShortcuts: 'toggleShortcuts',
  closeShortcuts: 'closeShortcuts',
};

const initialState = {
  isSidebarOpen: false,
  isPaneOpen: false,
  isShortcutsOpen: false,
};

function reducer(state, action) {
  switch (action) {
    case actionTypes.toggleSidebar:
      return { ...initialState, isSidebarOpen: !state.isSidebarOpen };
    case actionTypes.closeSidebar:
      return { ...state, isSidebarOpen: false };
    case actionTypes.togglePane:
      return { ...initialState, isPaneOpen: !state.isPaneOpen };
    case actionTypes.closePane:
      return { ...state, isPaneOpen: false };
    case actionTypes.toggleShortcuts:
      return { ...initialState, isShortcutsOpen: !state.isShortcutsOpen };
    case actionTypes.closeShortcuts:
      return { ...state, isShortcutsOpen: false };
    default:
      throw new Error();
  }
}

function DrawersProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const actions = useMemo(() => ({
    closeSidebar() {
      dispatch(actionTypes.closeSidebar);
    },

    toggleSidebar() {
      dispatch(actionTypes.toggleSidebar);
    },

    closePane() {
      dispatch(actionTypes.closePane);
    },

    togglePane() {
      dispatch(actionTypes.togglePane);
    },

    closeShortcuts() {
      dispatch(actionTypes.closeShortcuts);
    },

    toggleShortcuts() {
      dispatch(actionTypes.toggleShortcuts);
    },
  }), []);

  return (
    <DrawersStateContext.Provider value={state}>
      <DrawersActionsContext.Provider value={actions}>
        {children}
      </DrawersActionsContext.Provider>
    </DrawersStateContext.Provider>
  );
}

DrawersProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { useDrawersState, useDrawersActions, DrawersProvider };
