import { MuiThemeProvider } from '@material-ui/core';
import { configure } from 'mobx';
import { Provider } from 'mobx-react';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import Root from './containers/Root';
import AppState from './stores/AppState';
import { theme } from './theme';

configure({ enforceActions: true });
const appState = new AppState();

ReactDOM.render(
  <MuiThemeProvider theme={theme}>
    <Provider appState={appState} >
      <Root />
    </Provider>
  </MuiThemeProvider>,
  document.body.appendChild(document.createElement('div'))
);
