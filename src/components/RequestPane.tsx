import { withStyles, Button, CircularProgress, StyleRulesCallback, WithStyles } from '@material-ui/core';
import { PlayArrow } from '@material-ui/icons';
import * as React from 'react';
import AceEditor from 'react-ace';

import { NodesmithTheme } from '../theme';

// tslint:disable-next-line
import 'brace/mode/json';
import 'brace/theme/github';

export interface RequestPaneProps {
  startingRequest: string;
  sendQuery: (requestBody: string) => void;
  isSendingRequest: boolean;
}

type Props = RequestPaneProps & WithStyles<'root' | 'play' | 'fabProgress'>;

interface RequestPaneState {
  currentRequest: string;
}

const styles: StyleRulesCallback = (theme: NodesmithTheme) => ({
  root: {
    height: '100%',
  },
  play: {
    position: 'relative',
    top: '-60%',
    left: '50vw',
    marginLeft: -28,
    zIndex: 1234,
  },
  fabProgress: {
    color: theme.palette.primary.main,
    position: 'absolute',
    top: -6,
    left: -6,
    zIndex: 1,
  },
});

/**
 * Shows an editable JSON text pane that allows a user to enter a new JSON RPC
 * method. Component also contains the play button that a user clicks to send
 * the method on to the Nodesmith service.
 */
class RequestPane extends React.Component<Props, RequestPaneState> {
  constructor(props: Props, context?: any) {
    super(props, context);
    this.state = Object.assign({}, {
      currentRequest: props.startingRequest,
    });
  }

  componentWillReceiveProps(props: Props) {
    this.state = Object.assign({}, {
      currentRequest: props.startingRequest,
    });
  }

  requestBodyValid = (): boolean => {
    try {
      JSON.parse(this.state.currentRequest);
    } catch {
      // JSON parsing error
      return false;
    }

    return true;
  }

  onRequestEdit = (event: any) => {
    this.setState({ currentRequest: event });
  }

  render() {
    const { classes, sendQuery, isSendingRequest } = this.props;

    const requestValid = this.requestBodyValid();
    const buttonElement = (
      <Button
        variant="fab"
        color="primary"
        disableRipple
        disabled={!requestValid}
        onClick={() => { sendQuery(this.state.currentRequest); }}
      >
        <PlayArrow fontSize="large"  />
      </Button>
    );

    return [
      <div className={classes.root} key="request_body_input">
        <AceEditor
          placeholder=""
          mode="json"
          theme="github"
          width="100%"
          height="100%"
          name="requestPane"
          onChange={this.onRequestEdit}
          fontSize={14}
          showPrintMargin={false}
          showGutter={true}
          highlightActiveLine={false}
          value={this.state.currentRequest}
          setOptions={{
            enableBasicAutocompletion: false,
            enableLiveAutocompletion: false,
            enableSnippets: false,
            showLineNumbers: true,
            tabSize: 2,
          }}/>
      </div>,
      <div className={classes.play} key="send_disabled">
        {buttonElement}
        {isSendingRequest && <CircularProgress size={68} className={classes.fabProgress} />}
      </div>
    ];
  }
}

export default withStyles(styles)(RequestPane);
