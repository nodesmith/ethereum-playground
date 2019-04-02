import { CssBaseline } from '@material-ui/core';
import { observer } from 'mobx-react';
import * as React from 'react';
import { hot } from 'react-hot-loader';
import { HashRouter } from 'react-router-dom';

import App from './App';

@observer
class Root extends React.Component {
  render() {
    return (
      <div>
        <CssBaseline />
        <HashRouter>
          <App />
        </HashRouter>
      </div>
    );
  }
}

export default hot(module)(Root);
