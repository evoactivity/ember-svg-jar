import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { QueryParamProvider } from 'use-query-params';
import { BreakpointsProvider } from './contexts/breakpoints';
import { DrawersProvider } from './contexts/drawers';
import { CurrentAssetProvider } from './contexts/current-asset';
import { NotifierProvider } from './contexts/notifier';
import App from './components/app';
import { BREAKPOINTS } from './constants';
import './utils/init-focus-ring';
import './styles/index.scss';

ReactDOM.render((
  <Router>
    <QueryParamProvider ReactRouterRoute={Route}>
      <BreakpointsProvider breakpoints={BREAKPOINTS}>
        <NotifierProvider>
          <DrawersProvider>
            <CurrentAssetProvider>
              <App />
            </CurrentAssetProvider>
          </DrawersProvider>
        </NotifierProvider>
      </BreakpointsProvider>
    </QueryParamProvider>
  </Router>
), document.getElementById('root'));
