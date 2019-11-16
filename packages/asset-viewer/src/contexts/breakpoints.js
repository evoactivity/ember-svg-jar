import React, { useContext, createContext } from 'react';
import PropTypes from 'prop-types';
import useMediaQueries from '../utils/use-media-queries';

const BreakpointsContext = createContext();

function useBreakpoints() {
  const context = useContext(BreakpointsContext);

  if (context === undefined) {
    throw new Error('useBreakpoints must be used within BreakpointsProvider');
  }

  return context;
}

function addUnknownPropError(target) {
  if (typeof Proxy !== 'function') {
    return target;
  }

  return new Proxy(target, {
    get(obj, prop) {
      if (prop in obj) {
        return obj[prop];
      }

      throw new ReferenceError(`Unknown prop "${prop}"`);
    },
  });
}

function BreakpointsProvider({ children, breakpoints }) {
  const mq = useMediaQueries(breakpoints);

  return (
    <BreakpointsContext.Provider value={addUnknownPropError(mq)}>
      {children}
    </BreakpointsContext.Provider>
  );
}

BreakpointsProvider.propTypes = {
  children: PropTypes.node.isRequired,
  breakpoints: PropTypes.objectOf(PropTypes.string),
};

BreakpointsProvider.defaultProps = {
  breakpoints: {
    small: '(min-width: 768px)',
    medium: '(min-width: 920px)',
    large: '(min-width: 1200px)',
  },
};

export { BreakpointsProvider, useBreakpoints };
