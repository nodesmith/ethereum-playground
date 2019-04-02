import { withStyles, AppBar, StyleRulesCallback, Toolbar, WithStyles } from '@material-ui/core';
import * as React from 'react';

import { NodesmithTheme } from '../theme/index';

const styles: StyleRulesCallback = (theme: NodesmithTheme) => ({
  root: {
    padding: theme.spacing.unit / 2,
    display: 'flex',
    flexDirection: 'row',
    height: theme.headerHeight,
  },
  logo: {
    height: '100%'
  },
  logoContainer: {
    textAlign: 'center',
    height: 50,
  },
  navbar: {
    boxShadow: '0px 2px 4px -1px rgba(0, 0, 0, 0.2)',
    borderBottomColor: theme.palette.primary.main,
    borderBottomStyle: 'solid',
    borderBottomWidth: 2,
    height: theme.headerHeight,
    backgroundColor: theme.palette.secondary.main,
  },
});

type Props = WithStyles<typeof styles>;

/**
 * Simple app nav bar header with a logo
 */
class Header extends React.Component<Props> {
  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <AppBar position="absolute" className={classes.navbar}>
          <Toolbar variant="dense">
            <div className={classes.logoContainer}>
              <img src="./logo_beta.svg" className={classes.logo} />
            </div>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

export default withStyles(styles)(Header);
