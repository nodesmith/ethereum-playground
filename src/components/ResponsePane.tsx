import { withStyles, StyleRulesCallback, WithStyles } from '@material-ui/core';
import * as React from 'react';
import AceEditor from 'react-ace';

import { NodesmithTheme } from '../theme';

// tslint:disable-next-line
import 'brace/mode/json';
import 'brace/theme/github';

export interface ResponsePaneProps {
  requestResponse: string;
}

type Props = ResponsePaneProps & WithStyles<'root'>;

const styles: StyleRulesCallback = (theme: NodesmithTheme) => ({
  root: {
    height: '100%',
    overflowX: 'auto',
  },
});

/**
 * Shows a read only JSON blob with the response from the Nodesmith service.
 */
class ResponsePane extends React.Component<Props> {
  render() {
    const { classes, requestResponse } = this.props;
    let placeholder = undefined;
    if (requestResponse) {
      if (typeof requestResponse === 'string') {
        try {
          placeholder = JSON.stringify(JSON.parse(requestResponse), null, 2);
        } catch (e) {
          placeholder = { message: 'An unknown error occurred', data: requestResponse };
        }
      } else {
        // The response is already an object, just pass it on through
        placeholder = requestResponse;
      }
    }

    return (
      <div className={classes.root}>
        <AceEditor
          readOnly
          mode="json"
          theme="github"
          width="100%"
          height="100%"
          name="requestPane"
          fontSize={14}
          value={placeholder}
          showPrintMargin={false}
          showGutter={false}
          highlightActiveLine={false}
          setOptions={{
            enableBasicAutocompletion: false,
            enableLiveAutocompletion: false,
            enableSnippets: false,
            showLineNumbers: false,
            tabSize: 2,
          }}/>
      </div>
    );
  }
}

export default withStyles(styles)(ResponsePane);
