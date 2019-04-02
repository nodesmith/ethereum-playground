import { withStyles, CircularProgress, StyleRulesCallback, Theme, WithStyles } from '@material-ui/core';
import * as React from 'react';

export interface LoadingIndicatorProps {
  isLoading: boolean;
  centerVertical?: boolean;
}

const styles: StyleRulesCallback = (theme: Theme) => ({
  root: {
    position: 'relative',
    display: 'flex',
    width: '100%',
    height: '100%',
    justifyContent: 'center'
  },
  progress: {
    marginTop: '20vh'
  },
  centerVertical: {
    marginTop: '0',
    alignSelf: 'center'
  }
});

type Props = LoadingIndicatorProps & WithStyles<typeof styles>;

/**
 * Loading indicator component which can be the only element on a page or placed inside another component.
 * If isLoading is false, does not render anything.
 */
class LoadingIndicator extends React.Component<Props> {
  render() {
    const { classes, isLoading, centerVertical } = this.props;

    if (!isLoading) {
      return null;
    }

    const progressClass = centerVertical ? classes.centerVertical : classes.progress;

    return (
      <div className={classes.root}>
        <CircularProgress className={progressClass} size={50} color="primary" variant="indeterminate" />
      </div>
    );
  }
}

export default withStyles(styles)(LoadingIndicator);
