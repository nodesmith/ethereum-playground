import { withStyles, StyleRulesCallback, WithStyles } from '@material-ui/core';
import * as React from 'react';
import Select from 'react-select';

import { ValueType } from 'react-select/lib/types';

import { NodesmithTheme, NODESMITH_GREEN } from '../theme';

const styles: StyleRulesCallback = (theme: NodesmithTheme) => ({
  root: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif;',
  },
  dropdown: {
    cursor: 'pointer'
  }
});

export type DropdownPair = {
  value: string;
  label: string;
};

interface SingleSelectDropdownProps {
  id: string;
  defaultValue: { value: string; label: string; };
  options: Array<{ value: string; label: string; }>;
  onChange: (newValue: DropdownPair) => void;
  zIndex: number;
}

type Props = SingleSelectDropdownProps & WithStyles<typeof styles>;

/**
 * Component that shows single select dropdown with multiple options.
 */
class SingleSelectDropdown extends React.Component<Props> {
  render() {
    const customStyles = {
      option: (base: React.CSSProperties, state: any) => {
        const backgroundColor = state.isFocused ? NODESMITH_GREEN : '#fff';
        const color = state.isFocused ? '#fff' : '#000';
        const cursor = 'pointer';

        return { ...base, backgroundColor, color, cursor };
      },
      control: (base: React.CSSProperties, state: any) => {
        const borderRadius = 0;
        const boxShadow = 'none';

        return { ...base, borderRadius, boxShadow, '&:hover': { borderColor: NODESMITH_GREEN } };
      },
      container: (base: React.CSSProperties, state: any) => {
        const zIndex = this.props.zIndex;
        return { ...base, zIndex };
      }
    };

    const { classes, defaultValue, options, id, onChange } = this.props;
    return (
      <div className={classes.root}>
        <Select
          name={id}
          className={classes.dropdown}
          defaultValue={defaultValue}
          options={options}
          styles={customStyles}
          onChange={(event: ValueType<{ value: string; label: string; }>) => { onChange(event as DropdownPair); }}
        />
      </div>
    );
  }
}

export default withStyles(styles)(SingleSelectDropdown);
