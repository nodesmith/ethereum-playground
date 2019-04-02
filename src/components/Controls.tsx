import { withStyles, Button, Grid, StyleRulesCallback, Typography, WithStyles } from '@material-ui/core';
import * as React from 'react';

import { ExampleCallMap, NETWORK_UI_NAMES } from '../stores/AppState';
import { NodesmithTheme } from '../theme';

import SingleSelectDropdown, { DropdownPair } from './SingleSelectDropdown';

export interface ControlsProps {
  changeNetwork: (newValue: DropdownPair) => void;
  network: string;
  networkExamples: ExampleCallMap;
  handleExampleSelected: (newValue: DropdownPair) => void;
  selectedExample: string;
}

const styles: StyleRulesCallback = (theme: NodesmithTheme) => ({
  root: {
    borderBottom: theme.border,
    padding: theme.spacing.unit * 2,
  },
  textPad: {
    paddingBottom: theme.spacing.unit
  },
  buttonLink: {
    textDecoration: 'none',
  }
});

type Props = ControlsProps & WithStyles<typeof styles>;

/**
 * Contains components that allows a user to pick a network (mainnet, kovan, etc.)
 * and a sample request to send (eth_blockNumber, etc.)
 */
class Controls extends React.Component<Props> {
  render() {
    const { classes, changeNetwork, network, networkExamples, handleExampleSelected, selectedExample } = this.props;

    const networkOptions = Object.keys(NETWORK_UI_NAMES).map(key => {
      return { value: key, label: NETWORK_UI_NAMES[key] };
    });

    const selectedNetworkOption = networkOptions.find(o => o.value === network);
    let selectedRPCCall: { value: string; label: string; };
    const examplesList = Object.keys(networkExamples).map(rpcMethod => {
      const example = {
        value: networkExamples[rpcMethod],
        label: rpcMethod
      };

      if (rpcMethod === selectedExample) {
        selectedRPCCall = example;
      }

      return example;
    });

    return (
      <div style={{ padding: 12 }}> { /* // Negative margin fix https://material-ui.com/layout/grid/ */ }
        <Grid container className={classes.root} justify="center" spacing={24}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1">Step 1: Choose a network</Typography>
            <Typography variant="caption" className={classes.textPad}>Choose one of Nodesmith's available networks.</Typography>
            <SingleSelectDropdown
              defaultValue={selectedNetworkOption!}
              options={networkOptions}
              id="api-key-select"
              zIndex={9999}
              onChange={changeNetwork} />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1">Step 2: Start with an example (optional)</Typography>
            <Typography variant="caption" className={classes.textPad}>
              Use these examples as a quick start, then edit them as needed.
            </Typography>
            <SingleSelectDropdown
              defaultValue={selectedRPCCall!}
              options={examplesList}
              id="api-key-select"
              zIndex={9998}
              onChange={handleExampleSelected} />
          </Grid>
          <Grid container item xs={12} spacing={8} justify="center">
            <Grid item xs={12}>
              <Typography variant="caption" align="center">
                Check out the <a target="_blank" href="https://beta.docs.nodesmith.io">documentation</a> for more info.
                This public app uses a limited sample API Key with <a target="_blank" href="https://nodesmith.io">Nodesmith</a> as a node provider.
              </Typography>
            </Grid>
            <Grid container item xs={12} justify="center">
              <a href="https://beta.dashboard.nodesmith.io" target="_blank" className={classes.buttonLink}>
                <Button variant="contained" color="primary">Get your own API Key</Button>
              </a>
            </Grid>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(Controls);
