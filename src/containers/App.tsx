import { withStyles, Grid, Typography, WithStyles } from '@material-ui/core';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { hot } from 'react-hot-loader';
import { withRouter, Redirect, Route, RouteComponentProps, Switch } from 'react-router-dom';

import Controls from '../components/Controls';
import Header from '../components/Header';
import LoadingIndicator from '../components/LoadingIndicator';
import RequestPane from '../components/RequestPane';
import ResponsePane from '../components/ResponsePane';
import { DropdownPair } from '../components/SingleSelectDropdown';
import AppState from '../stores/AppState';
import { NodesmithTheme } from '../theme';

export interface AppBaseProps extends RouteComponentProps {
  appState?: AppState;
}

const styles = (theme: NodesmithTheme) => ({
  root: {
    width: '100%',
    height: '100%',
    minHeight: '100vh',
    backgroundColor: '#fff'
  },
  main: {
    flexGrow: 1,
  },
  leftPane: {
    borderRight: theme.border,
  },
  headers: {
    borderBottom: theme.border
  },
});

type Props = AppBaseProps & WithStyles<typeof styles>;

interface State {
  showExamples: boolean;
}

/**
 * This serves as the main container for the application - passing the mobx state into
 * the rest of the components as needed and setting up the main routing for the app.
 */
@inject('appState')
@observer
class App extends React.Component<Props, State> {
  constructor(props: Props, context?: any) {
    super(props, context);
    this.state = Object.assign({}, {
      showExamples: false,
    });
  }

  updatePath = (network: string, example: string) => {
    this.props.appState!.setUserRequestPayload(undefined);
    this.props.appState!.changeRequestResponse('');
    this.props.history.replace(`/${network}/${example}`);
  }

  getMainComponent = (currentNetwork: string, currentRPCMethod: string, isSendingRequest: boolean, userRequestPayload?: string) => {
    const { classes, appState } = this.props;

    const { sendQuery, requestResponse, networkExamplesMap, setUserRequestPayload } = appState!;

    const startingRequest = this.props.appState!.networkExamplesMap[currentNetwork][currentRPCMethod];
    const formattedStartingRequest = JSON.stringify(JSON.parse(startingRequest), null, 2);

    return (
      <Grid container className={classes.root} direction="column" justify="flex-start">
        <Grid item xs={12}>
          <Header />
        </Grid>
        <Grid item xs={12}>
          <Controls
            network={currentNetwork}
            handleExampleSelected={(event: DropdownPair) => { this.updatePath(currentNetwork, event.label); }}
            networkExamples={networkExamplesMap[currentNetwork]}
            changeNetwork={(event: DropdownPair) => { this.updatePath(event.value, currentRPCMethod); }}
            selectedExample={currentRPCMethod}
          />
        </Grid>
        <Grid item xs={12} container direction="row" className={classes.headers}>
          <Grid item xs={6}>
            <Typography variant="subtitle1">Request Payload:</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="subtitle1">Response:</Typography>
          </Grid>
        </Grid>
        <Grid item xs={12} container direction="row" className={classes.main}>
          <Grid item xs={6}className={classes.leftPane}>
            <RequestPane
              sampleRequest={formattedStartingRequest}
              sendQuery={(requestBody: string) => { sendQuery(requestBody, currentNetwork); }}
              isSendingRequest={isSendingRequest}
              userRequestPayload={userRequestPayload}
              setUserRequestPayload={setUserRequestPayload}
            />
          </Grid>
          <Grid item xs={6}>
            <ResponsePane requestResponse={requestResponse} />
          </Grid>
        </Grid>
      </Grid>
    );
  }

  render() {
    if (this.props.appState!.isLoading) {
      return (<LoadingIndicator isLoading/>);
    }

    return (
      <Switch>
        <Route key="content" path={'/:network/:rpcMethod' } render={(props) => {
          const currentNetwork = props.match.params.network;
          const currentRPCMethod = props.match.params.rpcMethod;
          const isSendingRequest = this.props.appState!.isSendingRequest;
          const userRequestPayload = this.props.appState!.userRequestPayload;

          return this.getMainComponent(currentNetwork, currentRPCMethod, isSendingRequest, userRequestPayload);
        }} />

        <Route key="redirect" >
          { /* The default redirect is the mainnet w/ eth_blockNumber for this project. */ }
          <Redirect to={'/mainnet/eth_blockNumber'}/>
        </Route>
      </Switch>
    );
  }
}

export default hot(module)(withRouter(withStyles(styles)(App)));
