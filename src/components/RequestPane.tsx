import { withStyles, Button, CircularProgress, StyleRulesCallback, WithStyles } from '@material-ui/core';
import { PlayArrow } from '@material-ui/icons';
import * as React from 'react';
import AceEditor from 'react-ace';

import { NodesmithTheme } from '../theme';

// tslint:disable-next-line
import 'brace/mode/json';
import 'brace/theme/github';

export interface RequestPaneProps {
  sampleRequest: string;
  userRequestPayload?: string;
  setUserRequestPayload: (requestBody?: string) => void;
  sendQuery: (requestBody: string) => void;
  isSendingRequest: boolean;
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

type Props = RequestPaneProps & WithStyles<typeof styles>;

/**
 * Shows an editable JSON text pane that allows a user to enter a new JSON RPC
 * method. Component also contains the play button that a user clicks to send
 * the method on to the Nodesmith service.
 */
class RequestPane extends React.Component<Props> {
  requestBodyValid = (): boolean => {
    try {
      if (this.props.userRequestPayload) {
        JSON.parse(this.props.userRequestPayload);
      }
    } catch {
      // JSON parsing error
      return false;
    }

    return true;
  }

  onPlayButton = () => {
    if (this.props.userRequestPayload) {
      this.props.sendQuery(this.props.userRequestPayload);
    } else {
      this.props.sendQuery(this.props.sampleRequest);
    }
  }

  render() {
    const { classes, isSendingRequest, sampleRequest, userRequestPayload, setUserRequestPayload } = this.props;

    const requestValid = this.requestBodyValid();
    const buttonElement = (
      <Button
        variant="fab"
        color="primary"
        disableRipple
        disabled={!requestValid}
        onClick={this.onPlayButton}
      >
        <PlayArrow fontSize="large"  />
      </Button>
    );

    const requestBody = (!!userRequestPayload) ? userRequestPayload : sampleRequest;

    return [
      <div className={classes.root} key="request_body_input">
        <AceEditor
          placeholder=""
          mode="json"
          theme="github"
          width="100%"
          height="100%"
          name="requestPane"
          onChange={setUserRequestPayload}
          fontSize={14}
          showPrintMargin={false}
          showGutter={true}
          highlightActiveLine={false}
          value={requestBody}
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
